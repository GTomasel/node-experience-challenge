import ICategoryDomain from '../../Domain/Entities/ICategoryDomain';

import SaveCategoryUseCase from '../../Domain/UseCases/SaveCategoryUseCase';
import ListCategoriesUseCase from '../../Domain/UseCases/ListCategoriesUseCase';
import GetCategoryUseCase from '../../Domain/UseCases/GetCategoryUseCase';
import RemoveCategoryUseCase from '../../Domain/UseCases/RemoveCategoryUseCase';
import UpdateCategoryUseCase from '../../Domain/UseCases/UpdateCategoryUseCase';
import ValidatorRequest from '../../../Shared/Presentation/Shared/ValidatorRequest';
import CategoryRepPayload from '../../Domain/Payloads/CategoryRepPayload';
import IdPayload from '../../../Shared/Presentation/Requests/IdPayload';
import CategoryUpdatePayload from '../../Domain/Payloads/CategoryUpdatePayload';
import ICriteria from '../../../Shared/Presentation/Requests/ICriteria';
import IPaginator from '../../../Shared/Infrastructure/Orm/IPaginator';

class CategoryController
{
    public async save(request: CategoryRepPayload): Promise<ICategoryDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new SaveCategoryUseCase();
        return await useCase.handle(request);
    }

    public async list(request: ICriteria): Promise<IPaginator>
    {
        await ValidatorRequest.handle(request);

        const useCase = new ListCategoriesUseCase();
        return await useCase.handle(request);
    }

    public async getOne(request: IdPayload): Promise<ICategoryDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new GetCategoryUseCase();
        return await useCase.handle(request);
    }

    public async update(request: CategoryUpdatePayload): Promise<ICategoryDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new UpdateCategoryUseCase();
        return await useCase.handle(request);
    }

    public async remove(request: IdPayload): Promise<ICategoryDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new RemoveCategoryUseCase();
        return await useCase.handle(request);
    }
}

export default CategoryController;
