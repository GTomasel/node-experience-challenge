import { Mixin } from 'ts-mixer';
import ProductUpdatePayload from '../../Domain/Payloads/ProductUpdatePayload';
import IdRequest from '../../../Shared/Presentation/Requests/IdRequest';
import ProductRepRequest from './ProductRepRequest';

class ProductUpdateRequest extends Mixin(ProductRepRequest, IdRequest) implements ProductUpdatePayload
{
    constructor(data: Record<string, any>)
    {
        super(data);
        this._id = data.id;
    }
}

export default ProductUpdateRequest;
