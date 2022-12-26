import { Schema } from 'mongoose';
import Product from '../../Domain/Entities/Product';
import { uuid } from '@deepkit/type';

const ProductSchema: any = new Schema<Product>({
    _id: { type: String, default: uuid },
    name: { type: String, required: true },
    type: { type: Number, required: true },
    category: { type: Schema.Types.String, ref: 'Category', required: true },
    createdBy: { type: Schema.Types.String, ref: 'User' },
    lastModifiedBy: { type: Schema.Types.String, ref: 'User' }
}, { timestamps: true });

ProductSchema.loadClass(Product);

export default ProductSchema;
