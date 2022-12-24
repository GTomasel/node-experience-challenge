import { EntitySchema } from 'typeorm';
import Product from '../../Domain/Entities/Product';

const ProductSchema = new EntitySchema<Product>({
    name: 'Product',
    target: Product,
    tableName: 'Products',
    columns: {
        _id: {
            type: 'uuid',
            primary: true,
            unique: true
        },
        name: {
            type: String
        },
        type: {
            type: Number
        },
        category: {
            type: String
        },
        createdAt: {
            name: 'createdAt',
            type: 'timestamp with time zone',
            createDate: true
        },
        updatedAt: {
            name: 'updatedAt',
            type: 'timestamp with time zone',
            updateDate: true
        }
    },
    relations: {
        createdBy: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: true,
            eager: true
        },
        category: {
            type: 'many-to-one',
            target: 'Category',
            joinColumn: true,
            eager: true
        }
        // TODO: duplicate reference error.
        // lastModifiedBy: {
        //     type: 'many-to-one',
        //     target: 'User',
        //     joinColumn: true,
        //     eager: false
        // }
    },
    indices: [
        {
            name: 'id_product_1',
            unique: true,
            columns: ['_id']
        }
    ],
    uniques: [
        {
            name: 'unq_product_1',
            columns: ['_id']
        }
    ]
});

export default ProductSchema;
