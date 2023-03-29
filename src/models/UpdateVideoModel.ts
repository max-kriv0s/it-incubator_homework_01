
export type UpdateVideoModel = {
    title: string
    author: string
    availableResolutions?: []
    canBeDownloaded?: boolean
    minAgeRestriction?: number
    publicationDate?: string
}