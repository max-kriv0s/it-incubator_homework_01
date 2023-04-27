import { DataBaseModel } from "../types/DataBaseMode";

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

// export function deleteValueById(db: DataBaseModel , id: string| number): boolean {
//     for (let i = 0; i < db.length; i++) {
//         if (db[i].id === id) {
//             db.splice(i, 1)
//             return true
//         }
//     }
//     return false
// }