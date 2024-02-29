import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { D2Api } from "../../types/d2-api";
import { FutureData } from "../api-futures";
import { D2User } from "../common/D2User";

export class UserD2Repository implements UserRepository {
    private d2User: D2User;
    constructor(private api: D2Api) {
        this.d2User = new D2User(this.api);
    }

    public getCurrent(): FutureData<User> {
        return this.d2User.getCurrent();
    }

    public getByUsernames(userIds: string[]): FutureData<User[]> {
        return this.d2User.getByUsernames(userIds);
    }
}
