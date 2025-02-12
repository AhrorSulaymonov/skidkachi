import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Discount } from "../../discount/models/discount.model";

interface IPhotoCreationAttr {
  url: string;
  discountId: number;
}

@Table({ tableName: "photo" })
export class Photo extends Model<Photo, IPhotoCreationAttr> {
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
  url: string;

  @ForeignKey(() => Discount)
  @Column({ type: DataType.INTEGER })
  discountId: number;

  @BelongsTo(() => Discount)
  discount: Discount;
}
