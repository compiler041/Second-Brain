import { Router } from "express";
import { createtweet, alltweets, singletweet, removeTweet } from "./tweets.controller.js";

const tweetrouter = Router();

tweetrouter.post("/", createtweet);
tweetrouter.get("/", alltweets);
tweetrouter.post("/search", singletweet);
tweetrouter.delete("/:tweet_id", removeTweet);

export default tweetrouter;
