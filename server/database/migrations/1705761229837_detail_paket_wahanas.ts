import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "detail_paket_wahana";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("detail_id").primary();
      table
        .integer("paket_id")
        .unsigned()
        .references("id")
        .inTable("paket_tiket");
      table
        .integer("wahana_id")
        .unsigned()
        .references("id_wahana")
        .inTable("master_wahana");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
