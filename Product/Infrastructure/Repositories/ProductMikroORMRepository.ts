import IProductRepository from './IProductRepository';
import Product from '../../Domain/Entities/Product';
import { injectable } from 'inversify';
import ICriteria from '../../../Shared/Presentation/Requests/ICriteria';
import IPaginator from '../../../Shared/Infrastructure/Orm/IPaginator';

import Paginator from '../../../Shared/Infrastructure/Orm/MikroORMPaginator';
import ProductFilter from '../../Presentation/Criterias/ProductFilter';
import ProductSchema from '../Schemas/ProductMikroORM';

import BaseMikroORMRepository from '../../../Shared/Infrastructure/Repositories/BaseMikroORMRepository';
import { QueryBuilder } from '@mikro-orm/postgresql';

@injectable()
class ProductMikroORMRepository extends BaseMikroORMRepository<Product> implements IProductRepository
{
    constructor()
    {
        super(Product.name, ProductSchema);
    }

    async list(criteria: ICriteria): Promise<IPaginator>
    {
        const queryBuilder: QueryBuilder = this.em.createQueryBuilder('Product', 'i');

        const filter = criteria.getFilter();

        void queryBuilder.where('1 = 1');

        if (filter.has(ProductFilter.TYPE))
        {
            void queryBuilder.andWhere(`i.${ProductFilter.TYPE} = ?`, [`${filter.get(ProductFilter.TYPE)}`]);
        }
        if (filter.has(ProductFilter.NAME))
        {
            void queryBuilder.andWhere(`i.${ProductFilter.NAME} like ?`, [`${filter.get(ProductFilter.NAME)}`]);
        }

        return new Paginator(queryBuilder, criteria);
    }
}

export default ProductMikroORMRepository;
