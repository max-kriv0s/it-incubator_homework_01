import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { PostViewModel } from "../models/posts/PostViewModel";
import { VideoViewModel } from "../models/videos/VideoViewModel";

export type DataBaseModel = VideoViewModel[] 
                            | BlogViewModel[] 
                            | PostViewModel[]