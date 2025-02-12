import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Discount } from "../../discount/models/discount.model";
import { User } from "../../users/models/user.model";

interface IRewiewCreationAttr {
  discountId: number;
  userId: number;
  text: string;
  rating: number;
  photo: string;
}

@Table({ tableName: "rewiew" })
export class Rewiew extends Model<Rewiew, IRewiewCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Discount)
  @Column({ type: DataType.INTEGER })
  storeId: number;

  @BelongsTo(() => Discount)
  store: Discount;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.STRING,
  })
  text: string;

  @Column({
    type: DataType.DECIMAL,
  })
  rating: number;

  @Column({
    type: DataType.STRING,
  })
  photo: string;
}
