const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
ac.grant("basic")
 .readOwn("profile")
 .updateOwn("profile")
 .readOwn("condidate")
 .updateOwn("condidate")
 .readOwn("contact")
 .updateOwn("contact")
 

ac.grant("supervisor")
 .extend("basic")
 .readAny("profile")
 .readAny("condidate")
 .readAny("contact")
 
ac.grant("admin")
 .extend("basic")
 .extend("supervisor")
 .updateAny("profile")
 .deleteAny("profile")
 .updateAny("condidate")
 .deleteAny("condidate")
 .updateAny("contact")
 .deleteAny("contact")
 
return ac;
})();