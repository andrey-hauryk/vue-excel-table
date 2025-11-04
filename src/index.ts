import ExcelTable from "./components/ui/ExcelTable.vue";
import VueExcelEditor from "./components/table/VueExcelEditor.vue";
import VueExcelColumn from "./components/table/VueExcelColumn.vue";

export { ExcelTable, VueExcelEditor, VueExcelColumn };

export default {
  install(app) {
    app.component("ExcelTable", ExcelTable);
    app.component("VueExcelEditor", VueExcelEditor);
    app.component("VueExcelColumn", VueExcelColumn);
  },
};
