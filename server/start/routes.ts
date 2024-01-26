/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
  return { hello: "world" };
});

Route.group(() => {
  Route.group(() => {
    Route.get("/", "WahanaController.index");
    Route.get("/paket", "WahanaController.paket");
    Route.post("/", "WahanaController.store");
    Route.put("/:id", "WahanaController.update");
    Route.delete("/:id", "WahanaController.destroy");
  }).prefix("wahana");

  Route.group(() => {
    Route.get("/all", "UsersController.index");
    Route.post("/login", "UsersController.login");
  }).prefix("petugas");

  Route.group(() => {
    Route.get("/kunjungan", "ReportsController.kunjungan");
    Route.post("/pendapatan", "ReportsController.pendapatan");
    Route.post("/wahana", "ReportsController.wahana");
    Route.get("/fix", "ReportsController.fix");
  }).prefix("reports");

  Route.group(() => {
    Route.post("/create", "TransactionsController.create");
    Route.post("/all", "TransactionsController.index");
    Route.post("/delete", "TransactionsController.delete");
  }).prefix("transaksi");

  Route.group(() => {
    Route.get("/all", "DetailPaketController.index");
  }).prefix("paket");
}).prefix("api");
