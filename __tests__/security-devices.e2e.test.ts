import request from 'supertest'
import { client } from '../src/repositories/db'
import { app } from '../src/app'
import { StatusCodes } from 'http-status-codes'
import { UserViewModel } from '../src/models/users/UserViewModel'
import { UserCreateModel } from '../src/models/users/UserCreateModel'
import { settings } from '../src/settings'
import { parseCookie } from '../src/utils/utils'


const ADMIN_LOGIN = settings.ADMIN_LOGIN
const MAX_COUNT_FREQUENT_REQUESTS_FOR_API = settings.MAX_COUNT_FREQUENT_REQUESTS_FOR_API

type authorizedUser = {
    user: string
    userAgent: string
    accessToken: string
    refreshToken: string
}

describe('/auth', () => {

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(StatusCodes.NO_CONTENT)
    })

    afterAll(async () => {
        client.close()
    })
    
    const dataUser: UserCreateModel = {
        login: "user_reg_1",
        password: "pas_user",
        email: "edu.kriv0s@yandex.ru"
    }

    let newUser: UserViewModel

    it ('- POST -> "/users": create the user with correct data', 
        async () => {
            
            const res = await request(app)
                .post('/users')
                .set('Authorization', ADMIN_LOGIN)
                .send(dataUser)
                .expect(StatusCodes.CREATED)

            newUser = res.body
            
            expect(newUser).toEqual({
                id: expect.any(String),
                login: dataUser.login,
                email: dataUser.email,
                createdAt: expect.any(String)
        })
    })

    const authorizedUsers:authorizedUser[] = []

    it('- POST -> "/auth/login": Authorization of the user with different user-agen',
        async () => {
            let userAgent = ''
            for (let i = 0; i < 4; i++) {
                
                userAgent = 'Chrome_' + i
                const res = await request(app)
                    .post('/auth/login')
                    .set('User-Agent', userAgent)
                    .send(
                        {
                            loginOrEmail: dataUser.login,
                            password: dataUser.password
                        }
                    )
                    .expect(StatusCodes.OK)

                    const cookies = parseCookie(res.get('Set-Cookie'))

                    authorizedUsers.push({
                        user: dataUser.login,
                        userAgent: userAgent,
                        accessToken: res.body.accessToken,
                        refreshToken: cookies.refreshToken
                    })
            }

            expect(authorizedUsers.length).toBe(4)
        }
    )

    let lastActiveDate = ''

    it('- GET -> "/security/devices/": Returns all devices with active sessions for current user',
        async () => {
            const res = await request(app)
                .get('/security/devices')
                .set('Cookie', [`refreshToken=${authorizedUsers[0].refreshToken}`])
                .send()
                .expect(StatusCodes.OK)

            expect(res.body.length).toBe(4)

            lastActiveDate = res.body[0].lastActiveDate
        }
    )

    it('- POST -> "/auth/login" More than 5 attempts from one IP-address during 10 seconds',
        async () => {
            for (let i = 0; i <= MAX_COUNT_FREQUENT_REQUESTS_FOR_API - 4; i++) {
                await request(app).post('/auth/login').send({
                    loginOrEmail: test,
                    password: test
                })
            }

            await request(app)
                .post('/auth/login')
                .send(
                    {
                        loginOrEmail: test,
                        password: test
                    })
                .expect(StatusCodes.TOO_MANY_REQUESTS)
        }
    )

    it('- POST -> "/auth/refresh-token" update refresh token device 1',
        async () => {

            let res = await request(app)
                .post('/auth/refresh-token')
                .set('Cookie', [`refreshToken=${authorizedUsers[0].refreshToken}`])
                .send()
                .expect(StatusCodes.OK)

            const cookies = parseCookie(res.get('Set-Cookie'))

            authorizedUsers[0].accessToken = res.body.accessToken
            authorizedUsers[0].refreshToken = cookies.refreshToken

            res = await request(app)
                .get('/security/devices')
                .set('Cookie', [`refreshToken=${authorizedUsers[0].refreshToken}`])
                .send()
                .expect(StatusCodes.OK)

            expect(res.body.length).toBe(4)

            expect(res.body[0].lastActiveDate).not.toBe(lastActiveDate)
        }
    )
})