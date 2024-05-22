import express from "express";
import { IgApiClient } from "instagram-private-api";
import {
  withFbnsAndRealtime,
  withFbns,
  withRealtime,
  GraphQLSubscriptions,
  SkywalkerSubscriptions,
} from "instagram_mqtt";
import cors from "cors";
import bodyparser from "body-parser";
import fs from "fs";

// const username = "rishiii.fs";
// const password = "218.108.149.373";

const username = "fishi4189";
const password = "hrushi2001";

const ig = withFbnsAndRealtime(new IgApiClient());

ig.state.generateDevice(username);

const app = express();
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyparser.json());
const port = 4000;

function logEvent(name: string) {
  return (data: any) => console.log(name, data);
}

const main = async () => {
  // Load session from file if exists
  const sessionFilePath = "./session.json";
  let isAuthenticated = false;

  try {
    const sessionData = fs.readFileSync(sessionFilePath, "utf-8");
    await ig.state.deserialize(sessionData);
    isAuthenticated = true;
    console.log("Session loaded from file");
  } catch (err) {
    console.log("No session file found, logging in...");
  }

  if (!isAuthenticated && true) {
    // Login to Instagram
    await ig.simulate.preLoginFlow();
    const loggedInUser = await ig.account.login(username, password);
    process.nextTick(async () => await ig.simulate.postLoginFlow());

    // Save session to file
    const sessionData = await ig.state.serialize();
    delete sessionData.constants; // Remove constants property before saving
    fs.writeFileSync(sessionFilePath, JSON.stringify(sessionData));
    console.log("Session saved to file");
  }

  ig.realtime.on("receive", (topic, messages) =>
    console.log("receive", topic, messages)
  );
  // this is called with a wrapper use {message} to only get the "actual" message from the wrapper
  ig.realtime.on("message", logEvent("messageWrapper"));

  // whenever the client has a fatal error
  ig.realtime.on("error", console.error);

  ig.realtime.on("close", () => console.error("RealtimeClient closed"));

  // connect
  // this will resolve once all initial subscriptions have been sent
  await ig.realtime.connect({
    // optional
    graphQlSubs: [
      // these are some subscriptions
      GraphQLSubscriptions.getAppPresenceSubscription(),
      GraphQLSubscriptions.getZeroProvisionSubscription(ig.state.phoneId),
      GraphQLSubscriptions.getDirectStatusSubscription(),
      GraphQLSubscriptions.getDirectTypingSubscription(ig.state.cookieUserId),
      GraphQLSubscriptions.getAsyncAdSubscription(ig.state.cookieUserId),
    ],
    // optional
    skywalkerSubs: [
      SkywalkerSubscriptions.directSub(ig.state.cookieUserId),
      SkywalkerSubscriptions.liveSub(ig.state.cookieUserId),
    ],
    // optional
    // this enables you to get direct messages
    irisData: await ig.feed.directInbox().request(),
    // optional
    // in here you can change connect options
    // available are all properties defined in MQTToTConnectionClientInfo
    connectOverrides: {},
  });

  app.get("/threads", async (req, res) => {
    const threads = await ig.feed.directInbox().items();

    return res.json(threads);
  });

  app.post("/conv", async (req, res) => {
    const data = req.body;

    const thread_id: string = data.thread_id;
    console.log(thread_id);

    const thread = ig.feed.directThread({
      thread_id: thread_id,
      oldest_cursor: "",
    });

    // Get all messages in the thread
    const messages = await thread.items();

    return res.json(messages);
  });

  app.post("/send", async (req, res) => {
    const data = req.body;

    const thread_id: string = data.thread_id;
    const message: string = data.message;

    const thread = ig.entity.directThread(thread_id);
    await thread.broadcastText(message);

    return res.json({});
  });

  app.get("/", async (req, res) => {
    // await ig.simulate.postLoginFlow();
    // const test = ig.feed.directInbox();

    const igUser = await ig.user.searchExact("rishiiii.fs"); // Replace 'target_username' with the actual username

    // Send a direct message
    await ig.entity
      .directThread([igUser.pk.toString()])
      .broadcastText("Hello from the Instagram API!");

    res.json({});
  });

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};

main();
