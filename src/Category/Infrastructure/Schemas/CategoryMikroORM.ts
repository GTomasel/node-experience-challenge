import { EntitySchema } from '@mikro-orm/core';
import Category from '../../Domain/Entities/Category';

const CategorySchema = new EntitySchema<Category>({
    name: 'Category',
    tableName: 'categories',
    class: Category,
    indexes: [{ name: 'id_category_1', properties: '_id' }],
    uniques: [{ name: 'unq_category_1', properties: ['_id'] }],
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

export default CategorySchema;
