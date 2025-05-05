import { Workbook } from 'exceljs'

export async function useExcelImport(file: File): Promise<Record<string, any>[]> {
  const buffer = await file.arrayBuffer()
  const workbook = new Workbook()
  await workbook.xlsx.load(buffer)

  const worksheet = workbook.worksheets[0]
  const headerRow = worksheet.getRow(1).values as string[]
  const rows = worksheet.getSheetValues().slice(2)

  const data = rows
    .map((row: any) => {
      const obj: Record<string, any> = {}
      headerRow.forEach((key: string, i: number) => {
        if (key && row[i] != null) {
          obj[key] = typeof row[i] === 'string' ? row[i].trim() : row[i]
        }
      })
      return obj
    })
    .filter(obj => Object.keys(obj).length > 0)

  return data
}
