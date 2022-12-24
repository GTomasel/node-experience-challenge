import { Mixin } from 'ts-mixer';
import CategoryUpdatePayload from '../../Domain/Payloads/CategoryUpdatePayload';
import IdRequest from '../../../Shared/Presentation/Requests/IdRequest';
import CategoryRepRequest from './CategoryRepRequest';

class CategoryUpdateRequest extends Mixin(CategoryRepRequest, IdRequest) implements CategoryUpdatePayload
{
    constructor(data: Record<string, any>)
    {
        super(data);
        this._id = data.id;
    }
}

export default CategoryUpdateRequest;
