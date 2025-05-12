import type { Cell } from 'exceljs'

export function formatCellValue(value: any, type: 'string' | 'number' | 'date') {
  switch (type) {
    case 'number':
      return typeof value === 'number' ? value : Number(value)
    case 'date':
      return value instanceof Date ? value : new Date(value)
    case 'string':
    default:
      return value != null ? String(value) : ''
  }
}

export function applyNumberFormat(cell: Cell, type: 'string' | 'number' | 'date') {
  switch (type) {
    case 'number':
      cell.numFmt = '0.00'
      break
    case 'date':
      cell.numFmt = 'yyyy-mm-dd'
      break
    case 'string':
      cell.numFmt = '@'
      break
  }
}
