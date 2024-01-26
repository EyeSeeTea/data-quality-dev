import { D2Api } from "../../types/d2-api";
import { FutureData } from "../api-futures";
import { Id } from "../../domain/entities/Ref";
import _ from "../../domain/entities/generic/Collection";
import { CategoryOption } from "../../domain/entities/CategoryOption";
import { CategoryOptionRepository } from "../../domain/repositories/CategoryOptionRepository";
import { D2CategoryOption } from "../common/D2CategoryOption";

export class CategoryOptionD2Repository implements CategoryOptionRepository {
    private d2CategoryOption: D2CategoryOption;

    constructor(private api: D2Api) {
        this.d2CategoryOption = new D2CategoryOption(this.api);
    }

    getByIds(ids: Id[]): FutureData<CategoryOption[]> {
        return this.d2CategoryOption.getByIds(ids);
    }
}
