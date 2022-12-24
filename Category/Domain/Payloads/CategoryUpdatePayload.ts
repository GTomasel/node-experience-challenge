import IdPayload from '../../../Shared/Presentation/Requests/IdPayload';
import CategoryRepPayload from './CategoryRepPayload';
import IUserDomain from '../../../Auth/Domain/Entities/IUserDomain';

interface CategoryUpdatePayload extends IdPayload, CategoryRepPayload {}

export default CategoryUpdatePayload;
