import { Resolutions } from "./VideoViewModel"

export type CreateVideoModel = {
    title: string
    author: string
    availableResolutions: Resolutions[]
}