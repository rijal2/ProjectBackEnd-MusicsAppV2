const ClientError = require("./ClientError");

class AuthorizError extends ClientError{
    constructor(message){
        super(message, 403);
        this.name = 'AuthorizationError'
    }
}

module.exports = AuthorizError;