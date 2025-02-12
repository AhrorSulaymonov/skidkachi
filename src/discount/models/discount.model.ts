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
import { Store } from "../../store/models/store.model";
import { Category } from "../../category/models/category.model";
import { DiscountType } from "../../discount-type/models/discount-type.model";
import { User } from "../../users/models/user.model";
import { Favourite } from "../../favourite/models/favourite.model";
import { Photo } from "../../photo/models/photo.model";
import { Rewiew } from "../../rewiews/models/rewiew.model";

interface IDiscountCreationAttr {
  storeId: number;
  title: string;
  description: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
  categoryId: number;
  discountValue: number;
  special_link: string;
  discountTypeId: number;
}

@Table({ tableName: "discount" })
export class Discount extends Model<Discount, IDiscountCreationAttr> {
  @ApiProperty({
    example: 1,
    description: "Discount ID raqami",
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Store)
  @Column({ type: DataType.INTEGER })
  storeId: number;

  @BelongsTo(() => Store)
  store: Store;

  @Column({
    type: DataType.STRING(30),
  })
  title: string;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @Column({
    type: DataType.DECIMAL,
  })
  discount_percent: number;

  @Column({
    type: DataType.DATE,
  })
  start_date: string;

  @Column({
    type: DataType.DATE,
  })
  end_date: string;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;

  @Column({
    type: DataType.DECIMAL(15, 2),
  })
  discountValue: number;

  @Column({
    type: DataType.STRING,
  })
  special_link: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_active: boolean;

  @ForeignKey(() => DiscountType)
  @Column({ type: DataType.INTEGER })
  discountTypeId: number;

  @BelongsTo(() => DiscountType)
  discountType: DiscountType;

  @BelongsToMany(() => User, () => Favourite)
  favouriteUsers: User[];

  @HasMany(() => Photo)
  photos: Photo[];

  @HasMany(() => Rewiew)
  rewiews: Rewiew[];
}
