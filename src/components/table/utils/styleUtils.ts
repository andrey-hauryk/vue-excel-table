import type ExcelJS from 'exceljs'
import type { Ref } from 'vue'
import type {ExportField} from '../types/export';


/**
 * Returns the underlying HTMLElement from either a direct element or a Vue Ref.
 * @param editor - HTMLElement or Ref pointing to the table root.
 */
function getEditorElement(editor: HTMLElement | Ref<HTMLElement>): HTMLElement | null {
  return editor instanceof HTMLElement ? editor : editor?.value ?? null
}

/**
 * Converts an RGB string (e.g., "rgb(255, 255, 255)") to an ARGB hex string (e.g., "FFFFFFFF").
 * @param rgb - CSS rgb() color string.
 */
function rgbToHex(rgb: string): string {
  const match = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb)
  if (!match) return 'FFFFFFFF'
  return `FF${(+match[1]).toString(16).padStart(2, '0')}${(+match[2]).toString(16).padStart(2, '0')}${(+match[3]).toString(16).padStart(2, '0')}`
}

/**
 * Returns the default style applied to all header cells by default.
 */
function getDefaultHeaderStyle(): Partial<ExcelJS.Cell> {
  return {
    font: { name: 'Arial', size: 12, bold: true },
    alignment: { horizontal: 'center', vertical: 'middle' },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEEEEEE' },
      bgColor: { argb: 'FFFFFFFF' },
    },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    },
  }
}

/**
 * Generates an ExcelJS cell style object based on the computed style of a DOM element.
 * @param el - The HTMLElement from which to extract styles.
 */
export function getCellStyle(el: HTMLElement): Partial<ExcelJS.Cell> {
  const style = window.getComputedStyle(el)
  const fontColor = rgbToHex(style.color)
  const bgColor = rgbToHex(style.backgroundColor)

  return {
    font: {
      name: style.fontFamily,
      size: parseInt(style.fontSize),
      bold: style.fontWeight === 'bold' || parseInt(style.fontWeight) >= 600,
      italic: style.fontStyle === 'italic',
      underline: style.textDecoration.includes('underline'),
      strike: style.textDecoration.includes('line-through'),
      color: { argb: fontColor },
    },
    alignment: {
      horizontal: style.textAlign as ExcelJS.Alignment['horizontal'],
      vertical: style.verticalAlign as ExcelJS.Alignment['vertical'],
      wrapText: style.whiteSpace === 'normal' || style.wordBreak === 'break-word',
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: bgColor },
      bgColor: { argb: 'FFFFFFFF' },
    },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    },
  }
}

/**
 * Returns an array of styles for each header cell in the table.
 * Skips the first column (e.g., row selector or checkbox).
 * @param editor - The table container element or Vue Ref to it.
 * @param count - The number of columns (excluding skipped).
 */
export function getHeaderStyles(editor: HTMLElement | Ref<HTMLElement>, count: number): Partial<ExcelJS.Cell>[] {
  const styles = Array.from({ length: count }, getDefaultHeaderStyle)
  const el = getEditorElement(editor)
  if (!el) return styles

  const headerCells = Array.from(el.querySelectorAll('thead th')).slice(1)
  headerCells.forEach((cell, index) => {
    if (cell instanceof HTMLElement) {
      styles[index] = getCellStyle(cell)
    }
  })

  return styles
}

/**
 * Returns a 2D array of styles for each cell in the table body (row-wise).
 * Skips the first column in each row.
 * @param editor - The table container element or Vue Ref to it.
 */
export function getRowStyles(editor: HTMLElement | Ref<HTMLElement>): Partial<ExcelJS.Cell>[][] {
  const result: Partial<ExcelJS.Cell>[][] = []
  const el = getEditorElement(editor)
  if (!el) return result

  const rows = Array.from(el.querySelectorAll('tbody tr'))
  rows.forEach((rowEl, rowIdx) => {
    const cells = Array.from(rowEl.querySelectorAll('td')).slice(1)
    result[rowIdx] = cells.map(cell =>
      cell instanceof HTMLElement ? getCellStyle(cell) : {}
    )
  })

  return result
}

/**
 * Extracts the row heights from the table.
 * @param editor - The table container element or Vue Ref to it.
 * @returns - An array of row heights.
 */
export function getRowHeights(editor: HTMLElement | Ref<HTMLElement>): number[] {
  const heights: number[] = []
  const el = getEditorElement(editor)
  if (!el) return heights

  const rows = Array.from(el.querySelectorAll('tbody tr'))
  rows.forEach(row => {
    if (row instanceof HTMLElement) {
      heights.push(row.offsetHeight)
    }
  })

  return heights
}

/**
 * Extracts the column widths from the table.
 * @param editor - The table container element or Vue Ref to it.
 * @returns - An array of column widths.
 */
export function getColumnWidths(editor: HTMLElement | Ref<HTMLElement>): number[] {
  const widths: number[] = []
  const el = getEditorElement(editor)
  if (!el) return widths

  const headerCells = Array.from(el.querySelectorAll('thead th')).slice(1)
  headerCells.forEach(cell => {
    if (cell instanceof HTMLElement) {
      widths.push(cell.offsetWidth)
    }
  })

  return widths
}

/**
 * Extracts the height of the table header row.
 * @param editor - The table container element or Vue Ref to it.
 * @returns - The height of the header row.
 */
export function getHeaderHeight(editor: HTMLElement | Ref<HTMLElement>): number {
  const el = getEditorElement(editor)
  if (!el) return 0

  const headerRow = el.querySelector('thead')
  if (headerRow instanceof HTMLElement) {
    return headerRow.offsetHeight
  }

  return 0
}

/**
 * Automatically calculates the width of each column based on its content.
 * @param tableData - The table data to be exported.
 * @param fields - The fields to be included in the export.
 * @returns - An array of column widths.
 */
export function calculateColumnWidths(tableData: any[], fields: ExportField[]): number[] {
  const widths: number[] = []

  fields.forEach((field, colIdx) => {
    let maxLength = field.label.length

    tableData.forEach(record => {
      const cellValue = record[field.name]?.value ?? record[field.name]
      const strValue = String(cellValue)
      maxLength = Math.max(maxLength, strValue.length)
    })

    widths.push(maxLength)
  })

  return widths
}

/**
 * Automatically calculates the height of each row based on its content.
 * @param tableData - The table data to be exported.
 * @param fields - The fields to be included in the export.
 * @returns - An array of row heights.
 */
export function calculateRowHeights(tableData: any[], fields: ExportField[]): number[] {
  const heights: number[] = []

  tableData.forEach(record => {
    let maxHeight = 0

    fields.forEach(field => {
      const cellValue = record[field.name]?.value ?? record[field.name]
      const strValue = String(cellValue)

      // Calculate the height based on the number of lines of text (approx. 15 characters per line)
      const lines = Math.ceil(strValue.length / 15)
      maxHeight = Math.max(maxHeight, lines)
    })

    heights.push(maxHeight)
  })

  return heights
}
