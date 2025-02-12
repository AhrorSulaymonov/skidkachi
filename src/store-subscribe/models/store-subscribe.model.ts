import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "../../users/models/user.model";
import { Store } from "../../store/models/store.model";

interface IStoreSubscribeCreationAttr {
  userId: number;
  storeId: number;
}

@Table({ tableName: "store-subscribe" })
export class StoreSubscribe extends Model<
  StoreSubscribe,
  IStoreSubscribeCreationAttr
> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Store)
  @Column({ type: DataType.INTEGER })
  storeId: number;

  @BelongsTo(() => Store)
  store: Store;
}
