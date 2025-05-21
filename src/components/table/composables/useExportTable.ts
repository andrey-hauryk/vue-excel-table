import type { Ref } from 'vue'
import { Workbook } from 'exceljs'
import { saveAs } from 'file-saver'
import type { ColumnProps } from '../types/column'
import {
  getRowHeights,
  getColumnWidths,
  getHeaderStyles,
  getRowStyles,
  getHeaderHeight
} from '../utils/styleUtils'

interface ExportOptions {
  fileName?: string
  formattedValues?: boolean
  editor?: Ref<HTMLElement> | HTMLElement
}

const EXPORT_FORMAT = 'xlsx'
const DEFAULT_FILENAME = 'отчет'

export function useExcelExport() {
  const exportTable = async (
    tableData: any[],
    fields: ColumnProps[],
    options: ExportOptions = {}
  ) => {
    const {
      fileName = DEFAULT_FILENAME,
      formattedValues = true,
      editor
    } = options

    if (!editor) {
      throw new Error('Editor element is required in ExportOptions')
    }

    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Sheet1')

    const headerStyles = getHeaderStyles(editor, fields.length)
    const rowCellStyles = getRowStyles(editor)
    const rowHeights = getRowHeights(editor)
    const columnWidths = getColumnWidths(editor)
    const headerHeight = getHeaderHeight(editor)

    worksheet.columns = columnWidths.map(width => ({ width: width / 8 }))

    // Add header
    worksheet.addRow(fields.map(f => f.label))
    const headerRow = worksheet.getRow(1)
    headerRow.height = headerHeight
    headerRow.eachCell((cell, colIdx) => {
      Object.assign(cell, headerStyles[colIdx - 1])
    })

    // Add data rows
    tableData.forEach((record, rowIndex) => {
      const row = fields.map(field => {
        const raw = record[field.name]
        let value = raw?.value ?? raw

        if (formattedValues && typeof field.valueFormatter === 'function') {
          value = field.valueFormatter(value, record);
        }

        return value
      })

      const worksheetRow = worksheet.addRow(row)
      worksheetRow.height = rowHeights[rowIndex]

      worksheetRow.eachCell((cell, colIdx) => {
        const field = fields[colIdx - 1]
        const style = rowCellStyles?.[rowIndex]?.[colIdx - 1]
        if (style) {
          Object.assign(cell, style)
        }

        const raw = record[field.name]
        let value = raw?.value ?? raw

        if (field.type === 'number') {
          if (typeof value === 'string') {
            value = parseFloat(value.replace(',', '.'))
          }

          const decimalPlaces = Number.isFinite(value) && Math.floor(value) !== value ? 4 : 0
          cell.numFmt = `#,##0${decimalPlaces ? '.' + '0'.repeat(decimalPlaces) : ''}`
        } else if (field.type === 'string' || typeof value === 'string') {
          cell.numFmt = '@'
        }
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buffer]), `${fileName}.${EXPORT_FORMAT}`)
  }

  return { exportTable }
}
