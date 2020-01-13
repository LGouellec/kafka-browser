"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const TokenProvider_1 = __importStar(require("../idp/TokenProvider"));
function applyMiddlewares(app) {
    app.use(function (req, res, next) {
        // console.log(req.path);
        // console.log(req.headers);
        if (!req.path.includes("/api/login")) {
            if (req.headers && req.headers.authorization) {
                req.headers.authorization = req.headers.authorization.replace("Bearer", "").trim();
                var token = req.headers.authorization;
                if (!token) {
                    return res.status(401).end();
                }
                else {
                    var provider = new TokenProvider_1.default();
                    var info = provider.verify(token);
                    if (!info)
                        res.status(401).end();
                    else {
                        if (info instanceof TokenProvider_1.TokenExpired)
                            res.status(400).send("Error validating access token: " + info.expirationDate + " The current time is " + new Date() + ".").end();
                        else
                            next();
                    }
                }
            }
            else {
                res.status(401).end();
            }
        }
        else {
            next();
        }
    });
}
exports.applyMiddlewares = applyMiddlewares;
exports.default = applyMiddlewares;
//# sourceMappingURL=Middleware.js.map