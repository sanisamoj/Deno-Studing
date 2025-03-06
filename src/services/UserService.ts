
import { Repository } from "../data/models/abstract/Repository.ts"
import { LoginRequest } from "../data/models/interfaces/LoginRequest.ts";
import { loginResponse } from "../data/models/interfaces/LoginResponse.ts";
import { User } from "../data/models/interfaces/User.ts"
import { UserCreateRequest } from "../data/models/interfaces/UserCreateRequest.ts"
import { UserResponse } from "../data/models/interfaces/UserResponse.ts"
import { Errors } from "../data/models/types/Errors.ts"
import { DefaultRepository } from "../data/repository/DefaultRepository.ts"
import { TokenGenerator } from "../utils/TokenGenerator.ts";
import { UserFactory } from "./UserFactory.ts"
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"

export class UserService {
    private repository: Repository

    constructor(repository: Repository = new DefaultRepository()) {
        this.repository = repository
    }

    public async saveUser(request: UserCreateRequest): Promise<UserResponse> {
        const userAlreadyExists: User | null = await this.repository.findUserByEmail(request.email)
        if (userAlreadyExists) throw new Error(Errors.ItemAlreadyExists)

        const hashedPassword: string = await bcrypt.hash(request.password)
        const user: User = {
            name: request.name,
            email: request.email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        }

        const savedUser: User = await this.repository.saveUser(user)
        return UserFactory.userResponse(savedUser)
    }

    public async login(request: LoginRequest): Promise<loginResponse> {
        const user: User | null = await this.repository.findUserByEmail(request.email)
        if (!user) throw new Error(Errors.InvalidCredentials)

        const isValidPassword: boolean = await bcrypt.compare(request.password, user.password)
        if (!isValidPassword) throw new Error(Errors.InvalidCredentials)

        const userResponse: UserResponse = UserFactory.userResponse(user)
        const token: string = await TokenGenerator.customGenerateToken(userResponse.id)
        const loginResponse: loginResponse = { content: userResponse, token: token }
        return loginResponse
    }
}