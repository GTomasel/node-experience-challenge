import RequestCriteria from '../../../Shared/Presentation/Requests/RequestCriteria';

import CategoryFilter from '../Criterias/CategoryFilter';
import CategorySort from '../Criterias/CategorySort';
import Pagination from '../../../Shared/Presentation/Shared/Pagination';
import ICriteria from '../../../Shared/Presentation/Requests/ICriteria';

class CategoryRequestCriteria extends RequestCriteria implements ICriteria
{
    constructor(data: Record<string, any>)
    {
        super(new CategorySort(data.query), new CategoryFilter(data.query), new Pagination(data.query, data.url));
    }
}

export default CategoryRequestCriteria;
