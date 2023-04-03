import { Router, Request, Response } from "express"


export const routerBlogs = Router()

routerBlogs.get('/', (req: Request, res: Response) => {
    res.send("")
})