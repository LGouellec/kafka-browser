import { Express } from "express";
import TokenProvider, {TokenExpired} from '../idp/TokenProvider';

export function applyMiddlewares(app: Express) {
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
                else{
                    var provider = new TokenProvider();
                    var info = provider.verify(token);
                    if(!info)
                      res.status(401).end();
                    else{
                        if(info instanceof TokenExpired)
                          res.status(400).send("Error validating access token: " + info.expirationDate + " The current time is " + new Date() + ".").end();
                        else
                          next();
                    }
                }
            } else {
                res.status(401).end();
            }
        }
         else {
            next();
        }
    });
}

export default applyMiddlewares;
