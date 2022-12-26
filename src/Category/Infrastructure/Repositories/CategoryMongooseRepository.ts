import { Query } from 'mongoose';
import ICriteria from '../../../Shared/Presentation/Requests/ICriteria';
import IPaginator from '../../../Shared/Infrastructure/Orm/IPaginator';

import ICategoryRepository from './ICategoryRepository';
import CategoryFilter from '../../Presentation/Criterias/CategoryFilter';
import MongoosePaginator from '../../../Shared/Infrastructure/Orm/MongoosePaginator';
import ICategory from '../Schemas/CategoryMongooseDocument';

import BaseMongooseRepository from '../../../Shared/Infrastructure/Repositories/BaseMongooseRepository';
import ICategoryDomain from '../../Domain/Entities/ICategoryDomain';
import Category from '../../Domain/Entities/Category';

class CategoryMongooseRepository extends BaseMongooseRepository<ICategoryDomain, ICategory> implements ICategoryRepository
{
    constructor()
    {
        super(Category.name, ['createdBy', 'lastModifiedBy']);
    }

    async list(criteria: ICriteria): Promise<IPaginator>
    {
        const queryBuilder: Query<ICategory[], ICategory> = this.repository.find();
        const filter = criteria.getFilter();

        if (filter.has(CategoryFilter.TYPE))
        {
            const type = filter.get(CategoryFilter.TYPE);

            void queryBuilder.where(CategoryFilter.TYPE).equals(type);
        }

        if (filter.has(CategoryFilter.NAME))
        {
            const name: string = filter.get(CategoryFilter.NAME) as string;
            const rSearch = new RegExp(name, 'g');

            void queryBuilder.where(CategoryFilter.NAME).regex(rSearch);
        }

        void queryBuilder.populate(this.populate);

        return new MongoosePaginator(queryBuilder, criteria);
    }
}

export default CategoryMongooseRepository;
