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
const app = express_1.default();
const port = process.env.PORT || 5000;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// const kafka = new Kafka({
//   clientId: "kafka-node-test",
//   brokers: ["192.168.56.1:9092"],
//   sasl: {
//     mechanism: "scram-sha-512",
//     password: "Michelin/1",
//     username: "admin"
//   },
// });
// const admin = kafka.admin();
// const adminConsole = async () => {
//   await admin.connect();
//   const topics = await admin.fetchTopicMetadata({topics: undefined});
//   topics.topics.forEach((t) => {
//     console.log(t.name);
//   });
// };
// adminConsole();
// const producer = kafka.producer();
// const getRandomNumber = () => Math.round(Math.random() * 1000);
// const createMessage = (num: number) => ({
//   key: `key-${num}`,
//   value: `value-${num}-${new Date().toISOString()}`,
// });
// const connect = async function() {
//   await producer.connect();
// };
// connect();
// app.get("/api/send", async (req, res) => {
//   producer.send({
//     topic: "kafka-browser",
//     messages: [createMessage(getRandomNumber())]
//   })
//     .then(console.log)
//     .catch((e) => console.error(`[example/producer] ${e.message}`, e));
//   res.send("Message sent !");
// });
const login = new LoginController_1.default();
app.get("/api/coucou", login.login);
app.listen(port, () => console.log(`Listening on port ${port}`));
const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];
errorTypes.map((type) => {
    process.on(type, (e) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(`process.on ${type}`);
            console.error(e);
            // await consumer.disconnect()
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
            // await consumer.disconnect()
        }
        finally {
            process.kill(process.pid, type);
        }
    }));
});
//# sourceMappingURL=server.js.map