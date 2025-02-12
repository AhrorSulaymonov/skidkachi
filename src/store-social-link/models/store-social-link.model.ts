import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { SocialLink } from "../../social-link/models/social-link.model";
import { Store } from "../../store/models/store.model";

interface IStoreSocialLinkCreationAttr {
  url: string;
  description: string;
  socialLinkId: number;
}

@Table({ tableName: "store-social-link" })
export class StoreSocialLink extends Model<
  StoreSocialLink,
  IStoreSocialLinkCreationAttr
> {
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
  url: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  description: string;

  @ForeignKey(() => SocialLink)
  @Column({ type: DataType.INTEGER })
  socialLinkId: number;

  @BelongsTo(() => SocialLink)
  socialLink: SocialLink;

  @HasMany(() => Store)
  stores: Store[];
}
