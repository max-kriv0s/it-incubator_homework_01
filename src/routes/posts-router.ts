import { Router, Request, Response } from "express"


export const routerPosts = Router()

routerPosts.get('/', (req: Request, res: Response) => {
    res.send("")
})