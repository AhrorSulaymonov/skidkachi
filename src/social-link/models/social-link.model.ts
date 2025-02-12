import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { StoreSocialLink } from "../../store-social-link/models/store-social-link.model";

interface ISocialLinkCreationAttr {
  name: string;
  icon: string;
}

@Table({ tableName: "social-link" })
export class SocialLink extends Model<SocialLink, ISocialLinkCreationAttr> {
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
    type: DataType.STRING,
    allowNull: false,
  })
  icon: string;

  @HasMany(() => StoreSocialLink)
  storeSocialLinks: StoreSocialLink[];
}
