import Filter from "../../../../Lib/Concrets/Filter";

class RoleFilter extends Filter
{
    static readonly NAME: string = 'name';
    static readonly SLUG: string = 'slug';
    static readonly ENABLE: string = 'enable';

    getFields(): any
    {
        return [
            RoleFilter.NAME,
            RoleFilter.SLUG,
            RoleFilter.ENABLE,
        ];
    }

    getDefaultFilters(): any
    {
        return [];
    }
}

export default RoleFilter;