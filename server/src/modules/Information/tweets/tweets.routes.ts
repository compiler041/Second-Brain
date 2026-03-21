import { Router } from "express";
import { alltweets, createtweet, singletweet } from "./tweets.controller.js";

const tweetrouter=Router();

tweetrouter.post("/addtweet",createtweet);
tweetrouter.post("/addtweet",alltweets);
tweetrouter.post("/addtweet",singletweet);
