"use strict";
// https://www.sohamkamani.com/blog/javascript/2019-03-29-node-jwt-authentication/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenExpired {
}
exports.TokenExpired = TokenExpired;
class TokenProvider {
    constructor() {
        this.jwtExpirySeconds = 3600;
    }
    get(token) {
        const e = TokenProvider.tokens[token] ? TokenProvider.tokens[token] : null;
        if (e) {
            if (Date.now() > new Number(e.expirationDate)) {
                var t = new TokenExpired();
                t.expirationDate = e.expirationDate;
                t.user = e.user;
                t.password = undefined;
                delete TokenProvider.tokens[token];
                return t;
            }
            else {
                return e;
            }
        }
    }
    add(token, user, password, expirationDate) {
        if (!TokenProvider.tokens[token]) {
            TokenProvider.tokens[token] = {
                expirationDate,
                user,
                password
            };
        }
    }
    refresh(token) {
        var tokenInfo = this.get(token);
        if (tokenInfo) {
            var response = this.generate(tokenInfo.user);
            this.add(response.token, tokenInfo.user, tokenInfo.password, response.expirationDate);
            delete TokenProvider.tokens[token];
            return response;
        }
    }
    verify(token) {
        var payload;
        try {
            payload = jsonwebtoken_1.default.verify(token, TokenProvider.privateKey);
            if (payload)
                return this.get(token);
            else
                return undefined;
        }
        catch (e) {
            if (e instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                if (TokenProvider.tokens[token]) {
                    TokenProvider.tokens[token] = undefined;
                    return new TokenExpired();
                }
                else
                    return undefined;
            }
            return undefined;
        }
    }
    generate(user) {
        const claims = {
            sub: user,
            iss: "http://localhost",
            permissions: "read-topics"
        };
        const token = jsonwebtoken_1.default.sign({ user }, TokenProvider.privateKey, {
            algorithm: "HS256",
            expiresIn: this.jwtExpirySeconds
        });
        const res = {
            expirationDate: new Date(Date.now() + this.jwtExpirySeconds * 1000),
            expireTime: this.jwtExpirySeconds * 1000,
            token
        };
        return res;
    }
}
exports.TokenProvider = TokenProvider;
TokenProvider.tokens = {};
TokenProvider.privateKey = "azerty123456789";
exports.default = TokenProvider;
//# sourceMappingURL=TokenProvider.js.map