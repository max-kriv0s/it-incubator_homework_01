import express from "express";
import dotenv from 'dotenv'
dotenv.config() 

import cookieParser from "cookie-parser";
import { routerTesting } from "./routes/testing-router";
import { routerBlogs } from "./routes/blogs/blogs-router";
import { routerPosts } from "./routes/posts/posts-router";
import { routerUsers } from "./routes/users/users-router";
import { routerAuth } from "./routes/auth-router/auth-router";
import { commentsRouter } from "./routes/comments-router/comments-router";
import { SecurityDevicesRouter } from "./routes/security-devices/security-devices-router";
import { BearerMiddleware } from "./middlewares/BearerAuth-middleware";


export const app = express()

app.set('trust proxy', true)
app.use(express.json())
app.use(cookieParser())

app.use(BearerMiddleware)

app.use('/testing', routerTesting)
app.use('/blogs', routerBlogs)
app.use('/posts', routerPosts)
app.use('/users', routerUsers)
app.use('/auth', routerAuth)
app.use('/comments', commentsRouter)
app.use('/security/devices', SecurityDevicesRouter)