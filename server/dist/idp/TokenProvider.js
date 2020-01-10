"use strict";
// https://stormpath.com/blog/nodejs-jwt-create-verify
// https://www.sohamkamani.com/blog/javascript/2019-03-29-node-jwt-authentication/
// https://developer.okta.com/blog/2018/11/13/create-and-verify-jwts-with-node
Object.defineProperty(exports, "__esModule", { value: true });
class TokenProvider {
    constructor() {
        this.tokens = {};
    }
    get(token) {
        const e = this.tokens[token] ? this.tokens[token] : null;
        if (e) {
            if (Date.now() > e.expirationDate.getDate()) {
                this.tokens[token] = undefined;
                return null;
            }
            else {
                return e;
            }
        }
    }
    add(token, user, password) {
        if (!this.tokens[token]) {
            this.tokens[token] = {
                expirationDate: new Date(Date.now() + 3600000),
                user,
                password
            };
        }
    }
}
exports.TokenProvider = TokenProvider;
exports.default = TokenProvider;
//# sourceMappingURL=TokenProvider.js.map