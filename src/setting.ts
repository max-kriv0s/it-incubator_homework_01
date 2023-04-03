import express from "express";

import { routerVideos } from "./routes/videos-router";
import { routerTesting } from "./routes/testing-router";
import { routerBlogs } from "./routes/blogs-router";
import { routerPosts } from "./routes/posts-router";


export const app = express()

const parser = express.json()
app.use(parser)

app.use('/testing', routerTesting)
app.use('/videos', routerVideos)
app.use('/blogs', routerBlogs)
app.use('/posts', routerPosts)