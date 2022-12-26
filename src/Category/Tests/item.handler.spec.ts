import { SuperAgentTest } from 'supertest';
import initTestServer from '../../initTestServer';
import { ILoginResponse } from '../../Shared/InterfaceAdapters/Tests/ILogin';
import { ICategoryResponse, IListCategoriesResponse } from './types';
import MainConfig from '../../Config/MainConfig';
import ICreateConnection from '../../Shared/Infrastructure/Database/ICreateConnection';

describe('Start Category Test', () =>
{
    let request: SuperAgentTest;
    let dbConnection: ICreateConnection;
    let token: string = null;
    let categoryId = '';
    let deleteResponse: any = null;

    beforeAll(async() =>
    {
        const configServer = await initTestServer();

        request = configServer.request;
        dbConnection = configServer.dbConnection;
    });

    afterAll((async() =>
    {
        await dbConnection.drop();
        await dbConnection.close();
    }));

    describe('Category Success', () =>
    {
        beforeAll(async() =>
        {
            const payload = {
                email: 'user@node.com',
                password: '12345678'
            };

            const response: ILoginResponse = await request
                .post('/api/auth/login?provider=local')
                .set('Accept', 'application/json')
                .send(payload);

            const { body: { data } } = response;

            token = data.token;
        });

        test('Add Category /categories', async() =>
        {
            const payload = {
                name: 'Category 1',
                type: 10
            };

            const response: ICategoryResponse = await request
                .post('/api/categories')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { data } } = response;

            expect(response.statusCode).toStrictEqual(201);

            categoryId = data.id;
        });

        test('Get Category /categories/:id', async() =>
        {
            const payload = {
                name: 'Category 1',
                type: 10
            };

            const response: ICategoryResponse = await request
                .get(`/api/categories/${categoryId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { data } } = response;

            expect(response.statusCode).toStrictEqual(200);

            expect(data.name).toStrictEqual(payload.name);
            expect(data.type).toStrictEqual(payload.type);
        });

        test('Update Category /categories/:id', async() =>
        {
            const payload = {
                name: 'Category 1 update',
                type: 11
            };

            const response: ICategoryResponse = await request
                .put(`/api/categories/${categoryId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { data } } = response;

            expect(response.statusCode).toStrictEqual(201);
        });

        test('Delete Category /categories/:id', async() =>
        {
            const payload = {
                name: 'Category 13 for delete',
                type: 13
            };

            const createResponse: ICategoryResponse = await request
                .post('/api/categories')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            deleteResponse = await request
                .delete(`/api/categories/${createResponse.body.data.id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { data } } = deleteResponse;

            expect(deleteResponse.statusCode).toStrictEqual(200);

            expect(data.name).toStrictEqual(payload.name);
            expect(data.type).toStrictEqual(payload.type);
        });

        test('Get Categories /categories', async() =>
        {
            const config = MainConfig.getInstance();

            const response: IListCategoriesResponse = await request
                .get('/api/categories?pagination[offset]=0&pagination[limit]=5')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { data, pagination } } = response;

            expect(response.statusCode).toStrictEqual(200);

            expect(data.length).toStrictEqual(5);
            expect(pagination.total).toStrictEqual(11);
            expect(pagination.perPage).toStrictEqual(5);
            expect(pagination.currentPage).toStrictEqual(1);
            expect(pagination.lastPage).toStrictEqual(3);
            expect(pagination.from).toStrictEqual(0);
            expect(pagination.to).toStrictEqual(5);
            expect(pagination.path).toContain(config.getConfig().url.urlApi);
            expect(pagination.firstUrl).toContain('/api/categories?pagination[offset]=0&pagination[limit]=5');
            expect(pagination.lastUrl).toContain('/api/categories?pagination[offset]=10&pagination[limit]=5');
            expect(pagination.nextUrl).toContain('/api/categories?pagination[offset]=5&pagination[limit]=5');
            expect(pagination.prevUrl).toStrictEqual(null);
            expect(pagination.currentUrl).toContain('/api/categories?pagination[offset]=0&pagination[limit]=5');
        });

        test('Get Categories /categories without pagination', async() =>
        {
            const response: IListCategoriesResponse = await request
                .get('/api/categories')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { data, pagination } } = response;

            expect(response.statusCode).toStrictEqual(200);

            expect(data.length).toStrictEqual(11);
            expect(pagination).not.toBeDefined();
        });

        test('Get Categories /categories with Filter Type', async() =>
        {
            const response: IListCategoriesResponse = await request
                .get('/api/categories?pagination[limit]=20&pagination[offset]=0&filter[type]=11')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { data, pagination } } = response;

            expect(response.statusCode).toStrictEqual(200);

            expect(data.length).toStrictEqual(1);
            expect(pagination.total).toStrictEqual(1);

            expect(data[0].type).toStrictEqual(11);
        });

        test('Get Categories /categories with Sort Desc Type', async() =>
        {
            const response: IListCategoriesResponse = await request
                .get('/api/categories?pagination[limit]=20&pagination[offset]=0&sort[type]=desc')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { data: [category1, category2] } } = response;

            expect(response.statusCode).toStrictEqual(200);

            expect(category1.type).toBeGreaterThanOrEqual(category2.type);
        });
    });

    describe('Category Fails', () =>
    {
        beforeAll(async() =>
        {
            const payload = {
                email: 'user@node.com',
                password: '12345678'
            };

            const response: ILoginResponse = await request
                .post('/api/auth/login?provider=local')
                .set('Accept', 'application/json')
                .send(payload);

            const { body: { data } } = response;

            token = data.token;
        });

        test('Add Category /categories', async() =>
        {
            const payload = {
                name: 'Category 2',
                type: 'Category 1'
            };

            const response: ICategoryResponse = await request
                .post('/api/categories')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { message, errors: [error] } } = response;

            expect(response.statusCode).toStrictEqual(422);
            expect(message).toStrictEqual('Failed Request.');

            expect(error.property).toStrictEqual('type');
            expect(error.constraints.isInt).toStrictEqual('type must be an integer number');
        });

        test('Get Category /categories/:id', async() =>
        {
            const response: ICategoryResponse = await request
                .get(`/api/categories/${categoryId}dasdasda123`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { message, errors: [error] } } = response;

            expect(response.statusCode).toStrictEqual(422);
            expect(message).toStrictEqual('Failed Request.');

            expect(error.property).toStrictEqual('id');
            expect(error.constraints.isUuid).toBeDefined();
            expect(error.constraints.isUuid).toStrictEqual('id must be a UUID');
        });

        test('Update Category /categories/:id', async() =>
        {
            const payload = {
                name: 11,
                type: 'asdasd'
            };

            const response: ICategoryResponse = await request
                .put(`/api/categories/${categoryId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { message, errors: [errorName, errorType] } } = response;

            expect(response.statusCode).toStrictEqual(422);
            expect(message).toStrictEqual('Failed Request.');

            expect(errorName.property).toStrictEqual('name');
            expect(errorName.constraints.isString).toBeDefined();
            expect(errorName.constraints.isString).toStrictEqual('name must be a string');

            expect(errorType.property).toStrictEqual('type');
            expect(errorType.constraints.isInt).toBeDefined();
            expect(errorType.constraints.isInt).toStrictEqual('type must be an integer number');
        });

        test('Delete Category error /categories/:id', async() =>
        {
            const deleteErrorResponse: ICategoryResponse = await request
                .delete(`/api/categories/${deleteResponse.body.data.id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { message } } = deleteErrorResponse;

            expect(deleteErrorResponse.statusCode).toStrictEqual(400);
            expect(message).toStrictEqual('Category not found.');
        });
    });
});

