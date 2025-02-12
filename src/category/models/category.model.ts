import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { Discount } from "../../discount/models/discount.model";

interface ICategoryCreationAttr {
  name: string;
  description: string;
  parentCategoryId: number;
}

@Table({ tableName: "category" })
export class Category extends Model<Category, ICategoryCreationAttr> {
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

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER })
  parentCategoryId: number;

  @HasMany(() => Category)
  categorys: Category[];

  @HasMany(() => Discount)
  discounts: Discount[];
}
