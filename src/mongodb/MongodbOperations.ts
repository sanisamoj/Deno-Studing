import {  MongoClient, Db, Collection, WithId, ObjectId, Document, OptionalUnlessRequiredId, Filter } from "npm:mongodb@6.1.0"
import "jsr:@std/dotenv/load"
import { DateFilterType } from "./DateFilterType.ts"
import { Collections } from "./Collections.ts"
import { Errors } from "../data/models/types/Errors.ts"

export class MongodbOperations {
    private static instance: MongodbOperations | null = null
    private client: MongoClient
    private db: Db

    private constructor() {
        this.client = new MongoClient(Deno.env.get("MONGO_HOST") as string)
        this.db = this.client.db(Deno.env.get("MONGODB_NAME") as string)
    }

    public static async getInstance(): Promise<MongodbOperations> {
        if (!MongodbOperations.instance) {
            MongodbOperations.instance = new MongodbOperations()
            await MongodbOperations.instance.connect()
        }
        return MongodbOperations.instance
    }

    private async connect(): Promise<void> {
        await this.client.connect()
        console.log('MongoDB connection established')
    }

    public async close(): Promise<void> {
        await this.client.close()
        MongodbOperations.instance = null
    }

    async save<T extends Document>(collectionName: Collections, item: OptionalUnlessRequiredId<T>): Promise<ObjectId> {
        const collection: Collection<T> = this.db.collection(collectionName)
        const result = await collection.insertOne(item)
        return result.insertedId
    }

    async findOne<T extends Document>(collectionName: Collections, filter: Filter<T>): Promise<WithId<T> | null> {
        const collection: Collection<T> = this.db.collection(collectionName)
        return await collection.findOne(filter)
    }

    async findAll<T extends Document>(
        collectionName: Collections,
        filter: any | null = null,
        pageSize: number | null = null,
        pageNumber: number | null = null
    ): Promise<WithId<T>[]> {
        const collection: Collection<T> = this.db.collection(collectionName)
        let query = collection.find(filter || {})

        if (pageSize !== null && pageNumber !== null) {
            const skip = (pageNumber - 1) * pageSize
            query = query.skip(skip).limit(pageSize)
        }

        return await query.toArray()
    }

    async updateItem<T extends Document>(
        collectionName: Collections,
        filter: any,
        update: any
    ): Promise<WithId<T>> {
        const collection: Collection<T> = this.db.collection(collectionName)
        
        const result = await collection.updateOne(filter, { $set: update })
        
        if (result.modifiedCount === 0) {
            throw new Error(Errors.NoItemsWereDeleted)
        }
    
        const updatedItem = await collection.findOne(filter)
        if (!updatedItem) {
            throw new Error(Errors.ItemNotFound)
        }
    
        return updatedItem
    }
    

    async countDocuments<T extends Document>(collectionName: Collections, filter: any | null = null): Promise<number> {
        const collection: Collection<T> = this.db.collection(collectionName)
        return await collection.countDocuments(filter || {})
    }

    async deleteItem<T extends Document>(collectionName: Collections, filter: any): Promise<void> {
        const collection: Collection<T> = this.db.collection(collectionName)
        const result = await collection.deleteOne(filter)
        if (result.deletedCount === 0) throw new Error(Errors.NoItemsWereDeleted)
    }

    async deleteAllItems<T extends Document>(collectionName: Collections, filter: any): Promise<void> {
        const collection: Collection<T> = this.db.collection(collectionName)
        await collection.deleteMany(filter)
    }

    async dropCollection<T extends Document>(collectionName: Collections): Promise<void> {
        const collection: Collection<T> = this.db.collection(collectionName)
        await collection.drop()
    }

    async findItemsByDate<T extends Document>(
        collectionName: Collections,
        dateFieldName: string,
        filterType: DateFilterType,
        dateTime: Date,
        endDateTime: Date | null = null,
        filter: Document | null = null
    ): Promise<WithId<T>[]> {
        const collection: Collection<T> = this.db.collection(collectionName)
        let dateFilter: Document

        switch (filterType) {
            case DateFilterType.BEFORE:
                dateFilter = { [dateFieldName]: { $lte: dateTime } }
                break
            case DateFilterType.AFTER:
                dateFilter = { [dateFieldName]: { $gte: dateTime } }
                break
            case DateFilterType.IN_PERIOD:
                if (!endDateTime) throw new Error("endDateTime is required for IN_PERIOD filter type")
                dateFilter = { [dateFieldName]: { $gte: dateTime, $lte: endDateTime } }
                break
            default:
                throw new Error("Invalid filter type")
        }

        const combinedFilter: any = filter ? { $and: [dateFilter, filter] } : dateFilter
        return await collection.find(combinedFilter).toArray()
    }
}