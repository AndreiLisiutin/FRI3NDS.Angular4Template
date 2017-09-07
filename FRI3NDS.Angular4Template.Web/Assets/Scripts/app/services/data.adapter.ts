// CREDIT:
//  The vast majority of this code came right from Ben Nadel's post:
//  http://www.bennadel.com/blog/3047-creating-specialized-http-clients-in-angular-2-beta-8.htm
// Typescript version written by Sam Storie
// https://blog.sstorie.com/adapting-ben-nadels-apigateway-to-pure-typescript/
// My updates are mostly adapting it for Typescript:
//  1. Importing required modules
//  2. Adding type notations
//  3. Using the 'fat-arrow' syntax to properly scope in-line functions

import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { JwtHelper } from "angular2-jwt";
import { UserLoginModel, TokenInfo } from "models/viewModels/AuthenticationViewModels";

export class DataServiceOptions {
	public method: RequestMethod;
	public url: string;
	public headers: any = {};
	public params = {};
	public data = {};
}

@Injectable()
export class DataAdapter {
	/**
	 * Ключ, по которому лежит токен в sessionStorage.
	 */
	private _AUTH_TOKEN_KEY = 'AUTH_TOKEN';
	private _AUTH_REFRESH_TOKEN_KEY = 'AUTH_REFRESH_TOKEN';
	private _XSRF_TOKEN_HEADER = 'X_XSRF_TOKEN';

	// Define the internal Subject we'll use to push the command count
	public pendingCommandsSubject = new Subject<number>();
	public pendingCommandCount = 0;

	// Provide the *public* Observable that clients can subscribe to
	public pendingCommands$: Observable<number>;

	private jwtHelper: JwtHelper = new JwtHelper();

	constructor(public http: Http) {
		this.pendingCommands$ = this.pendingCommandsSubject.asObservable();
	}

	// I perform a GET request to the API, appending the given params
	// as URL search parameters. Returns a stream.
	public get(url: string, params?: any): Observable<Response> {
		const options = new DataServiceOptions();
		options.method = RequestMethod.Get;
		options.url = url;
		options.params = params;
		return this.request(options);
	}

	// I perform a POST request to the API. If both the params and data
	// are present, the params will be appended as URL search parameters
	// and the data will be serialized as a JSON payload. If only the
	// data is present, it will be serialized as a JSON payload. Returns
	// a stream.
	public post(url: string, data?: any, params?: any): Observable<Response> {
		if (!data) {
			data = params;
			params = {};
		}
		const options = new DataServiceOptions();
		options.method = RequestMethod.Post;
		options.url = url;
		options.params = params;
		options.data = data;
		return this.request(options);
	}

	public put(url: string, data?: any, params?: any): Observable<Response> {
		if (!data) {
			data = params;
			params = {};
		}
		const options = new DataServiceOptions();
		options.method = RequestMethod.Put;
		options.url = url;
		options.params = params;
		options.data = data;
		return this.request(options);
	}

	public delete(url: string): Observable<Response> {
		const options = new DataServiceOptions();
		options.method = RequestMethod.Delete;
		options.url = url;
		return this.request(options);
	}

	public getAuthToken(): string {
		return sessionStorage.getItem(this._AUTH_TOKEN_KEY) || null;
	}
	public getRefreshToken(): string {
		return sessionStorage.getItem(this._AUTH_REFRESH_TOKEN_KEY) || null;
	}

	public setAuthToken(token: string) {
		sessionStorage.setItem(this._AUTH_TOKEN_KEY, token);
	}
	public setRefreshToken(token: string) {
		sessionStorage.setItem(this._AUTH_REFRESH_TOKEN_KEY, token);
	}

	public clearAuthToken() {
		sessionStorage.removeItem(this._AUTH_TOKEN_KEY);
	}
	public clearRefreshToken() {
		sessionStorage.removeItem(this._AUTH_REFRESH_TOKEN_KEY);
	}

	/**
	 * Проверить, аутентифицирован ли текущий пользователь.
	 */
	isAuthenticated(): boolean {
		return this.getAuthToken() != null;
	}

	/**
	 * Проверить, аутентифицирован ли текущий пользователь.
	 */
	isTokenExpired(): boolean {
		var token = this.getAuthToken();
		return token && this.jwtHelper.isTokenExpired(token);
	}

	/**
	 * Получить инфу по токену. TODO: переписать на модель.
	 */
	getAuthTokenInfo(): any {
		var token = this.getAuthToken();
		return token && this.jwtHelper.decodeToken(token);
	}

	/**
	 * Запрос на обновление токена. Если в данное время он не проходит, то NULL.
	 */
	private tokenRefreshingObservable: Observable<Response>;

