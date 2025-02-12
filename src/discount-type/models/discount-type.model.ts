import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Discount } from "../../discount/models/discount.model";

interface IDiscountTypeCreationAttr {
  name: string;
  description: string;
}

@Table({ tableName: "discount-type" })
export class DiscountType extends Model<
  DiscountType,
  IDiscountTypeCreationAttr
> {
  @ApiProperty({
    example: 1,
    description: "Admin ID raqami",
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
  description: string;

  @HasMany(() => Discount)
  discounts: Discount[];
}
