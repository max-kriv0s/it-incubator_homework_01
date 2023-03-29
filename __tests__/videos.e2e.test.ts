import request from "supertest";
import { Resolutions, VideoType } from "../src/db/db";
import { CreateVideoModel } from "../src/models/CreateVideoModel";
import { UpdateVideoModel } from "../src/models/UpdateVideoModel";
import { app } from "../src/setting"

function randomString(n: number) {
    let rnd = '';
    while (rnd.length < n) 
        rnd += Math.random().toString(36).substring(2);
    return rnd.substring(0, n);
}

describe('/videos', () => {
   
    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })
   
    it('- GET videos = []', async () => {
        await request(app).get('/videos').expect(200, [])
    })
    it('- GET video by ID with incorrect id', async () => {
        await request(app).get('/videos/1').expect(404)
    })

    let newVideo: VideoType = {
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

        const res = await request(app).post('/videos').send(data).expect(400)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'title'
                }
            ]
        })

        await request(app).get('/videos').expect(200, [])

    })    
    it('- POST create the video with incorrect author', async () => {
        const data: CreateVideoModel = {
            title: "it-incubator",
            author: randomString(50),
            availableResolutions: []
        }

        const res = await request(app).post('/videos').send(data).expect(400)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'author'
                }
            ]
        })

        await request(app).get('/videos').expect(200, [])

    })  
    it('- POST create the video with correct data', async () => {
        const data: CreateVideoModel = {
            title: "new course it-incubator",
            author: "it-incubator",
            availableResolutions: [Resolutions["P144"]]
        }     
        
        const res = await request(app).post('/videos').send(data).expect(201)
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

        await request(app).get('/videos').expect(200, [newVideo])

    })

    it('- GET video by ID with correct id', async () => {
        await request(app).get('/videos/' + newVideo.id).expect(200)
    })

    it('- PUT video by ID with incorrect id', async () => {
        await request(app).put('/videos/123').expect(404)
    })

    it('- PUT update the video with incorrect title', async () => {
        const data: UpdateVideoModel = {
            title: randomString(50),
            author: "it-incubator"
        }

        const res = await request(app).put('/videos/' + newVideo.id).send(data).expect(400)

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

        const res = await request(app).put('/videos/' + newVideo.id).send(data).expect(400)

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

        await request(app).put('/videos/' + newVideo.id).send(data).expect(204)

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
        await request(app).delete('/videos/123').expect(404)
    })
    it('- DELETE video by ID with correct id', async () => {
        await request(app).delete('/videos/' + newVideo.id).expect(204)

        await request(app).get('/videos').expect(200, [])
    })
})


