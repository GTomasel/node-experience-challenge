import Filter from '../../../Shared/Presentation/Requests/Filter';

class CategoryFilter extends Filter
{
    static readonly NAME: string = 'name';
    static readonly TYPE: string = 'type';

    getFields(): any
    {
        return [
            CategoryFilter.NAME,
            CategoryFilter.TYPE
        ];
    }

    getDefaultFilters(): any
    {
        return [];
    }
}

export default CategoryFilter;
