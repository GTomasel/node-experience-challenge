import { SuperAgentTest } from 'supertest';
import initTestServer from '../../initTestServer';
import { ILoginResponse } from '../../Shared/InterfaceAdapters/Tests/ILogin';
import { IProductResponse, IListProductsResponse } from './types';
import MainConfig from '../../Config/MainConfig';
import ICreateConnection from '../../Shared/Infrastructure/Database/ICreateConnection';

describe('Start Product Test', () =>
{
    let request: SuperAgentTest;
    let dbConnection: ICreateConnection;
    let token: string = null;
    let productId = '';
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

    describe('Product Success', () =>
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

        test('Add Product /products', async() =>
        {
            const payload = {
                name: 'Product 1',
                type: 10
            };

            const response: IProductResponse = await request
                .post('/api/products')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { data } } = response;

            expect(response.statusCode).toStrictEqual(201);

            productId = data.id;
        });

        test('Get Product /products/:id', async() =>
        {
            const payload = {
                name: 'Product 1',
                type: 10
            };

            const response: IProductResponse = await request
                .get(`/api/products/${productId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { data } } = response;

            expect(response.statusCode).toStrictEqual(200);

            expect(data.name).toStrictEqual(payload.name);
            expect(data.type).toStrictEqual(payload.type);
        });

        test('Update Product /products/:id', async() =>
        {
            const payload = {
                name: 'Product 1 update',
                type: 11
            };

            const response: IProductResponse = await request
                .put(`/api/products/${productId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { data } } = response;

            expect(response.statusCode).toStrictEqual(201);
        });

        test('Delete Product /products/:id', async() =>
        {
            const payload = {
                name: 'Product 13 for delete',
                type: 13
            };

            const createResponse: IProductResponse = await request
                .post('/api/products')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            deleteResponse = await request
                .delete(`/api/products/${createResponse.body.data.id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { data } } = deleteResponse;

            expect(deleteResponse.statusCode).toStrictEqual(200);

            expect(data.name).toStrictEqual(payload.name);
            expect(data.type).toStrictEqual(payload.type);
        });

        test('Get Products /products', async() =>
        {
            const config = MainConfig.getInstance();

            const response: IListProductsResponse = await request
                .get('/api/products?pagination[offset]=0&pagination[limit]=5')
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
            expect(pagination.firstUrl).toContain('/api/products?pagination[offset]=0&pagination[limit]=5');
            expect(pagination.lastUrl).toContain('/api/products?pagination[offset]=10&pagination[limit]=5');
            expect(pagination.nextUrl).toContain('/api/products?pagination[offset]=5&pagination[limit]=5');
            expect(pagination.prevUrl).toStrictEqual(null);
            expect(pagination.currentUrl).toContain('/api/products?pagination[offset]=0&pagination[limit]=5');
        });

        test('Get Products /products without pagination', async() =>
        {
            const response: IListProductsResponse = await request
                .get('/api/products')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { data, pagination } } = response;

            expect(response.statusCode).toStrictEqual(200);

            expect(data.length).toStrictEqual(11);
            expect(pagination).not.toBeDefined();
        });

        test('Get Products /products with Filter Type', async() =>
        {
            const response: IListProductsResponse = await request
                .get('/api/products?pagination[limit]=20&pagination[offset]=0&filter[type]=11')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { data, pagination } } = response;

            expect(response.statusCode).toStrictEqual(200);

            expect(data.length).toStrictEqual(1);
            expect(pagination.total).toStrictEqual(1);

            expect(data[0].type).toStrictEqual(11);
        });

        test('Get Products /products with Sort Desc Type', async() =>
        {
            const response: IListProductsResponse = await request
                .get('/api/products?pagination[limit]=20&pagination[offset]=0&sort[type]=desc')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { data: [product1, product2] } } = response;

            expect(response.statusCode).toStrictEqual(200);

            expect(product1.type).toBeGreaterThanOrEqual(product2.type);
        });
    });

    describe('Product Fails', () =>
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

        test('Add Product /products', async() =>
        {
            const payload = {
                name: 'Product 2',
                type: 'Product 1'
            };

            const response: IProductResponse = await request
                .post('/api/products')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { message, errors: [error] } } = response;

            expect(response.statusCode).toStrictEqual(422);
            expect(message).toStrictEqual('Failed Request.');

            expect(error.property).toStrictEqual('type');
            expect(error.constraints.isInt).toStrictEqual('type must be an integer number');
        });

        test('Get Product /products/:id', async() =>
        {
            const response: IProductResponse = await request
                .get(`/api/products/${productId}dasdasda123`)
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

        test('Update Product /products/:id', async() =>
        {
            const payload = {
                name: 11,
                type: 'asdasd'
            };

            const response: IProductResponse = await request
                .put(`/api/products/${productId}`)
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

        test('Delete Product error /products/:id', async() =>
        {
            const deleteErrorResponse: IProductResponse = await request
                .delete(`/api/products/${deleteResponse.body.data.id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { message } } = deleteErrorResponse;

            expect(deleteErrorResponse.statusCode).toStrictEqual(400);
            expect(message).toStrictEqual('Product not found.');
        });
    });
});

