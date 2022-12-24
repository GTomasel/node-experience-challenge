import Category from '../Entities/Category';
import CategoryRepPayload from '../Payloads/CategoryRepPayload';
import ICategoryDomain from '../Entities/ICategoryDomain';

class CategoryBuilder
{
    private _category: ICategoryDomain;
    private _payload: CategoryRepPayload;

    constructor(payload?: CategoryRepPayload)
    {
        this._payload = payload;
    }

    setCategory(category?: ICategoryDomain)
    {
        this._category = category ?? new Category();

        return this;
    }

    build()
    {
        this._category.name = this._payload.name;
        this._category.type = this._payload.type;

        return this;
    }

    update()
    {
        this._category.lastModifiedBy = this._payload.authUser;

        return this._category;
    }

    create()
    {
        this._category.createdBy = this._payload.authUser;
        this._category.lastModifiedBy = this._payload.authUser;

        return this._category;
    }
}

export default CategoryBuilder;
