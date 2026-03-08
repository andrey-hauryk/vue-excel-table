import { createApp } from "vue";
import App from "./App.vue";
import VueExcelTable from "vue-excel-table";
import "vue-excel-table/vue-excel-table.css";

createApp(App).use(VueExcelTable).mount("#app");
