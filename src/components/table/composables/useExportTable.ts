import type { Ref } from 'vue'
import { getHeaderStyles, getRowStyles } from '../utils/styleUtils'
import { formatCellValue, applyNumberFormat } from '../utils/dataUtils'

interface ExportField {
  name: string
  label: string
  type: 'string' | 'number' | 'date'
}

interface ExportOptions {
  format?: 'xlsx' | 'csv'
  fileName?: string
  editor?: Ref<HTMLElement> | HTMLElement
}

export function useExcelExport() {
  const exportTable = async (
    tableData: any[],
    fields: ExportField[],
    options: ExportOptions = {}
  ) => {
    const { format = 'xlsx', fileName = 'export', editor } = options
    const { Workbook } = await import('exceljs')
    const { saveAs } = await import('file-saver')

    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Sheet1')

    // Получение стилей
    const headerStyles = getHeaderStyles(editor, fields.length)
    const rowCellStyles = getRowStyles(editor);

    // Заголовки
    worksheet.addRow(fields.map(f => f.label))
    const headerRow = worksheet.getRow(1)
    headerRow.height = 20
    headerRow.eachCell((cell, colIdx) => {
      Object.assign(cell, headerStyles[colIdx - 1])
    })

    // Данные
    tableData.forEach((record, rowIndex) => {
      const row = fields.map(field => {
        const raw = record[field.name]
        const value = raw?.value ?? raw
        return value;
      });
      const worksheetRow = worksheet.addRow(row)

      worksheetRow.eachCell((cell, colIdx) => {
        const field = fields[colIdx - 1]
        const style = rowCellStyles?.[rowIndex]?.[colIdx - 1]
        if (style) Object.assign(cell, style)

        // applyNumberFormat(cell, field.type)
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buffer]), `${fileName}.${format}`)
  }

  return { exportTable }
}
