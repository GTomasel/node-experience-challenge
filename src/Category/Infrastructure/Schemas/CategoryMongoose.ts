import { Schema } from 'mongoose';
import Category from '../../Domain/Entities/Category';
import { uuid } from '@deepkit/type';

const CategorySchema: any = new Schema<Category>({
    _id: { type: String, default: uuid },
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.String, ref: 'User' },
    lastModifiedBy: { type: Schema.Types.String, ref: 'User' }
}, { timestamps: true });

CategorySchema.loadClass(Category);

export default CategorySchema;
