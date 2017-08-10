using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FRI3NDS.Angular4Template.Web.Infrastructure
{
    public interface ITokensStorage
    {
        void Store(int id, string token);
        string Get(int id);
    }

    public class TokensStorage : ITokensStorage
    {
        private Dictionary<int, string> _tokens = new Dictionary<int, string>();

        public string Get(int id)
        {
            return _tokens.ContainsKey(id) ? _tokens[id] : null;
        }

        public void Store(int id, string token)
        {
            _tokens[id] = token;
        }
    }
}
