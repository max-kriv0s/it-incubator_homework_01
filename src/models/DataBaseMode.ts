import { BlogViewModel } from "./BlogViewModel";
import { PostViewModel } from "./PostViewModel";
import { VideoViewModel } from "./VideoViewModel";

export type DataBaseModel = VideoViewModel[] 
                            | BlogViewModel[] 
                            | PostViewModel[]