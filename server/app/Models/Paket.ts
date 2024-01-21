import { BaseModel, column, belongsTo, BelongsTo } from "@ioc:Adonis/Lucid/Orm";
import Wahana from "App/Models/Wahana";

export default class PaketTiket extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public namaPaket: string;

  @column()
  public hargaPaket: number;

  @column()
  public status: boolean;

  @belongsTo(() => Wahana, {
    foreignKey: "id_wahana",
    localKey: "id",
  })
  public wahana: BelongsTo<typeof Wahana>;
}
