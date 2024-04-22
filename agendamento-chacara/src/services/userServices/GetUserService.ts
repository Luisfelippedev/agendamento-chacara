import { FindUserRepository } from "../../repositories/UserRepository/FindUserRepository";
import { NotFoundError } from "../../helpers/api-errors";

export class GetUserService {
  private respository : FindUserRepository
  constructor(){
    this.respository = new FindUserRepository() 
  }

  public async findUserByCpf(cpf: string) {
    const user = await this.respository.findUserByCpf(cpf)
    if (!user) {
      throw new NotFoundError("User Not Found");
    }
    return user;
  }
}
