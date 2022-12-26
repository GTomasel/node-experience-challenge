import { NextFunction, Request, Response } from 'express';
import { controller, httpDelete, httpGet, httpPost, httpPut, next, request, response } from 'inversify-express-utils';
import StatusCode from '../../../Shared/Application/StatusCode';
import IPaginator from '../../../Shared/Infrastructure/Orm/IPaginator';

import ExpressResponder from '../../../Shared/Application/Http/ExpressResponder';
import AuthorizeExpressMiddleware from '../../../Auth/Presentation/Middlewares/AuthorizeExpressMiddleware';
import Permissions from '../../../Config/Permissions';

import CategoryTransformer from '../Transformers/CategoryTransformer';
import CategoryRepRequest from '../Requests/CategoryRepRequest';
import IdRequest from '../../../Shared/Presentation/Requests/IdRequest';
import CategoryRequestCriteria from '../Requests/CategoryRequestCriteria';
import CategoryUpdateRequest from '../Requests/CategoryUpdateRequest';
import ICategoryDomain from '../../Domain/Entities/ICategoryDomain';

import CategoryController from '../Controllers/CategoryController';
import { AuthUser } from '../../../Auth/Presentation/Helpers/AuthUser';
import ResponseMessageEnum from '../../../Shared/Domain/Enum/ResponseMessageEnum';
import DefaultMessageTransformer from '../../../Shared/Presentation/Transformers/DefaultMessageTransformer';

@controller('/api/categories')
class CategoryExpressHandler
{
    private responder: ExpressResponder;
    private readonly controller: CategoryController;

    constructor()
    {
        this.responder = new ExpressResponder();
        this.controller = new CategoryController();
    }

    @httpPost('/', void AuthorizeExpressMiddleware(Permissions.ITEMS_SAVE))
    public async save(@request() req: Request, @response() res: Response, @next() nex: NextFunction)
    {
        const data = {
            authUser: AuthUser(req),
            ...req.body
        };

        const _request = new CategoryRepRequest(data);

        const category: ICategoryDomain = await this.controller.save(_request);

        void await this.responder.send(category, req, res, StatusCode.HTTP_CREATED, new DefaultMessageTransformer(ResponseMessageEnum.CREATED));
    }

    @httpGet('/', void AuthorizeExpressMiddleware(Permissions.ITEMS_LIST))
    public async list(@request() req: Request, @response() res: Response)
    {
        const data = {
            query: req.query,
            url: req.url
        };

        const _request = new CategoryRequestCriteria(data);

        const paginator: IPaginator = await this.controller.list(_request);

        await this.responder.paginate(paginator, req, res, StatusCode.HTTP_OK, new CategoryTransformer());
    }

    @httpGet('/:id', void AuthorizeExpressMiddleware(Permissions.ITEMS_SHOW))
    public async getOne(@request() req: Request, @response() res: Response, @next() nex: NextFunction)
    {
        const _request = new IdRequest({ id: req.params.id });

        const category: ICategoryDomain = await this.controller.getOne(_request);

        void await this.responder.send(category, req, res, StatusCode.HTTP_OK, new CategoryTransformer());
    }

    @httpPut('/:id', void AuthorizeExpressMiddleware(Permissions.ITEMS_UPDATE))
    public async update(@request() req: Request, @response() res: Response, @next() nex: NextFunction)
    {
        const data = {
            id: req.params.id,
            authUser: AuthUser(req),
            ...req.body
        };

        const _request = new CategoryUpdateRequest(data);

        const category: ICategoryDomain = await this.controller.update(_request);

        void await this.responder.send(category, req, res, StatusCode.HTTP_CREATED, new DefaultMessageTransformer(ResponseMessageEnum.UPDATED));
    }

    @httpDelete('/:id', void AuthorizeExpressMiddleware(Permissions.ITEMS_DELETE))
    public async remove(@request() req: Request, @response() res: Response, @next() nex: NextFunction)
    {
        const _request = new IdRequest({ id: req.params.id });

        const category: ICategoryDomain = await this.controller.remove(_request);

        void await this.responder.send(category, req, res, StatusCode.HTTP_OK, new CategoryTransformer());
    }
}

export default CategoryExpressHandler;
