import request from 'supertest'
import { client } from '../src/repositories/db'
import { app } from '../src/app'
import { StatusCodes } from 'http-status-codes'
import { UserViewModel } from '../src/models/users/UserViewModel'
import { UserCreateModel } from '../src/models/users/UserCreateModel'
import { settings } from '../src/settings'
import { parseCookie } from '../src/utils/utils'
import {SecurityDevicesViewModel} from '../src/models/security-devices/SecurityDevicesViewModel'

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

    const newDataUser: UserCreateModel = {
        login: "user_reg_2",
        password: "pas_user",
        email: "test@test.ru"
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

            await request(app)
                .post('/users')
                .set('Authorization', ADMIN_LOGIN)
                .send(newDataUser)
                .expect(StatusCodes.CREATED)
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
    let devices: SecurityDevicesViewModel[]

    it('- GET -> "/security/devices/": Returns all devices with active sessions for current user',
        async () => {
            const res = await request(app)
                .get('/security/devices')
                .set('Cookie', [`refreshToken=${authorizedUsers[0].refreshToken}`])
                .send()
                .expect(StatusCodes.OK)

            expect(res.body.length).toBe(4)

            lastActiveDate = res.body[0].lastActiveDate
            
            devices = res.body
        }
    )

    let refreshTokenNewUser = ''
    it('- POST -> "/auth/login": login correct data newUser',
        async () => {
            const res = await request(app)
            .post('/auth/login')
            .set('User-Agent', 'Mozilla')
            .send(
                {
                    loginOrEmail: newDataUser.login,
                    password: newDataUser.password
                }
            )
            .expect(StatusCodes.OK)

            const cookies = parseCookie(res.get('Set-Cookie'))
            refreshTokenNewUser = cookies.refreshToken
        }
    )

    it('- POST -> "/auth/login" More than 5 attempts from one IP-address during 10 seconds',
        async () => {
            // for (let i = 0; i <= MAX_COUNT_FREQUENT_REQUESTS_FOR_API - 4; i++) {
            //     await request(app).post('/auth/login').send({
            //         loginOrEmail: test,
            //         password: test
            //     })
            // }

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

            console.log(res.body[0].lastActiveDate);
            console.log(lastActiveDate);

            expect(res.body[0].lastActiveDate).not.toBe(lastActiveDate)

        }
    )

    it('- DELETE -> "/security/devices/{deviceId}": Send a request without cookie',
        async () => {
            await request(app)
                .delete('/security/devices/1')
                .send()
                .expect(StatusCodes.UNAUTHORIZED)
        }
    )

    it('- DELETE -> "/security/devices/{deviceId}": delete the device with incorrect deviceId',
        async () => {
            await request(app)
                .delete('/security/devices/123')
                .set('Cookie',[`refreshToken=${authorizedUsers[0].refreshToken}`])
                .send()
                .expect(StatusCodes.NOT_FOUND)
        }
    )

    it('- DELETE -> "": delete the device another user',
        async () => {

            // delete device anoter user
            const res = await request(app)
                .delete('/security/devices/' + devices[1].deviceId)
                .set('Cookie', [`refreshToken=${refreshTokenNewUser}`])
                .send()
                .expect(StatusCodes.FORBIDDEN)
        }
    )

    it('- DELETE -> "/security/devices/{deviceId}": Delete device 2 submit refresh token device 1',
        async () => {
            let res = await request(app)
                .delete('/security/devices/' + devices[1].deviceId)
                .set('Cookie', [`refreshToken=${authorizedUsers[0].refreshToken}`])
                .send()
                .expect(StatusCodes.NO_CONTENT)

            res = await request(app)
                .get('/security/devices')
                .set('Cookie', [`refreshToken=${authorizedUsers[0].refreshToken}`])
                .send()
                .expect(StatusCodes.OK)

            expect(res.body.length).toBe(3)
        }
    )

    it('- POST -> "/auth/logout": logout device 3',
        async () => {
            await request(app)
                .post('/auth/logout')
                .set('Cookie', [`refreshToken=${authorizedUsers[2].refreshToken}`])
                .send()
                .expect(StatusCodes.NO_CONTENT)

            const res = await request(app)
                .get('/security/devices')
                .set('Cookie', [`refreshToken=${authorizedUsers[0].refreshToken}`])
                .send()
                .expect(StatusCodes.OK)

            expect(res.body.length).toBe(2)
        }
    )

    it('- DELETE -> "/security/devices": delete all devices',
        async () => {

            await request(app)
                .delete('/security/devices')
                .set('Cookie', [`refreshToken=${authorizedUsers[0].refreshToken}`])
                .send()
                .expect(StatusCodes.NO_CONTENT)

            const res = await request(app)
                .get('/security/devices')
                .set('Cookie', [`refreshToken=${authorizedUsers[0].refreshToken}`])
                .send()
                .expect(StatusCodes.OK)

            expect(res.body.length).toBe(1)
        }
    )
})