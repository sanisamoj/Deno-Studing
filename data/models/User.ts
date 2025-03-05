import { ObjectId } from "npm:mongodb@6.1.0"

export interface User {
    _id?: ObjectId
    id: string
    name: string
    email: string
    password: string
    createdAt: string
}