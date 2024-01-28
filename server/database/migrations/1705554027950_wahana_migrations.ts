import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "master_wahana";

  public async up() {
    const hasTable = await this.schema.hasTable("master_wahana");

    if (hasTable) {
      // Lakukan alter jika tabel sudah ada
      this.schema.alterTable(this.tableName, (table) => {
        // table.increments("id_wahana").primary();
        // table.string("nama").notNullable();
        // table.string("deskripsi", 255);
        // table.decimal("harga_tiket", 10, 2).notNullable();
        // table.integer("kapasitas").notNullable();
        table.string("jenis");

        /**
         * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
         */
        // table.timestamp("created_at", { useTz: true });
        // table.timestamp("updated_at", { useTz: true });
      });
    } else {
      this.schema.createTable(this.tableName, (table) => {
        table.increments("id_wahana").primary();
        table.string("nama").notNullable();
        table.string("deskripsi", 100);
        table.decimal("harga_tiket", 10, 2).notNullable();
        table.string("jenis", 15);
        table.boolean("status").defaultTo(true);

        /**
         * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
         */
        table.timestamp("created_at", { useTz: true });
        table.timestamp("updated_at", { useTz: true });
      });
    }
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
