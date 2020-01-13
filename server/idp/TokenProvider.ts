// https://www.sohamkamani.com/blog/javascript/2019-03-29-node-jwt-authentication/

import jwt  from "jsonwebtoken";

export interface TokenInformation {
    expirationDate: Date;
    user: string;
    password: string;
}

export class TokenExpired implements TokenInformation {
    expirationDate: Date;    
    user: string;
    password: string;
}

export interface TokenResponse {
    expirationDate: Date;
    expireTime: number;
    token: string;
}

export class TokenProvider {
    private static tokens: { [token: string]: TokenInformation; } = {};
    private static privateKey: string = "azerty123456789";
    private jwtExpirySeconds = 3600;

    constructor() {
    }

    public get(token: string): TokenInformation {
        const e = TokenProvider.tokens[token] ? TokenProvider.tokens[token] : null;
        if (e) {
            if (Date.now() > new Number(e.expirationDate)) {
                var t = new TokenExpired();
                t.expirationDate = e.expirationDate;
                t.user = e.user;
                t.password = undefined;
                delete TokenProvider.tokens[token];
                return t;
            } else {
                return e;
            }
        }
    }

    public add(token: string, user: string , password: string, expirationDate: Date) {
        if (!TokenProvider.tokens[token]) {
            TokenProvider.tokens[token] = {
                expirationDate,
                user,
                password
            };
        }
    }

    public refresh(token: string) : TokenResponse {
        var tokenInfo = this.get(token);
        if (tokenInfo) {
            var response = this.generate(tokenInfo.user);
            this.add(response.token, tokenInfo.user, tokenInfo.password, response.expirationDate);
            delete TokenProvider.tokens[token];
            return response;
        }
    }

    public verify(token: string) : TokenInformation {
        var payload
        try {
            payload = jwt.verify(token, TokenProvider.privateKey)
            if(payload)
                return this.get(token);
            else
                return undefined;
        } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                if (TokenProvider.tokens[token]){
                    TokenProvider.tokens[token] = undefined;
                    return new TokenExpired();
                }
                else
                  return undefined;
            }
            return undefined;
        }
    }

    public generate(user: string): TokenResponse {
        const claims = {
            sub: user,
            iss: "http://localhost",
            permissions: "read-topics"
        };
        
        const token = jwt.sign({ user }, TokenProvider.privateKey, {
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

export default TokenProvider;
