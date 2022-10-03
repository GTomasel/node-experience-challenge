import IFileDomain from '../Entities/IFileDomain';
import FilesystemFactory from '../../../Shared/Factories/FilesystemFactory';
import { REPOSITORIES } from '../../../Config/Injects';
import IFileRepository from '../../Infrastructure/Repositories/IFileRepository';
import PresignedFileRepPayload from 'File/Domain/Payloads/PresignedFileRepPayload';
import ICriteria from '../../../Shared/Presentation/Requests/ICriteria';
import IPaginator from '../../../Shared/Infrastructure/Orm/IPaginator';
import ListObjectsPayload from 'File/Domain/Payloads/ListObjectsPayload';
import FileBase64RepPayload from '../Payloads/FileBase64RepPayload';
import FileMultipartRepPayload from '../Payloads/FileMultipartRepPayload';
import FileRepPayload from '../Payloads/FileRepPayload';
import CreateBucketPayload from '../Payloads/CreateBucketPayload';
import IdPayload from '../../../Shared/Presentation/Requests/IdPayload';
import FileDTO from '../Models/FileDTO';
import IFileDTO from '../Models/IFileDTO';
import { validate } from 'uuid';
import { getRequestContext } from '../../../Shared/Presentation/Shared/RequestContext';
import IFilesystem from '../../../Shared/Infrastructure/Filesystem/IFilesystem';
// @ts-ignore
import { CWebp } from 'cwebp';
import IFileMultipart from '../Entities/IFileMultipart';
import FileMultipartOptimizeDTO from '../../Presentation/Requests/FileMultipartOptimizeDTO';
import FileBase64OptimizeDTO from '../../Presentation/Requests/FileBase64OptimizeDTO';
import * as fs from 'fs';
import FileUpdateMultipartPayload from '../Payloads/FileUpdateMultipartPayload';
import FileUpdateMultipartOptimizeDTO from '../../Presentation/Requests/FileUpdateMultipartOptimizeDTO';
import FileUpdateBase64Payload from '../Payloads/FileUpdateBase64Payload';
import FileUpdateBase64OptimizeDTO from '../../Presentation/Requests/FileUpdateBase64OptimizeDTO';

class FileService
{
    private repository: IFileRepository;
    private fileSystem: IFilesystem;

    constructor()
    {
        const { container } = getRequestContext();
        this.repository = container.resolve<IFileRepository>(REPOSITORIES.IFileRepository);
        this.fileSystem = FilesystemFactory.create();
    }

    async getPresignedGetObject(payload: PresignedFileRepPayload): Promise<string>
    {
        const name = payload.name;
        const expiry = payload.expiry;
        const isPublic = payload.isPublic;
        let file: IFileDomain;

        if (validate(name))
        {
            file = await this.getOne(name);
        }
        else
        {
            file = await this.repository.getOneBy({ name, isPublic });
        }

        return await this.getFileUrl(file, expiry);
    }

    async persist(file: IFileDomain, payload: FileRepPayload): Promise<IFileDomain>
    {
        file.extension = payload.extension;
        file.path = payload.path;
        file.mimeType = payload.mimeType;
        file.size = payload.size;
        file.isPublic = payload.isPublic;

        return await this.repository.save(file);
    }

    async update(file: IFileDomain, payload: FileRepPayload, hasOriginalName = false): Promise<IFileDomain>
    {
        file.originalName = payload.originalName;
        file.setName(hasOriginalName);

        return await this.persist(file, payload);
    }

    async uploadFileBase64(file: IFileDomain, payload: FileBase64RepPayload): Promise<any>
    {
        await this.fileSystem.uploadFileByBuffer(file, payload.base64);

        return file;
    }

    async uploadFileMultipart(file: IFileDomain, payload: FileMultipartRepPayload): Promise<any>
    {
        await this.fileSystem.uploadFile(file, payload.file.path);

        return file;
    }

    async list(payload: ICriteria): Promise<IPaginator>
    {
        return this.repository.list(payload);
    }

    async listObjects(payload: ListObjectsPayload): Promise<any>
    {
        return await this.fileSystem.listObjects(payload);
    }

    async getOne(id: string): Promise<IFileDomain>
    {
        return await this.repository.getOne(id);
    }

    async createBucket(payload: CreateBucketPayload): Promise<void>
    {
        const name = payload.name;
        const bucketNamePrivate = `${name}.private`;
        const bucketNamePublic = `${name}.public`;

        const region = payload.region;
        const bucketPrivatePolicy = payload.privateBucketPolicy;
        const bucketPublicPolicy = payload.publicBucketPolicy;

        await this.fileSystem.createBucket(bucketNamePrivate, region);
        await this.fileSystem.setBucketPolicy(bucketPrivatePolicy, bucketNamePrivate);

        await this.fileSystem.createBucket(bucketNamePublic, region);
        await this.fileSystem.setBucketPolicy(bucketPublicPolicy, bucketNamePublic);
    }

    async download(payload: IdPayload): Promise<IFileDTO>
    {
        const id = payload.id;
        const file: IFileDomain = await this.getOne(id);
        const stream = await this.fileSystem.downloadStreamFile(file);

        return new FileDTO(file, stream);
    }

    async getFileUrl(file: IFileDomain, expiry: number): Promise<string>
    {
        const metadata = {
            'Content-Type': file.mimeType,
            'Content-Length': file.size
        };

        return await this.fileSystem.presignedGetObject(file, expiry, metadata);
    }

    async removeFile(id: string): Promise<IFileDomain>
    {
        const file = await this.repository.delete(id);
        void await this.fileSystem.removeObjects(file);
        return file;
    }

    private async getFileMultipartOptimized(payload: FileMultipartRepPayload): Promise<IFileMultipart>
    {
        const encoder = CWebp(payload.file.path);
        const newPath = payload.file.path.replace(payload.extension, 'webp');
        await encoder.write(newPath);

        return {
            fieldname: payload.file.fieldname,
            originalname: payload.file.originalname.replace(payload.extension, 'webp'),
            encoding: payload.file.encoding,
            mimetype: 'image/webp',
            destination: payload.file.destination,
            filename: payload.file.filename.replace(payload.extension, 'webp'),
            path: newPath,
            size: payload.size
        };
    }

    private async getFileBase64Optimized(payload: FileBase64RepPayload): Promise<string>
    {
        const buffer = Buffer.from(payload.base64, 'base64');
        const encoder = CWebp(buffer);
        const newPath = '/tmp/converted.webp';
        await encoder.write(newPath);

        const buff = fs.readFileSync(newPath);
        return buff.toString('base64');
    }

    async optimizeMultipartToUpload(payload: FileMultipartRepPayload): Promise<FileMultipartRepPayload>
    {
        const file = await this.getFileMultipartOptimized(payload);

        return new FileMultipartOptimizeDTO(payload, file);
    }

    async optimizeMultipartToUpdate(payload: FileUpdateMultipartPayload): Promise<FileUpdateMultipartPayload>
    {
        const file = await this.getFileMultipartOptimized(payload);

        return new FileUpdateMultipartOptimizeDTO(payload, file);
    }

    async optimizeBase64ToUpload(payload: FileBase64RepPayload): Promise<FileBase64RepPayload>
    {
        const base64data = await this.getFileBase64Optimized(payload);

        return new FileBase64OptimizeDTO(payload, base64data);
    }

    async optimizeBase64ToUpdate(payload: FileUpdateBase64Payload): Promise<FileUpdateBase64Payload>
    {
        const base64data = await this.getFileBase64Optimized(payload);

        return new FileUpdateBase64OptimizeDTO(payload, base64data);
    }
}

export default FileService;
