import ICategoryRepository from './ICategoryRepository';
import Category from '../../Domain/Entities/Category';
import { injectable } from 'inversify';
import ICriteria from '../../../Shared/Presentation/Requests/ICriteria';
import IPaginator from '../../../Shared/Infrastructure/Orm/IPaginator';

import TypeORMPaginator from '../../../Shared/Infrastructure/Orm/TypeORMPaginator';
import CategoryFilter from '../../Presentation/Criterias/CategoryFilter';
import CategorySchema from '../Schemas/CategoryTypeORM';

import BaseTypeORMRepository from '../../../Shared/Infrastructure/Repositories/BaseTypeORMRepository';

@injectable()
class CategoryTypeORMRepository extends BaseTypeORMRepository<Category> implements ICategoryRepository
{
    constructor()
    {
        super(Category.name, CategorySchema);
    }

    async list(criteria: ICriteria): Promise<IPaginator>
    {
        const queryBuilder = this.repository.createQueryBuilder('i');

        const filter = criteria.getFilter();

        queryBuilder.where('1 = 1');

        if (filter.has(CategoryFilter.TYPE))
        {
            const type = filter.get(CategoryFilter.TYPE);

            queryBuilder.andWhere(`i.${CategoryFilter.TYPE} = :${CategoryFilter.TYPE}`);
            queryBuilder.setParameter(CategoryFilter.TYPE, type);
        }

        if (filter.has(CategoryFilter.NAME))
        {
            const name = filter.get(CategoryFilter.NAME);

            queryBuilder.andWhere(`i.${CategoryFilter.NAME} ilike :${CategoryFilter.NAME}`);
            queryBuilder.setParameter(CategoryFilter.NAME, `%${name}%`);
        }

        queryBuilder.leftJoinAndSelect('i.createdBy', 'createdBy');
        queryBuilder.leftJoinAndSelect('i.lastModifiedBy', 'lastModifiedBy');

        return new TypeORMPaginator(queryBuilder, criteria);
    }
}

export default CategoryTypeORMRepository;
