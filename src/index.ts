import ExcelTable from "./components/ExcelTable.vue";
import VueExcelEditor from "./components/VueExcelEditor.vue";
import VueExcelColumn from "./components/VueExcelColumn.vue";

export { ExcelTable, VueExcelEditor, VueExcelColumn };

export default {
  install(app) {
    app.component("ExcelTable", ExcelTable);
    app.component("VueExcelEditor", VueExcelEditor);
    app.component("VueExcelColumn", VueExcelColumn);
  },
};
