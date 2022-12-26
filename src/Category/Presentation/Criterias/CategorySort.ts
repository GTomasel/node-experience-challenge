import Sort from '../../../Shared/Presentation/Requests/Sort';

class CategorySort extends Sort
{
    static readonly NAME: string = 'name';
    static readonly TYPE: string = 'type';

    getFields(): any
    {
        return [
            CategorySort.NAME,
            CategorySort.TYPE
        ];
    }

    getDefaultSorts(): any
    {
        return [
            { [CategorySort.NAME]: 'asc' }
        ];
    }
}

export default CategorySort;
