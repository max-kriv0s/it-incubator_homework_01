import express from "express";
import { routerTesting } from "./routes/testing";
import { routerVideos } from "./routes/videos-router";


export const app = express()

const parser = express.json()
app.use(parser)

app.use('/testing', routerTesting)
app.use('/videos', routerVideos)