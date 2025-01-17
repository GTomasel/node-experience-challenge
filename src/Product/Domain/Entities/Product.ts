import IProductDomain from './IProductDomain';
import Base from '../../../Shared/Domain/Entities/Base';
import IUserDomain from '../../../Auth/Domain/Entities/IUserDomain';
import Category from '../../../Category/Domain/Entities/Category';


class Product extends Base implements IProductDomain
{
    name: string;
    type: number;
    category: Category;
    createdBy: IUserDomain;
    lastModifiedBy: IUserDomain;

    constructor()
    {
        super();
    }
}

export default Product;
