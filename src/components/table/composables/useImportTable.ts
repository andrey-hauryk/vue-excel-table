import { Workbook } from 'exceljs'
import type { ColumnProps } from '../types/column'


export function useExcelImport() {
  const importDataFromExcel = async (file: File): Promise<Record<string, any>[]> => {
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

  const importExcel = async (file: File, table: any[], fields: ColumnProps[]) => {
    const keyStart = String(Date.now() % 1e8);
    const importData = await importDataFromExcel(file);

    if (!importData.length) {
      throw new Error('VueExcelEditor: ' + 'data empty')
    }

    const requiredKeys = fields.filter(f => f.keyField)
    const isMissingKey = requiredKeys.some(f =>
      typeof importData[0][f.name] === 'undefined' &&
      typeof importData[0][f.label] === 'undefined'
    )

    if (isMissingKey) {
      throw new Error(`VueExcelEditor: missginKeyColumn`)
    }


  }
}

// importTable(file) {
//   this.localLoading = true
//   this.clearAllSelected()

//   const keyStart = String(Date.now() % 1e8)

//   const process = async () => {
//     try {
//       const importData = await useExcelImport(file)

//       if (!importData.length) {
//         this.importErrorCallback?.('noRecordIsRead')
//         throw new Error('VueExcelEditor: ' + this.localizedLabel.noRecordIsRead)
//       }

//       const requiredKeys = this.fields.filter(f => f.keyField)
//       const isMissingKey = requiredKeys.some(f =>
//         typeof importData[0][f.name] === 'undefined' && typeof importData[0][f.label] === 'undefined'
//       )

//       if (isMissingKey) {
//         this.importErrorCallback?.('missingKeyColumn')
//         throw new Error(`VueExcelEditor: ${this.localizedLabel.missingKeyColumn}`)
//       }

//       let pass = 0
//       let inserted = 0
//       let updated = 0

//       while (pass < 2) {
//         const keys = this.fields.filter(f => f.keyField)
//         const uniqueKeys = []

//         for (let i = 0; i < importData.length; i++) {
//           const line = importData[i]
//           let rowPos = -1

//           if (keys.length) {
//             rowPos = this.table.findIndex(v =>
//               keys.every(f => {
//                 const fieldValue = v[f.name]?.value
//                 return fieldValue === line[f.name] || fieldValue === line[f.label]
//               })
//             )

//             if (rowPos === -1) {
//               const lineKey = keys.map(k => line[k.name] || line[k.label]).join(':')
//               if (lineKey && uniqueKeys.includes(lineKey)) continue
//               uniqueKeys.push(lineKey)
//             }
//           }

//           if (rowPos === -1) {
//             rowPos = this.table.findIndex(v =>
//               Object.keys(v).filter(f => !f.startsWith('$')).length === 0
//             )
//           }

//           const rec = {
//             id: line.id ?? `${keyStart}-${('000000' + i).slice(-7)}`
//           }

//           for (const field of this.fields) {
//             if (field.name.startsWith('$')) continue
//             let val = line[field.name] ?? line[field.label] ?? null

//             if (field.readonly) {
//               this.importErrorCallback?.('readonlyColumnDetected', i + 1)
//               throw new Error(`VueExcelEditor: [row=${i + 1}] ${this.localizedLabel.readonlyColumnDetected}: ${field.name}`)
//             }

//             if (field.validate) {
//               const err = field.validate(val, rec[field.name]?.value, rec, field)
//               if (err) {
//                 this.importErrorCallback?.('columnHasValidationError', i + 1, val)
//                 throw new Error(`VueExcelEditor: [row=${i + 1}, val=${val}] ${this.localizedLabel.columnHasValidationError(field.name, err)}`)
//               }
//             }

//             if (this.validate) {
//               const err = this.validate(val, rec[field.name]?.value, rec, field)
//               if (err) {
//                 this.importErrorCallback?.('rowHasValidationError', i + 1, val)
//                 throw new Error(`VueExcelEditor: [row=${i + 1}, val=${val}] ${this.localizedLabel.rowHasValidationError(i + 1, field.name, err)}`)
//               }
//             }

//             if (val !== null) {
//               rec[field.name] = { value: val, anomaly: false, isSelected: false }
//             } else if (field.mandatory) {
//               this.importErrorCallback?.(field.mandatory, i + 1, val)
//               throw new Error(`VueExcelEditor: [row=${i + 1}, val=${val}] ${field.mandatory}`)
//             }
//           }

//           if (pass === 1) {
//             if (rowPos >= 0) {
//               updated++
//               Object.keys(rec).forEach(name => {
//                 if (!name.startsWith('$')) {
//                   this.updateCell(rowPos, name, rec[name].value)
//                 }
//               })
//               this.selected[rowPos] = this.table[rowPos].id
//             } else {
//               const newRec = {}
//               Object.keys(rec).forEach(name => {
//                 if (name.startsWith('$')) {
//                   newRec[name] = rec[name]
//                 } else {
//                   newRec[name] = {
//                     value: rec[name].value,
//                     anomaly: false,
//                     isSelected: false
//                   }
//                 }
//               })
//               this.newRecord(newRec, true)
//               inserted++
//             }
//           }
//         }

//         pass++
//       }

//       if (pass === 2 && this.importCallback) {
//         this.importCallback({
//           inserted,
//           updated,
//           recordAffected: inserted + updated
//         })
//       }

//     } catch (err) {
//       this.importErrorCallback?.(err.message)
//       throw new Error('VueExcelEditor: ' + err.stack)
//     } finally {
//       this.localLoading = false
//     }
//   }

//   process()
// },

// doImport(e) {
//       this.localLoading = true
//       // this.refresh()
//       this.clearAllSelected()
//       setTimeout(() => {
//         const files = e.target.files
//         if (!files || files.length === 0) return
//         const file = files[0]

//         const fileReader = new FileReader()
//         fileReader.onload = async (e) => {
//           try {
//             const data = e.target.result
//             const wb = read(data, { type: 'binary', cellDates: true, cellStyle: false })
//             const sheet = wb.SheetNames[0]
//             let importData = utils.sheet_to_row_object_array(wb.Sheets[sheet])
//             importData = importData.filter(rec => Object.keys(rec).length > 0).map((rec) => {
//               if (rec.key_1) {
//                 rec.key = rec.key_1  // Fixed the XLSX issue where key is set to be reserved word
//                 delete rec.key_1
//               }
//               Object.keys(rec).forEach(k => {
//                 if (typeof rec[k] === 'string') rec[k] = rec[k].replace(/[ \r\n\t]+$/g, '')
//               })
//               return rec
//             })
//             const keyStart = String(new Date().getTime() % 1e8)
//             if (importData.length === 0) {
//               if (this.importErrorCallback) this.importErrorCallback('noRecordIsRead')
//               throw new Error('VueExcelEditor: ' + this.localizedLabel.noRecordIsRead)
//             }
//             if (this.fields
//               .filter(f => f.keyField)
//               .filter(f => typeof importData[0][f.name] === 'undefined' && typeof importData[0][f.label] === 'undefined').length > 0) {
//               if (this.importErrorCallback) this.importErrorCallback('missingKeyColumn')
//               throw new Error(`VueExcelEditor: ${this.localizedLabel.missingKeyColumn}`)
//             }

//             let pass = 0
//             let inserted = 0
//             let updated = 0
//             while (pass < 2) {
//               const keys = this.fields.filter(f => f.keyField)
//               let uniqueKeys = []
//               await Promise.all(importData.map(async (line, i) => {
//                 let rowPos = -1
//                 if (keys.length) {
//                   // locate match record
//                   rowPos = this.table.findIndex(v =>
//                     keys.filter(f =>
//                       typeof v[f.name].value !== 'undefined'
//                       && (v[f.name].value === line[f.name] || v[f.name].value === line[f.label])).length === keys.length
//                   )
//                   if (rowPos === -1) {
//                     // If this is a new line, avoid the line with duplicate key
//                     const linekey = keys.map(k => line[k.name] || line[k.label]).join(':')
//                     if (linekey) {
//                       if (uniqueKeys.includes(linekey)) return
//                       uniqueKeys.push(linekey)
//                     }
//                   }
//                 }

//                 // if no match found, find an empty record
//                 if (rowPos === -1)
//                   rowPos = this.table.findIndex(v => Object.keys(v).filter(f => !f.startsWith('$')).length === 0)

//                 const rec = {
//                   id: typeof line.id === 'undefined' ? keyStart + '-' + ('000000' + i).slice(-7) : line.id
//                 }

//                 // Raise exception if readonly not not pass validation
//                 await Promise.all(this.fields.map(async (field) => {
//                   if (field.name.startsWith('$')) return
//                   let val = line[field.name]
//                   if (typeof val === 'undefined') val = line[field.label]
//                   if (typeof val === 'undefined') val = null
//                   else {
//                     if (field.readonly) {
//                       if (this.importErrorCallback) this.importErrorCallback('readonlyColumnDetected', i + 1)
//                       throw new Error(`VueExcelEditor: [row=${i + 1}] ` + this.localizedLabel.readonlyColumnDetected + ': ' + field.name)
//                     }
//                     if (field.validate) {
//                       let err
//                       if ((err = field.validate(val, rec[field.name]?.value, rec, field))) {
//                         if (this.importErrorCallback) this.importErrorCallback('columnHasValidationError', i + 1, val)
//                         throw new Error(`VueExcelEditor: [row=${i + 1}, val=${val}] ` + this.localizedLabel.columnHasValidationError(field.name, err))
//                       }
//                     }
//                     if (this.validate) {
//                       let err
//                       if ((err = this.validate(val, rec[field.name]?.value, rec, field))) {
//                         if (this.importErrorCallback) this.importErrorCallback('rowHasValidationError', i + 1, val)
//                         throw new Error(`VueExcelEditor: [row=${i + 1}, val=${val}] ` + this.localizedLabel.rowHasValidationError(i + 1, field.name, err))
//                       }
//                     }
//                   }
//                   if (val !== null) rec[field.name] = { value: val, anomaly: false, isSelected: false } //сомнительно но окей
//                   else if (field.mandatory) {
//                     if (this.importErrorCallback) this.importErrorCallback(field.mandatory, i + 1, val)
//                     throw new Error(`VueExcelEdutor: [row=${i + 1}, val=${val}] ` + field.mandatory)
//                   }
//                 }))

//                 // Do actual insert/update if 2nd pass
//                 if (pass === 1) {
//                   if (rowPos >= 0) {
//                     updated++
//                     Object.keys(rec).forEach(name => {
//                       if (name.startsWith('$')) return
//                       this.updateCell(rowPos, name, rec[name].value)
//                     })
//                     this.selected[rowPos] = this.table[rowPos].id
//                   }
//                   else {
//                     const newRec = {}
//                     Object.keys(rec).forEach(name => {
//                       if (name.startsWith('$')) {
//                         newRec[name] = rec[name]
//                       }
//                       else {
//                         newRec[name] = { value: rec[name].value, anomaly: false, isSelected: false }
//                       }
//                     })
//                     this.newRecord(newRec, true)
//                     inserted++
//                   }
//                 }
//               }))
//               pass++
//             }
//             if (pass === 2 && this.importCallback) {
//               this.importCallback({
//                 inserted: inserted,
//                 updated: updated,
//                 recordAffected: inserted + updated
//               })
//             }
//           }
//           catch (e) {
//             if (this.importErrorCallback) this.importErrorCallback(e.message)
//             throw new Error('VueExcelEditor: ' + e.stack)
//           }
//           finally {
//             this.localLoading = false
//             this.$refs.importFile.modelValue = ''
//           }
//         }
//         fileReader.onerror = (e) => {
//           this.localLoading = false
//           this.$refs.importFile.modelValue = ''
//           if (this.importErrorCallback) this.importErrorCallback(e.message)
//           throw new Error('VueExcelEditor: ' + e.stack)
//         }
//         fileReader.readAsBinaryString(file)
//       }, 500)
//     },