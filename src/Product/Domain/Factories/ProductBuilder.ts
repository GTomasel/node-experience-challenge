import Product from '../Entities/Product';
import ProductRepPayload from '../Payloads/ProductRepPayload';
import IProductDomain from '../Entities/IProductDomain';

class ProductBuilder
{
    private _product: IProductDomain;
    private _payload: ProductRepPayload;

    constructor(payload?: ProductRepPayload)
    {
        this._payload = payload;
    }

    setProduct(product?: IProductDomain)
    {
        this._product = product ?? new Product();

        return this;
    }

    build()
    {
        this._product.name = this._payload.name;
        this._product.type = this._payload.type;

        return this;
    }

    update()
    {
        this._product.lastModifiedBy = this._payload.authUser;

        return this._product;
    }

    create()
    {
        this._product.createdBy = this._payload.authUser;
        this._product.lastModifiedBy = this._payload.authUser;

        return this._product;
    }
}

export default ProductBuilder;
