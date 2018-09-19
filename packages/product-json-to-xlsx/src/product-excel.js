/* @flow */
import Excel from 'exceljs'

export default class ProductExcel {
  // Set flowtype annotations
  stream: stream$Writable
  excel: Object

  constructor(
    output: stream$Writable,
    worksheetName: string = 'Products'
  ): void {
    this.stream = output
    this.excel = ProductExcel.init(output, worksheetName)
  }

  static init(outputStream: stream$Writable, worksheetName: string): Object {
    const workbookOpts: Object = {
      stream: outputStream,
      useStyles: true,
      useSharedStrings: true,
    }

    const workbook: Object = new Excel.stream.xlsx.WorkbookWriter(workbookOpts)
    const worksheet: Object = workbook.addWorksheet(worksheetName)
    return { workbook, worksheet }
  }

  /**
   * Replace undefined and empty string with null values
   * @param row Array of values
   */
  static _cleanRow(row: Array<any>): Array<any> {
    return row.map(
      (item: any) => (typeof item === 'undefined' || item === '' ? null : item)
    )
  }

  writeHeader(header: Array<any>): void {
    // eslint-disable-next-line no-param-reassign
    this.excel.worksheet.columns = header.map(name => ({ header: name }))
  }

  writeRow(row: Array<any>): void {
    this.excel.worksheet.addRow(ProductExcel._cleanRow(row)).commit()
  }

  finish(): Object {
    return this.excel.workbook.commit()
  }
}
