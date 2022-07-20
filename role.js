const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
ac.grant("basic")
 .readOwn("profile")
 .updateOwn("profile")
 .readOwn("condidate")
 .updateOwn("condidate")
 

ac.grant("supervisor")
 .extend("basic")
 .readAny("profile")
 .readAny("condidate")
 
ac.grant("admin")
 .extend("basic")
 .extend("supervisor")
 .updateAny("profile")
 .deleteAny("profile")
 .updateAny("condidate")
 .deleteAny("condidate")
 
return ac;
})();