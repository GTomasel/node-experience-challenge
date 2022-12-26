import IdPayload from '../../../Shared/Presentation/Requests/IdPayload';
import ProductRepPayload from './ProductRepPayload';
import IUserDomain from '../../../Auth/Domain/Entities/IUserDomain';

interface ProductUpdatePayload extends IdPayload, ProductRepPayload {}

export default ProductUpdatePayload;
