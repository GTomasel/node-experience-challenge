import RequestCriteria from '../../../Shared/Presentation/Requests/RequestCriteria';

import ProductFilter from '../Criterias/ProductFilter';
import ProductSort from '../Criterias/ProductSort';
import Pagination from '../../../Shared/Presentation/Shared/Pagination';
import ICriteria from '../../../Shared/Presentation/Requests/ICriteria';

class ProductRequestCriteria extends RequestCriteria implements ICriteria
{
    constructor(data: Record<string, any>)
    {
        super(new ProductSort(data.query), new ProductFilter(data.query), new Pagination(data.query, data.url));
    }
}

export default ProductRequestCriteria;
