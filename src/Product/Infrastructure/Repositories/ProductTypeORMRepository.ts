import IProductRepository from './IProductRepository';
import Product from '../../Domain/Entities/Product';
import { injectable } from 'inversify';
import ICriteria from '../../../Shared/Presentation/Requests/ICriteria';
import IPaginator from '../../../Shared/Infrastructure/Orm/IPaginator';

import TypeORMPaginator from '../../../Shared/Infrastructure/Orm/TypeORMPaginator';
import ProductFilter from '../../Presentation/Criterias/ProductFilter';
import ProductSchema from '../Schemas/ProductTypeORM';

import BaseTypeORMRepository from '../../../Shared/Infrastructure/Repositories/BaseTypeORMRepository';

@injectable()
class ProductTypeORMRepository extends BaseTypeORMRepository<Product> implements IProductRepository
{
    constructor()
    {
        super(Product.name, ProductSchema);
    }

    async list(criteria: ICriteria): Promise<IPaginator>
    {
        const queryBuilder = this.repository.createQueryBuilder('i');

        const filter = criteria.getFilter();

        queryBuilder.where('1 = 1');

        if (filter.has(ProductFilter.TYPE))
        {
            const type = filter.get(ProductFilter.TYPE);

            queryBuilder.andWhere(`i.${ProductFilter.TYPE} = :${ProductFilter.TYPE}`);
            queryBuilder.setParameter(ProductFilter.TYPE, type);
        }

        if (filter.has(ProductFilter.NAME))
        {
            const name = filter.get(ProductFilter.NAME);

            queryBuilder.andWhere(`i.${ProductFilter.NAME} ilike :${ProductFilter.NAME}`);
            queryBuilder.setParameter(ProductFilter.NAME, `%${name}%`);
        }

        queryBuilder.leftJoinAndSelect('i.createdBy', 'createdBy');
        queryBuilder.leftJoinAndSelect('i.lastModifiedBy', 'lastModifiedBy');

        return new TypeORMPaginator(queryBuilder, criteria);
    }
}

export default ProductTypeORMRepository;
