import type { Ref } from 'vue'

interface ExportField {
  name: string
  label: string
}

interface ExportOptions {
  format?: 'xlsx' | 'csv'
  fileName?: string
  headerRefs?: Ref<HTMLElement[]> | HTMLElement[]
  rowsRef?: Ref<HTMLElement[]> | HTMLElement[]
}

export function useExcelExport() {
  const getCellStyle = (el: HTMLElement) => {
    const style = window.getComputedStyle(el)
    const fontWeight = style.fontWeight
    const fontSize = parseInt(style.fontSize)
    const fontColor = rgbToHex(style.color)

    return {
      font: {
        name: style.fontFamily,
        size: fontSize,
        bold: fontWeight === 'bold' || parseInt(fontWeight) >= 600,
        italic: style.fontStyle === 'italic',
        underline: style.textDecoration.includes('underline'),
        strike: style.textDecoration.includes('line-through'),
        color: { argb: fontColor },
      },
      alignment: {
        horizontal: style.textAlign as any,
        vertical: style.verticalAlign as any,
        wrapText: style.whiteSpace === 'normal' || style.wordBreak === 'break-word',
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: rgbToHex(style.backgroundColor) },
      },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    }
  }

  const exportTable = async (
    tableData: any[],
    fields: ExportField[],
    options: ExportOptions = {}
  ) => {
    const { format = 'xlsx', fileName, headerRefs, rowsRef } = options
    const { Workbook } = await import('exceljs')
    const { saveAs } = await import('file-saver')

    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Sheet1')

    // Заглушка для стилей, если реф не передан
    const headerStyles = fields.map(() => ({
      font: { name: 'Arial', size: 12, bold: true },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFEEEEEE' },
      },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    }))

    const cellStyles: any[] = []

    // Применение стилей для заголовков, если переданы headerRefs
    if (headerRefs) {
      const headers = Array.isArray(headerRefs) ? headerRefs : headerRefs.value ?? []
      headers.forEach((el, i) => {
        if (el instanceof HTMLElement) {
          headerStyles[i] = getCellStyle(el)
        }
      })
    }

    // Применение стилей для строк, если переданы rowsRef
    const rowStyles: any[] = []
    if (rowsRef) {
      const rows = Array.isArray(rowsRef) ? rowsRef : rowsRef.value ?? []
      rows.forEach((row) => {
        row.forEach((el, i) => {
          if (el instanceof HTMLElement) {
            rowStyles[i] = getCellStyle(el)
          }
        })
      })
    }

    // Добавление заголовков
    worksheet.addRow(fields.map(field => field.label))

    // Применение стилей к заголовкам
    const headerRow = worksheet.getRow(1)
    headerRow.height = 20
    headerRow.eachCell((cell, colNumber) => {
      const style = headerStyles[colNumber - 1]
      if (style) {
        Object.assign(cell, style)
      }
    })

    // Добавление данных с применением стилей к ячейкам
    tableData.forEach((record, rowIndex) => {
      const row = fields.map(field => record[field.name]?.value ?? record[field.name] ?? null)
      const worksheetRow = worksheet.addRow(row)

      // Применение стилей для ячеек
      worksheetRow.eachCell((cell, colNumber) => {
        const style = rowStyles[colNumber - 1]
        if (style) {
          Object.assign(cell, style)
        }
      })
    })

    // Автоматическая ширина столбцов
    worksheet.columns.forEach(column => {
      let maxLength = 10
      column.eachCell({ includeEmpty: true }, cell => {
        const cellLength = cell.value ? cell.value.toString().length : 0
        if (cellLength > maxLength) {
          maxLength = cellLength
        }
      })
      column.width = maxLength + 2
    })

    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buffer]), `${fileName}.${format}`)
  }

  return { exportTable }
}

function rgbToHex(rgb: string): string {
  const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb)
  if (!result) return 'FFFFFFFF'
  return `FF${parseInt(result[1]).toString(16).padStart(2, '0')}${parseInt(result[2]).toString(16).padStart(2, '0')}${parseInt(result[3]).toString(16).padStart(2, '0')}`
}
