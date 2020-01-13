// https://www.freecodecamp.org/news/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0/
// https://www.npmjs.com/package/@kafkajs/confluent-schema-registry
import bodyParser from "body-parser";
import express from "express";
import LoginController from "./controllers/LoginController";
import TopicController from "./controllers/TopicController";
import applyMiddlewares from './middlewares/Middleware';

const app = express();
const port = process.env.PORT || 5000;
const login = new LoginController();
const topic = new TopicController();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

applyMiddlewares(app);

app.get("/api/login", login.login);
app.get("/api/refresh", login.refresh);
app.get("/api/topics", topic.getTopics);
app.get("/api/topics/:topicName/config", topic.getConfig);
app.get("/api/topics/:topicName/offsets", topic.getOffsets);
// TODO :
app.get("/api/consumers/:topicName", (r,s) => {});

app.listen(port, () => console.log(`Listening on port ${port}`));

const errorTypes = ["unhandledRejection", "uncaughtException"] as const;
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"] as const;

errorTypes.map((type) => {
  (process as NodeJS.EventEmitter).on(type, async (e) => {
    try {
      console.log(`process.on ${type}`);
      console.error(e);
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.map((type) => {
  process.once(type, async () => {
    try {
    } finally {
      process.kill(process.pid, type);
    }
  });
});
