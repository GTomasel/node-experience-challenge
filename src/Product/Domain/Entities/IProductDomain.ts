import IBaseDomain from '../../../Shared/Domain/Entities/IBaseDomain';
import IUserDomain from '../../../Auth/Domain/Entities/IUserDomain';
import Category from '../../../Category/Domain/Entities/Category';

interface IProductDomain extends IBaseDomain
{
    name: string;
    type: number;
    category: Category;
    createdBy: IUserDomain;
    lastModifiedBy: IUserDomain;
}

export default IProductDomain;
