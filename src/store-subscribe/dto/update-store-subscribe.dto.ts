import { PartialType } from '@nestjs/swagger';
import { CreateStoreSubscribeDto } from './create-store-subscribe.dto';

export class UpdateStoreSubscribeDto extends PartialType(CreateStoreSubscribeDto) {}