    /**
	* Выполнить произвольный запрос.
	* @param {DataServiceOptions} options параметры запроса.
	* @returns Результат запроса.
	*/
	private request(options: DataServiceOptions): Observable<Response> {
		if (this.tokenRefreshingObservable != null) {
			//если токен обновляется прямо сейчас, подписаться на обновление и подождать, потом выполниться.
			return this.tokenRefreshingObservable.flatMap((response) => {
				return this._request(options);
			});
		} else if (this.getAuthToken() && this.isTokenExpired() && this.getRefreshToken()) {
			//если истекло действие токена аутентификации, обновить его через токен обновления токена.
			var refreshOptions: DataServiceOptions = new DataServiceOptions();
			refreshOptions.method = RequestMethod.Post;
			refreshOptions.url = "/api/Authentication/RefreshToken";
			refreshOptions.data = {
				refreshToken: this.getRefreshToken(),
				usreId: this.getAuthTokenInfo().nameid
			};

			this.tokenRefreshingObservable = this._request(refreshOptions)
				.catch((error: Response) => {
					this.tokenRefreshingObservable = null;
					console.log(error);
					this.clearRefreshToken();
					this.clearAuthToken();
					return Observable.of(error);
				})
				.do((response: Response) => {
					this.tokenRefreshingObservable = null;
					var result = response.ok && response.json() as TokenInfo;
					if (result) {
						this.setAuthToken(result.token);
						this.setRefreshToken(result.refreshToken);
					}
					return result;
				})
				.share();
			
			return this.tokenRefreshingObservable.flatMap((res) => {
					return this._request(options);
				});
		} else {
			//если токен аутентификации жив, ничего не делать
			return this._request(options);
		}
	}

    /**
     * Выполнить запрос. Просто запрос.
     * @param options Параметры запроса.
     */
	private _request(options: DataServiceOptions): Observable<Response> {
		options.method = (options.method || RequestMethod.Get);
		options.url = (options.url || '');
		options.headers = (options.headers || {});
		options.params = (options.params || {});
		options.data = (options.data || {});

		this.interpolateUrl(options);
		this.addXsrfToken(options);
		this.addContentType(options);
		this.addAuthToken(options);

		const requestOptions = new RequestOptions();
		requestOptions.method = options.method;
		requestOptions.url = options.url;
		requestOptions.headers = options.headers;
		requestOptions.search = this.buildUrlSearchParams(options.params);
		requestOptions.body = JSON.stringify(options.data);

		this.pendingCommandsSubject.next(++this.pendingCommandCount);

		const stream = this.http.request(options.url, requestOptions)
			.catch((error: any) => {
				console.log(error);
				return Observable.throw(error);
			})
			.finally(() => {
				this.pendingCommandsSubject.next(--this.pendingCommandCount);
			});

		return stream;
	}

	private addContentType(options: DataServiceOptions): DataServiceOptions {
		options.headers['Content-Type'] = 'application/json; charset=UTF-8';
		return options;
	}

	private addAuthToken(options: DataServiceOptions): DataServiceOptions {
		const authTokens = this.getAuthToken();
		if (authTokens) {
			options.headers.Authorization = 'Bearer ' + authTokens;
		}
		return options;
	}

	private extractValue(collection: any, key: string): any {
		const value = collection[key];
		delete (collection[key]);
		return value;
	}

	private addXsrfToken(options: DataServiceOptions): DataServiceOptions {
		const xsrfToken = this.getXsrfCookie();
		if (xsrfToken) {
			options.headers[this._XSRF_TOKEN_HEADER] = xsrfToken;
		}
		return options;
	}

	private getXsrfCookie(): string {
		const matches = document.cookie.match(/\X_XSRF_TOKEN=([^\s;]+)/);
		try {
			return matches ? decodeURIComponent(matches[1]) : '';
		} catch (decodeError) {
			return '';
		}
	}

	// private addCors(options: DataServiceOptions): DataServiceOptions {
	//     options.headers['Access-Control-Allow-Origin'] = '*';
	//     return options;
	// }

	private buildUrlSearchParams(params: any): URLSearchParams {
		const searchParams = new URLSearchParams();
		for (const key in params) {
			if (params.hasOwnProperty(key)) {
				searchParams.append(key, params[key]);
			}
		}
		return searchParams;
	}

	private interpolateUrl(options: DataServiceOptions): DataServiceOptions {
		options.url = options.url.replace(/:([a-zA-Z]+[\w-]*)/g, ($0, token) => {
			// Try to move matching token from the params collection.
			if (options.params.hasOwnProperty(token)) {
				return (this.extractValue(options.params, token));
			}
			// Try to move matching token from the data collection.
			if (options.data.hasOwnProperty(token)) {
				return (this.extractValue(options.data, token));
			}
			// If a matching value couldn't be found, just replace
			// the token with the empty string.
			return ('');
		});
		// Clean up any repeating slashes.
		options.url = options.url.replace(/\/{2,}/g, '/');
		// Clean up any trailing slashes.
		options.url = options.url.replace(/\/+$/g, '');

		return options;
	}
}
