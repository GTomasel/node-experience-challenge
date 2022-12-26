import { Query } from 'mongoose';
import ICriteria from '../../../Shared/Presentation/Requests/ICriteria';
import IPaginator from '../../../Shared/Infrastructure/Orm/IPaginator';

import IProductRepository from './IProductRepository';
import ProductFilter from '../../Presentation/Criterias/ProductFilter';
import MongoosePaginator from '../../../Shared/Infrastructure/Orm/MongoosePaginator';
import IProduct from '../Schemas/ProductMongooseDocument';

import BaseMongooseRepository from '../../../Shared/Infrastructure/Repositories/BaseMongooseRepository';
import IProductDomain from '../../Domain/Entities/IProductDomain';
import Product from '../../Domain/Entities/Product';

class ProductMongooseRepository extends BaseMongooseRepository<IProductDomain, IProduct> implements IProductRepository
{
    constructor()
    {
        super(Product.name, ['createdBy', 'lastModifiedBy']);
    }

    async list(criteria: ICriteria): Promise<IPaginator>
    {
        const queryBuilder: Query<IProduct[], IProduct> = this.repository.find();
        const filter = criteria.getFilter();

        if (filter.has(ProductFilter.TYPE))
        {
            const type = filter.get(ProductFilter.TYPE);

            void queryBuilder.where(ProductFilter.TYPE).equals(type);
        }

        if (filter.has(ProductFilter.NAME))
        {
            const name: string = filter.get(ProductFilter.NAME) as string;
            const rSearch = new RegExp(name, 'g');

            void queryBuilder.where(ProductFilter.NAME).regex(rSearch);
        }

        void queryBuilder.populate(this.populate);

        return new MongoosePaginator(queryBuilder, criteria);
    }
}

export default ProductMongooseRepository;
