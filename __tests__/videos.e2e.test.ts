import request from "supertest";
import { StatusCodes } from "http-status-codes";

import { CreateVideoModel } from "../src/models/CreateVideoModel";
import { UpdateVideoModel } from "../src/models/UpdateVideoModel";
import { app } from "../src/setting"
import { VideoViewModel } from "../src/models/VideoViewModel";
import {randomString} from "../src/utils/utils"

describe('/videos', () => {
   
    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(StatusCodes.NO_CONTENT)
    })
   
    it('- GET videos = []', async () => {
        await request(app).get('/videos').expect(StatusCodes.OK, [])
    })
    it('- GET video by ID with incorrect id', async () => {
        await request(app).get('/videos/1').expect(StatusCodes.NOT_FOUND)
    })

    let newVideo: VideoViewModel = {
        id: 0,
        title: "",
        author: "",
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: "",
        publicationDate: "",
        availableResolutions: []
    }
    it('- POST create the video with incorrect title', async () => {
        const data: CreateVideoModel = {
            title: randomString(50),
            author: "it-incubator",
            availableResolutions: []
        }

        const res = await request(app).post('/videos').send(data).expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'title'
                }
            ]
        })

        await request(app).get('/videos').expect(StatusCodes.OK, [])

    })    
    it('- POST create the video with incorrect author', async () => {
        const data: CreateVideoModel = {
            title: "it-incubator",
            author: randomString(50),
            availableResolutions: []
        }

        const res = await request(app).post('/videos').send(data).expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'author'
                }
            ]
        })

        await request(app).get('/videos').expect(StatusCodes.OK, [])

    })  
    it('- POST create the video with correct data', async () => {
        const data: CreateVideoModel = {
            title: "new course it-incubator",
            author: "it-incubator",
            availableResolutions: ["P144"]
        }     
        
        const res = await request(app).post('/videos').send(data).expect(StatusCodes.CREATED)
        newVideo = res.body;

        expect(newVideo).toEqual(
            {
                id: expect.any(Number),
                title: data.title,
                author: data.author,
                canBeDownloaded: false,
                minAgeRestriction: null,
                createdAt: expect.any(String),
                publicationDate: expect.any(String),
                availableResolutions: data.availableResolutions
            }    
        )

        await request(app).get('/videos').expect(StatusCodes.OK, [newVideo])

    })

    it('- GET video by ID with correct id', async () => {
        await request(app).get('/videos/' + newVideo.id).expect(StatusCodes.OK)
    })

    it('- PUT video by ID with incorrect id', async () => {
        await request(app).put('/videos/123').expect(StatusCodes.NOT_FOUND)
    })

    it('- PUT update the video with incorrect title', async () => {
        const data: UpdateVideoModel = {
            title: randomString(50),
            author: "it-incubator"
        }

        const res = await request(app).put('/videos/' + newVideo.id).send(data).expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'title'
                }
            ]
        })
    })
    it('- PUT update the video with incorrect author', async () => {
        const data: UpdateVideoModel = {
            title: "it-incubator",
            author: randomString(50)
        }

        const res = await request(app).put('/videos/' + newVideo.id).send(data).expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'author'
                }
            ]
        })
    })
    it('- PUT update the video with correct data', async () => {
        const data: UpdateVideoModel = {
            title: "new-new course",
            author: "it-incubator 2"
        }

        await request(app).put('/videos/' + newVideo.id).send(data).expect(StatusCodes.NO_CONTENT)

        const res = await request(app).get('/videos/' + newVideo.id)
        const updateVideo = {
            ...newVideo,
            title: data.title,
            author: data.author
        }
        expect(res.body).toEqual(updateVideo)

        newVideo = updateVideo
    })

    it('- DELETE video by ID with incorrect id', async () => {
        await request(app).delete('/videos/123').expect(StatusCodes.NOT_FOUND)
    })
    it('- DELETE video by ID with correct id', async () => {
        await request(app).delete('/videos/' + newVideo.id).expect(StatusCodes.CREATED)

        await request(app).get('/videos').expect(StatusCodes.OK, [])
    })
})


