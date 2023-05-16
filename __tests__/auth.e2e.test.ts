import request from 'supertest'
import { app } from '../src/app'
import { StatusCodes } from 'http-status-codes'
import { client } from '../src/repositories/db'
import { parseCookie, randomString } from '../src/utils/utils'
import { emailAdapter } from '../src/adapter/email-adapter'

import cookie from 'cookie'

// import { emailAdapter } from "../src/adapter/email-adapter"
// import SMTPTransport from 'nodemailer/lib/smtp-transport'

// emailAdapter.sendEmail = async (email: string, subject: string, textMessage: string): Promise<string> => {
//     return new Promise(textMessage)
// }

const ADMIN_LOGIN = process.env.ADMIN_LOGIN ? process.env.ADMIN_LOGIN : ''

describe('/auth', () => {

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(StatusCodes.NO_CONTENT)

        jest.clearAllMocks()
    })

    afterAll(async () => {
        client.close()
    })

    it(' -POST -> "auth/registration": with incorrect login',
        async () => {

            let res = await request(app)
                .post('/auth/registration')
                .send({
                    login: randomString(2),
                    password: randomString(10),
                    email: 'test@test.test'
                }).expect(StatusCodes.BAD_REQUEST)
                
            expect(res.body).toEqual({
                "errorsMessages": [
                    {
                        message: expect.any(String),
                        field: 'login'
                    }
                ]
            })

            res = await request(app)
                .post('/auth/registration')
                .send({
                    login: randomString(11),
                    password: randomString(10),
                    email: 'test@test.test'
                }).expect(StatusCodes.BAD_REQUEST)

            expect(res.body).toEqual({
                "errorsMessages": [
                    {
                        message: expect.any(String),
                        field: 'login'
                    }
                ]
            })

        }
    )

    it(' -POST -> "auth/registration": with incorrect password',
        async () => {

            let res = await request(app)
                .post('/auth/registration')
                .send({
                    login: randomString(8),
                    password: randomString(5),
                    email: 'test@test.test'
                }).expect(StatusCodes.BAD_REQUEST)

            expect(res.body).toEqual({
                "errorsMessages": [
                    {
                        message: expect.any(String),
                        field: 'password'
                    }
                ]
            })

            res = await request(app)
                .post('/auth/registration')
                .send({
                    login: randomString(8),
                    password: randomString(21),
                    email: 'test@test.test'
                }).expect(StatusCodes.BAD_REQUEST)

            expect(res.body).toEqual({
                "errorsMessages": [
                    {
                        message: expect.any(String),
                        field: 'password'
                    }
                ]
            })


        }
    )

    it(' -POST -> "auth/registration": with incorrect email',
        async () => {

            const res = await request(app)
                .post('/auth/registration')
                .send({
                    login: randomString(8),
                    password: randomString(10),
                    email: 'test'
                }).expect(StatusCodes.BAD_REQUEST)

            expect(res.body).toEqual({
                "errorsMessages": [
                    {
                        message: expect.any(String),
                        field: 'email'
                    }
                ]
            })
        }
    )

    const userRegistration = {
        login: 'user_1',
        password: 'user_pass',
        email: 'edu.kriv0s@yandex.ru'
    }

    let codeConfirmation = ''

    it(' -POST -> "auth/registration": with correct data',
        async () => {

            emailAdapter.sendEmail = jest.fn()
            const sendEmail = jest.spyOn(emailAdapter, 'sendEmail',);

            const res = await request(app)
                .post('/auth/registration')
                .send(userRegistration)
                .expect(StatusCodes.NO_CONTENT)

            expect(sendEmail).toHaveBeenCalled()
            expect(sendEmail.mock.calls[0][0]).toBe(userRegistration.email)

            const message = sendEmail.mock.calls[0][2]
            const startIndex = message.indexOf("code")
            expect(startIndex).not.toBe(-1)

            codeConfirmation = message.slice(
                startIndex + 5,
                message.indexOf("'", startIndex) !== -1 ? message.indexOf("'", startIndex) : message.length
            )

        }
    )

    it(' -POST -> "auth/registration": with login exists',
        async () => {

            const res = await request(app)
                .post('/auth/registration')
                .send({
                    login: userRegistration.login,
                    password: randomString(10),
                    email: 'test@test.test'
                }).expect(StatusCodes.BAD_REQUEST)

            expect(res.body).toEqual({
                "errorsMessages": [
                    {
                        message: expect.any(String),
                        field: 'login'
                    }
                ]
            })

        }
    )

    it(' -POST -> "auth/registration": with email exists',
        async () => {

            const res = await request(app)
                .post('/auth/registration')
                .send({
                    login: randomString(8),
                    password: randomString(10),
                    email: userRegistration.email
                }).expect(StatusCodes.BAD_REQUEST)

            expect(res.body).toEqual({
                "errorsMessages": [
                    {
                        message: expect.any(String),
                        field: 'email'
                    }
                ]
            })

        }
    )

    it('- POST -> "auth/registration-confirmation" with incorrect code',
        async () => {

            const res = await request(app)
                .post('/auth/registration-confirmation')
                .send({
                    code: "123"
                }).expect(StatusCodes.BAD_REQUEST)

            expect(res.body).toEqual({
                "errorsMessages": [
                    {
                        message: expect.any(String),
                        field: 'code'
                    }
                ]
            })

        }
    )

    it('- POST -> "auth/registration-confirmation" with correct code',
        async () => {

            const res = await request(app)
                .post('/auth/registration-confirmation')
                .send({
                    code: codeConfirmation
                }).expect(StatusCodes.NO_CONTENT)



        }
    )

    it('- POST -> "auth/login": with incorrect loginOrEmail',
        async () => {

            const res = await request(app)
                .post('/auth/login')
                .send({
                    password: '123456'
                })
                .expect(StatusCodes.BAD_REQUEST)

            expect(res.body).toEqual({
                "errorsMessages": [
                    {
                        message: expect.any(String),
                        field: 'loginOrEmail'
                    }
                ]
            })
        }
    )

    it('- POST -> "auth/login": with incorrect password',
        async () => {

            const res = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: '123456'
                })
                .expect(StatusCodes.BAD_REQUEST)

            expect(res.body).toEqual({
                "errorsMessages": [
                    {
                        message: expect.any(String),
                        field: 'password'
                    }
                ]
            })
        }
    )

    it('- POST -> "auth/login": If the password or login is wrong',
        async () => {

            const data = {
                loginOrEmail: "user",
                password: "123456"
            }

            await request(app)
                .post('/auth/login')
                .send(data)
                .expect(StatusCodes.UNAUTHORIZED)
        }
    )

    let accessToken = ''
    let refreshToken = ''

    it('- POST -> "auth/login": with correct data',
        async () => {

            const res = await request(app)
                .post('/auth/login')
                .send(
                    {
                        loginOrEmail: userRegistration.login,
                        password: userRegistration.password
                    }
                )
                .expect(StatusCodes.OK)

            expect(res.body).toEqual({
                accessToken: expect.any(String)
            })

            accessToken = res.body.accessToken

            const cookies = parseCookie(res.get('Set-Cookie'))
   
            if (cookies.refreshToken) {
                refreshToken = cookies.refreshToken
            }

            expect(refreshToken).not.toBe('')
        }
    )

    it('- GET -> "auth/me": with incorrect data',
        async () => {

            await request(app)
                .get('/auth/me')
                .set('Authorization', "Bearer 123")
                .send()
                .expect(StatusCodes.UNAUTHORIZED)

        }
    )

    let userID = ''

    it('- GET -> "auth/me": with correct data',
        async () => {

            const res = await request(app)
                .get('/auth/me')
                .set('Authorization', "Bearer " + accessToken)
                .send()
                .expect(StatusCodes.OK)

            expect(res.body).toEqual(
                {
                    email: userRegistration.email,
                    login: userRegistration.login,
                    userId: expect.any(String)
                }
            )

            userID = res.body.userId
        }
    )

    it(`- POST -> "auth/registration-email-resending" 
        delete user - status 204;
        registration user - status 204
        registration-email-resending - status 204`,
        async () => {

            await request(app)
                .delete('/users/' + userID)
                .set('Authorization', ADMIN_LOGIN)
                .expect(StatusCodes.NO_CONTENT)

            emailAdapter.sendEmail = jest.fn()
            const sendEmail = jest.spyOn(emailAdapter, 'sendEmail',);

            let res = await request(app)
                .post('/auth/registration')
                .send(userRegistration)
                .expect(StatusCodes.NO_CONTENT)

            expect(sendEmail).toHaveBeenCalled()
            expect(sendEmail.mock.calls[0][0]).toBe(userRegistration.email)

            res = await request(app)
                .post('/auth/registration-email-resending')
                .send({ email: userRegistration.email })
                .expect(StatusCodes.NO_CONTENT)
            
            expect(sendEmail).toHaveBeenCalled()
            expect(sendEmail.mock.calls[1][0]).toBe(userRegistration.email)

            const message = sendEmail.mock.calls[1][2]
            const startIndex = message.indexOf("code")
            expect(startIndex).not.toBe(-1)

            codeConfirmation = message.slice(
                startIndex + 5,
                message.indexOf("'", startIndex) !== -1 ? message.indexOf("'", startIndex) : message.length
            )

        }
    )
    
    it('- POST -> "auth/registration-confirmation" with correct resending code',
        async () => {

            const res = await request(app)
                .post('/auth/registration-confirmation')
                .send({
                    code: codeConfirmation
                }).expect(StatusCodes.NO_CONTENT)
        }
    )

    it('- POST -> "auth/registration-email-resending" with incorrect email',
        async () => {
            const res = await request(app)
                .post('/auth/registration-email-resending')
                .send({ email: "123" })
                .expect(StatusCodes.BAD_REQUEST)

            expect(res.body).toEqual(
                {
                    errorsMessages: [
                        {
                            "message": expect.any(String),
                            "field": 'email'
                        }
                    ]
                }
            )
        }
    )

})