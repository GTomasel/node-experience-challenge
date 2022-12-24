import IUserDomain from '../../../Auth/Domain/Entities/IUserDomain';

interface ProductRepPayload
{
    name: string;
    type: number;
    authUser: IUserDomain;
}

export default ProductRepPayload;
