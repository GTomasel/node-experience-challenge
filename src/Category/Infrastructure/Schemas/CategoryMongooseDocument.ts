import { Document } from 'mongoose';
import ICategoryDomain from '../../Domain/Entities/ICategoryDomain';

type CategoryMongooseDocument = Document & ICategoryDomain

export default CategoryMongooseDocument;
