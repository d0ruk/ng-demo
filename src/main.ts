import "./polyfills.ts";
import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
const isProd = process.env.ENV === "production";

if (isProd) { enableProdMode(); }

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(console.error);

if (module.hot) {
  module.hot.accept();
}