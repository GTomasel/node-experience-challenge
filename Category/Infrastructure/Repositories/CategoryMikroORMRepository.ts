import ICategoryRepository from './ICategoryRepository';
import Category from '../../Domain/Entities/Category';
import { injectable } from 'inversify';
import ICriteria from '../../../Shared/Presentation/Requests/ICriteria';
import IPaginator from '../../../Shared/Infrastructure/Orm/IPaginator';

import Paginator from '../../../Shared/Infrastructure/Orm/MikroORMPaginator';
import CategoryFilter from '../../Presentation/Criterias/CategoryFilter';
import CategorySchema from '../Schemas/CategoryMikroORM';

import BaseMikroORMRepository from '../../../Shared/Infrastructure/Repositories/BaseMikroORMRepository';
import { QueryBuilder } from '@mikro-orm/postgresql';

@injectable()
class CategoryMikroORMRepository extends BaseMikroORMRepository<Category> implements ICategoryRepository
{
    constructor()
    {
        super(Category.name, CategorySchema);
    }

    async list(criteria: ICriteria): Promise<IPaginator>
    {
        const queryBuilder: QueryBuilder = this.em.createQueryBuilder('Category', 'i');

        const filter = criteria.getFilter();

        void queryBuilder.where('1 = 1');

        if (filter.has(CategoryFilter.TYPE))
        {
            void queryBuilder.andWhere(`i.${CategoryFilter.TYPE} = ?`, [`${filter.get(CategoryFilter.TYPE)}`]);
        }
        if (filter.has(CategoryFilter.NAME))
        {
            void queryBuilder.andWhere(`i.${CategoryFilter.NAME} like ?`, [`${filter.get(CategoryFilter.NAME)}`]);
        }

        return new Paginator(queryBuilder, criteria);
    }
}

export default CategoryMikroORMRepository;
