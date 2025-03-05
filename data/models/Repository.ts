import { User } from "../User.ts"

abstract class Repository {
    public abstract saveUser(user: User): Promise<void>
    public abstract updateUser(user: User): Promise<User>
    public abstract deleteUser(userId: string): Promise<void>
    public abstract findUserById(userId: string): Promise<void>
    public abstract findUserByEmail(email: string): Promise<User | null>
}