/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor() {
  }

  static toExportFileName(name): string {
    return `Reporte_${name}_${new Date().getTime()}.xlsx`;
  }

  public exportAsExcelFile(json: any[], name): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, DataService.toExportFileName(name));
  }
}
