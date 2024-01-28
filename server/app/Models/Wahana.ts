import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Wahana extends BaseModel {
  public static table = "master_wahana";

  @column({ isPrimary: true, columnName: "id_wahana" })
  public idWahana: number;

  @column()
  public nama: string;

  @column()
  public jenis: string;

  @column()
  public deskripsi: string | null;

  @column()
  public hargaTiket: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
