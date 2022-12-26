import { EntitySchema } from 'typeorm';
import Category from '../../Domain/Entities/Category';

const CategorySchema = new EntitySchema<Category>({
    name: 'Category',
    target: Category,
    tableName: 'categories',
    columns: {
        _id: {
            type: 'uuid',
            primary: true,
            unique: true
        },
        name: {
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
            name: 'id_category_1',
            unique: true,
            columns: ['_id']
        }
    ],
    uniques: [
        {
            name: 'unq_category_1',
            columns: ['_id']
        }
    ]
});

export default CategorySchema;
