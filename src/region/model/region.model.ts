import {
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from "sequelize-typescript";
import { District } from "../../district/model/district.model";

interface ICreateRegionAttr {
  name: string;
  image: string;
}

@Table({ tableName: "region" })
export class Region extends Model<Region, ICreateRegionAttr> {
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

  @HasMany(() => District)
  district: District[];
}
