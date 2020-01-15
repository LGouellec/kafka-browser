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
// https://www.freecodecamp.org/news/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0/
// https://www.npmjs.com/package/@kafkajs/confluent-schema-registry
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const LoginController_1 = __importDefault(require("./controllers/LoginController"));
const TopicController_1 = __importDefault(require("./controllers/TopicController"));
const ConsumerController_1 = __importDefault(require("./controllers/ConsumerController"));
const Middleware_1 = __importDefault(require("./middlewares/Middleware"));
const app = express_1.default();
const port = process.env.PORT || 5000;
const login = new LoginController_1.default();
const topic = new TopicController_1.default();
const consumer = new ConsumerController_1.default();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
Middleware_1.default(app);
app.get("/api/login", login.login);
app.get("/api/refresh", login.refresh);
app.get("/api/topics", topic.getTopics);
app.get("/api/topics/:topicName/config", topic.getConfig);
app.get("/api/topics/:topicName/offsets", topic.getOffsets);
app.get("/api/consumers/:topicName", consumer.consume);
app.listen(port, () => console.log(`Listening on port ${port}`));
const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];
errorTypes.map((type) => {
    process.on(type, (e) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(`process.on ${type}`);
            console.error(e);
            process.exit(0);
        }
        catch (_) {
            process.exit(1);
        }
    }));
});
signalTraps.map((type) => {
    process.once(type, () => __awaiter(void 0, void 0, void 0, function* () {
        try {
        }
        finally {
            process.kill(process.pid, type);
        }
    }));
});
//# sourceMappingURL=server.js.map