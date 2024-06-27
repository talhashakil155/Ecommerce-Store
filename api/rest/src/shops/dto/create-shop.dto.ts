import { PickType } from '@nestjs/swagger';
import { Shop } from '../entities/shop.entity';

export class CreateShopDto extends PickType(Shop, [
  'name',
  'slug',
  'owner',
  'address',
  'description',
  'cover_image',
  'logo',
  'settings',
  'balance',
]) {
  categories: number[];
}

export class ApproveShopDto {
  id: number;
  admin_commission_rate: number;
}
