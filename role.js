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
 .readOwn("event")
 .updateOwn("event")
 .readOwn("decfiscmens")
 .updateOwn("decfiscmens")
 

ac.grant("supervisor")
 .extend("basic")
 .readAny("profile")
 .readAny("condidate")
 .readAny("contact")
 .readAny("event")
 .readAny("decfiscmens")
 
ac.grant("admin")
 .extend("basic")
 .extend("supervisor")
 .updateAny("profile")
 .deleteAny("profile")
 .updateAny("condidate")
 .deleteAny("condidate")
 .updateAny("contact")
 .deleteAny("contact")
 .updateAny("event")
 .deleteAny("event")
 .updateAny("decfiscmens")
 .deleteAny("decfiscmens")
 
return ac;
})();