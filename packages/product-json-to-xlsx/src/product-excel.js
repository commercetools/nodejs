/* @flow */
import Excel from 'exceljs'

interface Stream {}
type WorkbookWriterOptions = {
  stream: Stream,
  filename: string,
  useSharedStrings: boolean,
  useStyles: boolean,
}
type WorkbookWriter = {
  constructor(options: $Shape<WorkbookWriterOptions>): WorkbookWriter,
  // commit all worksheets, then add suplimentary files
  commit(): Promise<void>,
  addStyles(): Promise<void>,
  addThemes(): Promise<void>,
  addOfficeRels(): Promise<void>,
  addContentTypes(): Promise<void>,
  addApp(): Promise<void>,
  addCore(): Promise<void>,
  addSharedStrings(): Promise<void>,
  addWorkbookRels(): Promise<void>,
  addWorkbook(): Promise<void>,
}
type Column = {
  header: string | string[],
  key: string,
  width: number,
  outlineLevel: number,
  hidden: boolean,
}
type Row = {
  height: number,
  commit(): void,
}
type Worksheet = {
  addRow(data: any[] | any): Row,
  columns: Array<$Shape<Column>>,
}
type ExcelConfig = {
  workbook: WorkbookWriter,
  worksheet: Worksheet,
}

export default class ProductExcel {
  // Set flowtype annotations
  stream: stream$Writable
  excel: ExcelConfig

  constructor(output: stream$Writable, worksheetName: string = 'Products') {
    this.stream = output
    this.excel = ProductExcel.init(output, worksheetName)
  }

  static init(
    outputStream: stream$Writable,
    worksheetName: string
  ): ExcelConfig {
    const workbookOpts: Object = {
      stream: outputStream,
      useStyles: true,
      useSharedStrings: true,
    }

    const workbook = new Excel.stream.xlsx.WorkbookWriter(workbookOpts)
    const worksheet = workbook.addWorksheet(worksheetName)
    return { workbook, worksheet }
  }

  /**
   * Replace undefined and empty string with null values
   * @param row Array of values
   */
  static _cleanRow(row: Array<any> | any): Array<any> {
    return row.map(item =>
      typeof item === 'undefined' || item === '' ? null : item
    )
  }

  writeHeader(header: Array<string> | string) {
    // eslint-disable-next-line no-param-reassign
    this.excel.worksheet.columns = Array.isArray(header)
      ? header.map(name => ({ header: name }))
      : [{ header }]
  }

  writeRow(row: Array<any>) {
    this.excel.worksheet.addRow(ProductExcel._cleanRow(row)).commit()
  }

  finish(): Promise<void> {
    return this.excel.workbook.commit()
  }
}
