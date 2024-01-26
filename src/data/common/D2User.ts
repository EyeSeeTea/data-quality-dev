import { User } from "../../domain/entities/User";
import { D2Api, MetadataPick } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";

export class D2User {
    constructor(private api: D2Api) {}

    getCurrent(): FutureData<User> {
        return apiToFuture(this.api.currentUser.get({ fields: userFields })).map(d2User => {
            return this.buildUser(d2User);
        });
    }

    getByUsernames(userIds: string[]): FutureData<User[]> {
        return apiToFuture(
            this.api.models.users
                .get({ fields: userFields, filter: { username: { in: userIds } } })
                .map(d2Response => {
                    return d2Response.data.objects.map(d2User => {
                        return this.buildUser(d2User);
                    });
                })
        );
    }

    private buildUser(d2User: D2UserEntity) {
        return new User({
            id: d2User.id,
            name: d2User.displayName,
            userGroups: d2User.userGroups,
            ...d2User.userCredentials,
        });
    }
}

const userFields = {
    id: true,
    displayName: true,
    userGroups: { id: true, name: true },
    userCredentials: { username: true, userRoles: { id: true, name: true, authorities: true } },
} as const;

type D2UserEntity = MetadataPick<{ users: { fields: typeof userFields } }>["users"][number];
