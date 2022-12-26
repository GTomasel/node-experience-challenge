import Sort from '../../../Shared/Presentation/Requests/Sort';

class ProductSort extends Sort
{
    static readonly NAME: string = 'name';
    static readonly TYPE: string = 'type';

    getFields(): any
    {
        return [
            ProductSort.NAME,
            ProductSort.TYPE
        ];
    }

    getDefaultSorts(): any
    {
        return [
            { [ProductSort.NAME]: 'asc' }
        ];
    }
}

export default ProductSort;
