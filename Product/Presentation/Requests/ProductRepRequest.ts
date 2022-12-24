import ProductRepPayload from '../../Domain/Payloads/ProductRepPayload';
import { IsInt, IsObject, IsString } from 'class-validator';
import { decorate } from 'ts-mixer';
import IUserDomain from '../../../Auth/Domain/Entities/IUserDomain';

class ProductRepRequest implements ProductRepPayload
{
    private readonly _name: string;
    private readonly _type: number;
    private readonly _authUser: IUserDomain;

    constructor(data: Record<string, any>)
    {
        this._name = data.name;
        this._type = data.type;
        this._authUser = data.authUser;
    }

    @decorate(IsString())
    get name(): string
    {
        return this._name;
    }

    @decorate(IsInt())
    get type(): number
    {
        return this._type;
    }

    @decorate(IsObject())
    get authUser(): IUserDomain
    {
        return this._authUser;
    }
}

export default ProductRepRequest;
