import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from "sequelize-typescript";
import { Region } from "../../region/model/region.model";
import { Store } from "../../store/models/store.model";

interface IDistrictCreateAttr {
  name: string;
  image: string;
  regionId: number;
}

@Table({ tableName: "district" })
export class District extends Model<District, IDistrictCreateAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  image: string;

  @ForeignKey(() => Region)
  @Column({
    type: DataType.INTEGER,
    onDelete: "Restrict",
  })
  regionId: number;

  @BelongsTo(() => Region)
  region: Region;

  @HasMany(() => Store)
  stores: Store[];
}
