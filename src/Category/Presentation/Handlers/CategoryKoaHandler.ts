import Koa from 'koa';
import Router from 'koa-router';
import StatusCode from '../../../Shared/Application/StatusCode';
import IPaginator from '../../../Shared/Infrastructure/Orm/IPaginator';
import KoaResponder from '../../../Shared/Application/Http/KoaResponder';
import CategoryController from '../Controllers/CategoryController';
import CategoryTransformer from '../Transformers/CategoryTransformer';
import CategoryRepRequest from '../Requests/CategoryRepRequest';
import { AuthUser } from '../../../Auth/Presentation/Helpers/AuthUser';
import IdRequest from '../../../Shared/Presentation/Requests/IdRequest';
import CategoryRequestCriteria from '../Requests/CategoryRequestCriteria';
import CategoryUpdateRequest from '../Requests/CategoryUpdateRequest';
import AuthorizeKoaMiddleware from '../../../Auth/Presentation/Middlewares/AuthorizeKoaMiddleware';
import Permissions from '../../../Config/Permissions';
import ResponseMessageEnum from '../../../Shared/Domain/Enum/ResponseMessageEnum';
import DefaultMessageTransformer from '../../../Shared/Presentation/Transformers/DefaultMessageTransformer';

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/categories'
};

const CategoryKoaHandler: Router = new Router(routerOpts);
const responder: KoaResponder = new KoaResponder();
const controller: CategoryController = new CategoryController();

CategoryKoaHandler.post('/', AuthorizeKoaMiddleware(Permissions.ITEMS_SAVE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const data = {
        authUser: AuthUser(ctx),
        ...ctx.request.body
    };

    const request = new CategoryRepRequest(data);

    const category = await controller.save(request);

    void await responder.send(category, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer(ResponseMessageEnum.CREATED));
});

CategoryKoaHandler.get('/', AuthorizeKoaMiddleware(Permissions.ITEMS_LIST), async(ctx: Koa.ParameterizedContext & any) =>
{
    const data = {
        url: ctx.request.url,
        query: ctx.request.query
    };

    const _request = new CategoryRequestCriteria(data);

    const paginator: IPaginator = await controller.list(_request);

    await responder.paginate(paginator, ctx, StatusCode.HTTP_OK, new CategoryTransformer());
});

CategoryKoaHandler.get('/:id', AuthorizeKoaMiddleware(Permissions.ITEMS_SHOW), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new IdRequest(ctx.params);

    const category = await controller.getOne(_request);

    void await responder.send(category, ctx, StatusCode.HTTP_OK, new CategoryTransformer());
});

CategoryKoaHandler.put('/:id', AuthorizeKoaMiddleware(Permissions.ITEMS_UPDATE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const data = {
        id: ctx.params.id,
        authUser: AuthUser(ctx),
        ...ctx.request.body
    };

    const _request = new CategoryUpdateRequest(data);

    const category = await controller.update(_request);

    void await responder.send(category, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer(ResponseMessageEnum.UPDATED));
});

CategoryKoaHandler.delete('/:id', AuthorizeKoaMiddleware(Permissions.ITEMS_DELETE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new IdRequest(ctx.params);

    const category = await controller.remove(_request);

    void await responder.send(category, ctx, StatusCode.HTTP_OK, new CategoryTransformer());
});

export default CategoryKoaHandler;
