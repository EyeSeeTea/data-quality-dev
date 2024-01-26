import { FutureData } from "../../data/api-futures";
import { CategoryOption } from "../entities/CategoryOption";
import { Id } from "../entities/Ref";

export interface CategoryOptionRepository {
    getByIds(ids: Id[]): FutureData<CategoryOption[]>;
}
