import IProductDomain from '../../Domain/Entities/IProductDomain';

import SaveProductUseCase from '../../Domain/UseCases/SaveProductUseCase';
import ListProductsUseCase from '../../Domain/UseCases/ListProductsUseCase';
import GetProductUseCase from '../../Domain/UseCases/GetProductUseCase';
import RemoveProductUseCase from '../../Domain/UseCases/RemoveProductUseCase';
import UpdateProductUseCase from '../../Domain/UseCases/UpdateProductUseCase';
import ValidatorRequest from '../../../Shared/Presentation/Shared/ValidatorRequest';
import ProductRepPayload from '../../Domain/Payloads/ProductRepPayload';
import IdPayload from '../../../Shared/Presentation/Requests/IdPayload';
import ProductUpdatePayload from '../../Domain/Payloads/ProductUpdatePayload';
import ICriteria from '../../../Shared/Presentation/Requests/ICriteria';
import IPaginator from '../../../Shared/Infrastructure/Orm/IPaginator';

class ProductController
{
    public async save(request: ProductRepPayload): Promise<IProductDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new SaveProductUseCase();
        return await useCase.handle(request);
    }

    public async list(request: ICriteria): Promise<IPaginator>
    {
        await ValidatorRequest.handle(request);

        const useCase = new ListProductsUseCase();
        return await useCase.handle(request);
    }

    public async getOne(request: IdPayload): Promise<IProductDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new GetProductUseCase();
        return await useCase.handle(request);
    }

    public async update(request: ProductUpdatePayload): Promise<IProductDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new UpdateProductUseCase();
        return await useCase.handle(request);
    }

    public async remove(request: IdPayload): Promise<IProductDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new RemoveProductUseCase();
        return await useCase.handle(request);
    }
}

export default ProductController;
