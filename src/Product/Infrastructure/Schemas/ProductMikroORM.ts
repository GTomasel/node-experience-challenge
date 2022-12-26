import { EntitySchema } from '@mikro-orm/core';
import Product from '../../Domain/Entities/Product';

const ProductSchema = new EntitySchema<Product>({
    name: 'Product',
    tableName: 'Products',
    class: Product,
    indexes: [{ name: 'id_product_1', properties: '_id' }],
    uniques: [{ name: 'unq_product_1', properties: ['_id'] }],
    properties: {
        _id: {
            type: 'uuid',
            defaultRaw: 'uuid_generate_v4()',
            primary: true,
            unique: true
        },
        name: {
            type: 'string'
        },
        type: {
            type: 'number'
        },
        category: {
            reference: 'm:1',
            entity: 'Category',
            lazy: false,
            nullable: true
        },
        createdAt: {
            type: 'Date',
            onCreate: () => new Date(), nullable: true
        },
        updatedAt: {
            type: 'Date',
            onCreate: () => new Date(),
            onUpdate: () => new Date(), nullable: true
        },
        createdBy: {
            reference: 'm:1',
            entity: 'User',
            lazy: false,
            nullable: true
        },
        lastModifiedBy: {
            reference: 'm:1',
            entity: 'User',
            lazy: false,
            nullable: true
        }
    }
});

export default ProductSchema;
