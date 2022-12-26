import IUserDomain from '../../../Auth/Domain/Entities/IUserDomain';

interface CategoryRepPayload
{
    name: string;
    type: number;
    authUser: IUserDomain;
}

export default CategoryRepPayload;
