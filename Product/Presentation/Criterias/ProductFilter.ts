import Filter from '../../../Shared/Presentation/Requests/Filter';

class ProductFilter extends Filter
{
    static readonly NAME: string = 'name';
    static readonly TYPE: string = 'type';

    getFields(): any
    {
        return [
            ProductFilter.NAME,
            ProductFilter.TYPE
        ];
    }

    getDefaultFilters(): any
    {
        return [];
    }
}

export default ProductFilter;
