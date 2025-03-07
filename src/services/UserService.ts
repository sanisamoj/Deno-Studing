
import { Document } from "npm:mongodb@6.1.0";
import { Config } from "../Config.ts";
import { Repository } from "../data/models/abstract/Repository.ts"
import { LoginRequest } from "../data/models/interfaces/LoginRequest.ts";
import { loginResponse } from "../data/models/interfaces/LoginResponse.ts";
import { MessageToSend } from "../data/models/interfaces/MessageToSend.ts";
import { User } from "../data/models/interfaces/User.ts"
import { UserCreateRequest } from "../data/models/interfaces/UserCreateRequest.ts"
import { UserResponse } from "../data/models/interfaces/UserResponse.ts"
import { Errors } from "../data/models/types/Errors.ts"
import { DefaultRepository } from "../data/repository/DefaultRepository.ts"
import { generateVerificationCode } from "../utils/generateVerificationCode.ts";
import { TokenGenerator } from "../utils/TokenGenerator.ts";
import { UserFactory } from "./UserFactory.ts"

export class UserService {
    private repository: Repository

    constructor(repository: Repository = new DefaultRepository()) {
        this.repository = repository
    }

    public async saveUser(request: UserCreateRequest): Promise<UserResponse> {
        const userAlreadyExists: User | null = await this.repository.findUserByEmail(request.email)
        if (userAlreadyExists) throw new Error(Errors.ItemAlreadyExists)

        const user: User = {
            name: request.name,
            email: request.email,
            phone: request.phone,
            code: null,
            createdAt: new Date().toISOString()
        }

        const savedUser: User = await this.repository.saveUser(user)
        return UserFactory.userResponse(savedUser)
    }

    public async login(request: LoginRequest): Promise<loginResponse | undefined> {
        const user: User & Document | null = await this.repository.findUserByEmail(request.email)
        if (!user) throw new Error(Errors.InvalidCredentials)

        if (!request.code) {
            const code: string = generateVerificationCode()
            user.code = code
            await this.repository.updateUser(user)
            const message = `O seu código é ${code}, não compartilhe este código com ninguém. Este código estará válido apenas por 5 minutos.`
            const messageToSend: MessageToSend = { phone: user.phone, message: message }
            const secondMessageToSend: MessageToSend = { phone: user.phone, message: code }
            this.repository.sendMessage(Config.SYSTEM_BOT_ID, messageToSend)
            this.repository.sendMessage(Config.SYSTEM_BOT_ID, secondMessageToSend)

            setTimeout(async () => {
                const updatedUser: User | null = await this.repository.findUserByEmail(user.email);
                if (updatedUser && updatedUser.code === code) {
                    updatedUser.code = null
                    await this.repository.updateUser(updatedUser)
                }
            }, 5 * 60 * 1000)
            
        } else {
            if (user.code !== request.code) throw new Error(Errors.InvalidCredentials)

            const userResponse: UserResponse = UserFactory.userResponse(user)
            const token: string = await TokenGenerator.customGenerateToken(userResponse.id)
            const loginResponse: loginResponse = { content: userResponse, token: token }
            return loginResponse
        }

    }
}