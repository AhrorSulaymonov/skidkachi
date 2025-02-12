import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "../../users/models/user.model";
import { StoreSocialLink } from "../../store-social-link/models/store-social-link.model";
import { District } from "../../district/model/district.model";
import { Region } from "../../region/model/region.model";
import { StoreSubscribe } from "../../store-subscribe/models/store-subscribe.model";
import { Discount } from "../../discount/models/discount.model";

interface IStoreCreationAttr {
  name: string;
  location: string;
  phone: string;
  ownerId: number;
  storeSocialLinkId: number;
  since: string;
  districtId: number;
  regionId: number;
}

@Table({ tableName: "store" })
export class Store extends Model<Store, IStoreCreationAttr> {
  @ApiProperty({
    example: 1,
    description: "Social Link ID raqami",
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  location: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  since: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  ownerId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => StoreSocialLink)
  @Column({ type: DataType.INTEGER })
  storeSocialLinkId: number;

  @BelongsTo(() => StoreSocialLink)
  storeSocialLink: StoreSocialLink;

  @ForeignKey(() => District)
  @Column({ type: DataType.INTEGER })
  districtId: number;

  @BelongsTo(() => District)
  district: District;

  @ForeignKey(() => Region)
  @Column({ type: DataType.INTEGER })
  regionId: number;

  @BelongsTo(() => Region)
  region: Region;

  @BelongsToMany(() => User, () => StoreSubscribe)
  users: User[];

  @HasMany(() => Discount)
  discounts: Discount[];
}
