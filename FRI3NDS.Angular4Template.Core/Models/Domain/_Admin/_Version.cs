using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Models.Domain._Admin
{
	public class _Version : _VersionBase
	{
		public string ScriptBody { get; set; }
	}
	public class _VersionBase
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string ScriptHash { get; set; }
		public string Description { get; set; }
		public DateTime? AppliedOn { get; set; }
	}
}
