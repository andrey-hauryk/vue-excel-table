import type { Ref } from 'vue'
import { Workbook } from 'exceljs'
import { saveAs } from 'file-saver'
import { getRowHeights, getColumnWidths, getHeaderStyles, getRowStyles, getHeaderHeight } from '../utils/styleUtils'
import { formatCellValue, applyNumberFormat } from '../utils/dataUtils'

interface ExportField {
  name: string
  label: string
  type: 'string' | 'number' | 'date'
}

interface ExportOptions {
  fileName?: string
  editor?: Ref<HTMLElement> | HTMLElement
}

const EXPORT_FORMAT = 'xlsx';
const DEFAULT_FILENAME = 'отчет';

export function useExcelExport() {
  const exportTable = async (
    tableData: any[],
    fields: ExportField[],
    options: ExportOptions = {}
  ) => {

    const { 
      fileName = DEFAULT_FILENAME, 
      editor 
    } = options

    if (!editor) {
      throw new Error("Editor element is required in ExportOptions")
    }

    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Sheet1')

    const headerStyles = getHeaderStyles(editor, fields.length)
    const rowCellStyles = getRowStyles(editor);
    const rowHeights = getRowHeights(editor)
    const columnWidths = getColumnWidths(editor)
    const headerHight = getHeaderHeight(editor);

    worksheet.columns = columnWidths.map(width => ({ width: width / 8 }))

    worksheet.addRow(fields.map(f => f.label))
    const headerRow = worksheet.getRow(1)
    headerRow.height = headerHight
    headerRow.eachCell((cell, colIdx) => {
      Object.assign(cell, headerStyles[colIdx - 1])
    })

    tableData.forEach((record, rowIndex) => {
      const row = fields.map(field => {
        const raw = record[field.name]
        const value = raw?.value ?? raw
        return value;
      });
      const worksheetRow = worksheet.addRow(row)
      worksheetRow.height = rowHeights[rowIndex]

      worksheetRow.eachCell((cell, colIdx) => {
        const field = fields[colIdx - 1]
        const style = rowCellStyles?.[rowIndex]?.[colIdx - 1]
        if (style) Object.assign(cell, style)

        // applyNumberFormat(cell, field.type)
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buffer]), `${fileName}.${EXPORT_FORMAT}`)
  }

  return { exportTable }
}
