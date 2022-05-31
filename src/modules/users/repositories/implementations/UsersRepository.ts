import { getRepository, Repository } from 'typeorm';
import { IFindUserByFullNameDTO, IFindUserWithGamesDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';


export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository
      .createQueryBuilder("user")
      .leftJoinAndSelect('user.games', 'games')
      .where('user.id = :id', { id: user_id })
      .getOne();

    if (!user) {
      throw new Error("User not found");
    }

    return user;

  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(`select * from users order by first_name asc`);
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`select * from users where lower(first_name||last_name) = $1`, [(first_name+last_name).toLowerCase()]);

  }
}
