import { Resolutions } from "../db/db"

export type CreateVideoModel = {
    title: string
    author: string
    availableResolutions: Resolutions[]
}