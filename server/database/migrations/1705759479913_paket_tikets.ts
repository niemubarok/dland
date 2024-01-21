import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "paket_tiket";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table
        .integer("id_wahana")
        .unsigned()
        .references("id_wahana")
        .inTable("master_wahana")
        .withKeyName("master_wahana_fk");
      table.string("nama_paket").notNullable();
      table.decimal("harga_paket", 10, 2).notNullable();
      table.boolean("status").notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
