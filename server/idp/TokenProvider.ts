// https://stormpath.com/blog/nodejs-jwt-create-verify
// https://www.sohamkamani.com/blog/javascript/2019-03-29-node-jwt-authentication/
// https://developer.okta.com/blog/2018/11/13/create-and-verify-jwts-with-node

export interface TokenInformation {
    expirationDate: Date;
    user: string;
    password: string;
}

export class TokenProvider {
    private static tokens: { [token: string]: TokenInformation; } = {};

    constructor() {
    }

    public get(token: string): TokenInformation {
        const e = TokenProvider.tokens[token] ? TokenProvider.tokens[token] : null;
        if (e) {
            if (Date.now() > e.expirationDate.getDate()) {
                TokenProvider.tokens[token] = undefined;
                return null;
            } else {
                return e;
            }
        }
    }

    public add(token: string, user: string , password: string) {
        if (!TokenProvider.tokens[token]) {
            TokenProvider.tokens[token] = {
                expirationDate: new Date(Date.now() + 3600000),
                user,
                password
            };
        }
    }
}

export default TokenProvider;
