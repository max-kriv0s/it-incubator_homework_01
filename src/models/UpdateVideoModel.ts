import { Resolutions } from "./VideoViewModel"

export type UpdateVideoModel = {
    title: string
    author: string
    availableResolutions?: Resolutions[]
    canBeDownloaded?: boolean
    minAgeRestriction?: number
    publicationDate?: string
}