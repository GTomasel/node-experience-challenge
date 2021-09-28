import ItemRepPayload from '../../InterfaceAdapters/Payloads/ItemRepPayload';
import IItemDomain from '../../InterfaceAdapters/IItemDomain';
import Item from '../Entities/Item';
import IItemRepository from '../../InterfaceAdapters/IItemRepository';
import { REPOSITORIES } from '../../../Config/repositories';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import IUserDomain from '../../../User/InterfaceAdapters/IUserDomain';
import ItemUpdatePayload from '../../InterfaceAdapters/Payloads/ItemUpdatePayload';


class ItemService
{
    @containerFactory(REPOSITORIES.IItemRepository)
    private repository: IItemRepository;

    async persist(item: IItemDomain, payload: ItemRepPayload): Promise<IItemDomain>
    {
        item.name = payload.getName();
        item.type = payload.getType();

        return await this.repository.save(item);
    }

    async create(payload: ItemRepPayload, auth_user: IUserDomain): Promise<IItemDomain>
    {
        const item = new Item();
        item.createdBy = auth_user;

        return await this.persist(item, payload);
    }

    async update(payload: ItemUpdatePayload, auth_user: IUserDomain): Promise<IItemDomain>
    {
        const id = payload.getId();
        const item: IItemDomain = await this.getOne(id);
        item.lastModifiedBy = auth_user;

        return await this.persist(item, payload);
    }

    async getOne(id: string): Promise<IItemDomain>
    {
        return await this.repository.getOne(id);
    }
}

export default ItemService;