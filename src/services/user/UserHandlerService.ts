import { Repository } from "../../data/models/abstract/Repository.ts";
import { DefaultRepository } from "../../data/repository/DefaultRepository.ts";

export class UserHandlerService {
    private repository: Repository

    constructor(repository: Repository = new DefaultRepository()) {
        this.repository = repository
    }

}