import express from "express";
import { routerVideos } from "./routes/videos-router";


export const app = express()

const parser = express.json()
app.use(parser)

// app.use('/testing', )
app.use('/videos', routerVideos)