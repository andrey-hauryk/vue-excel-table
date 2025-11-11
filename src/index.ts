import ExcelTable from "./components/ui/ExcelTable.vue";
import NestedTable from "./components/ui/NestedTable.vue";

export { ExcelTable, NestedTable };

export default {
  install(app) {
    app.component("ExcelTable", ExcelTable);
    app.component("NestedTable", NestedTable);
  },
};
