import { FutureData } from "../../data/api-futures";
import { User } from "../entities/User";

export interface UserRepository {
    getCurrent(): FutureData<User>;
    getByIds(ids: string[]): FutureData<User[]>;
    getByUsernames(usernames: string[]): FutureData<User[]>;
}
