import { APIErrorResult } from "../types/APIErrorModels";
import { jestCookiesType } from "../types/JestCookiesType";
import { MyResult, ResultCode } from "../types/types";

export function randomString(n: number) {
    let rnd = '';
    while (rnd.length < n)
        rnd += Math.random().toString(36).substring(2);
    return rnd.substring(0, n);
}

export function publicationDate(createdAt: Date): string {
    const newDate = createdAt
    newDate.setHours(newDate.getHours() + 24)
    return newDate.toISOString()
}

export function newStringId() {
    return (new Date()).getTime().toString()
}

export function newNumberId() {
    return +(new Date())
}

export function GetDescriptionOfError(message: string, field: string): APIErrorResult {
    return {
        errorsMessages: [
            {
                message: message,
                field: field
            }
        ]
    }
}

export function parseCookie(jestCookies: String[]) {
    const cookies = jestCookies.reduce((acc: jestCookiesType, curr) => {
        const res = curr.split(';', 1)[0].split('=', 2)
        acc[res[0].trim()] = res[1].trim()
        return acc
    }, {})
    return cookies
}

export function userAgentFromRequest(reqUserAgent: string | undefined): string {
    return reqUserAgent ? reqUserAgent : 'Chrome'
}

export function getMyResult<T>(code: ResultCode, data: T | null = null, errorMessage: string | null = null ): MyResult<T> {
    return {
        data: data,
        code: code,
        errorMessage: errorMessage
    }
}