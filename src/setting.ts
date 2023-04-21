import express from "express";
import dotenv from 'dotenv'
dotenv.config()

import { routerVideos } from "./routes/videos-router";
import { routerTesting } from "./routes/testing-router";
import { routerBlogs } from "./routes/blogs-router";
import { routerPosts } from "./routes/posts-router";


export const app = express()

app.use(express.json())

app.use('/testing', routerTesting)
app.use('/videos', routerVideos)
app.use('/blogs', routerBlogs)
app.use('/posts', routerPosts)