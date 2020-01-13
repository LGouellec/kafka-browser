"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TokenProvider_1 = __importDefault(require("../idp/TokenProvider"));
const KafkaClient_1 = __importDefault(require("../kafka/KafkaClient"));
class LoginController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new KafkaClient_1.default();
            const tokenProvider = new TokenProvider_1.default();
            const user = req.query.user;
            const pwd = req.query.password;
            const response = yield client.login(user, pwd);
            if (response) {
                const tokenResponse = tokenProvider.generate(user);
                tokenProvider.add(tokenResponse.token, user, pwd, tokenResponse.expirationDate);
                res.send({
                    token: tokenResponse.token,
                    maxAge: tokenResponse.expireTime,
                    expireDate: tokenResponse.expirationDate
                });
                res.end();
            }
            else {
                return res.status(401).end();
            }
        });
    }
    refresh(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.header("authorization");
            const tokenProvider = new TokenProvider_1.default();
            var tokenInfo = tokenProvider.refresh(token);
            if (tokenInfo) {
                res.send({
                    token: tokenInfo.token,
                    maxAge: tokenInfo.expireTime,
                    expireDate: tokenInfo.expirationDate
                }).end();
            }
            else
                return res.status(400).end();
        });
    }
}
exports.LoginController = LoginController;
exports.default = LoginController;
//# sourceMappingURL=LoginController.js.map