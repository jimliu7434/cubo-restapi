const Validator = require('uuid-validate');

module.exports = {
    IsUUID: (toTest) => {
        // Check deviceid is an UUID or not
        return Validator(toTest, 4);
    },
}