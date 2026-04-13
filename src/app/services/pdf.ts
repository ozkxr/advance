import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class Pdf {
  generate(data: any): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });

    const pageWidth = 215.9;
    const margin = 19;

    const L = margin;
    const R = pageWidth - margin;
    const CW = R - L;

    let y = 23;

    // -- header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('UNIVERSIDAD DE SAN CARLOS DE GUATEMALA', L, y);
    y += 5;
    doc.text('UNIDAD ACADÉMICA CENTRO UNIVERSITARIO DE ORIENTE', L, y);
    y += 21;
    doc.text('RELACIÓN LABORAL DEL AÑO', L, y);
    doc.text(`${data.year}`, L + 55, y);
    y += 10;

    // -- teacher info
    doc.text('NOMBRE DE PROFESOR / A:', L, y);
    doc.text(data.teacherName.toUpperCase(), L + 55, y);
    y += 10;
    doc.text('REGISTRO DE PERSONAL No.:', L, y);
    doc.text(data.registry, L + 55, y);
    y += 17;

    // -- table columns
    const colMes = 22;
    const colDe = 16;
    const colA = 16;
    const colPuesto = 30;
    const colCargo = 30;
    const colSiBox = 9;
    const colNoBox = 8;
    const colSiLbl = (CW - colMes - colDe - colA - colPuesto - colCargo - colSiBox - colNoBox) / 2;
    const colNoLbl = colSiLbl;

    const xMes = L;
    const xDe = xMes + colMes;
    const xA = xDe + colDe;
    const xPuesto = xA + colA;
    const xCargo = xPuesto + colPuesto;
    const xSiLbl = xCargo + colCargo;
    const xSiBox = xSiLbl + colSiLbl;
    const xNoLbl = xSiBox + colSiBox;
    const xNoBox = xNoLbl + colNoLbl;

    const rowH = 7;
    const headH1 = 7;
    const headH2 = 6;
    const headH = headH1 + headH2;

    // -- table header
    doc.setLineWidth(0.3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);

    doc.rect(L, y, CW, headH);

    const vline = (x: number) => doc.line(x, y, x, y + headH);
    vline(xDe);
    vline(xPuesto);
    vline(xCargo);
    vline(xSiLbl);
    doc.line(xA, y + headH1, xA, y + headH);
    doc.line(xSiBox, y + headH1, xSiBox, y + headH);
    doc.line(xNoLbl, y + headH1, xNoLbl, y + headH);
    doc.line(xNoBox, y + headH1, xNoBox, y + headH);
    doc.line(xDe, y + headH1, xA + colA, y + headH1);
    doc.line(xSiLbl, y + headH1, xNoBox + colNoBox, y + headH1);

    const cy1 = y + headH1 / 2 + 1.5;
    const cy2 = y + headH1 + headH2 / 2 + 1.5;
    const licenciaCenter = xSiLbl + (CW - colMes - colDe - colA - colPuesto - colCargo) / 2;

    doc.text('MES', xMes + colMes / 2, y + headH / 2 + 1.5, { align: 'center' });
    doc.text('DÍAS LABORADOS', xDe + (colDe + colA) / 2, cy1, { align: 'center' });
    doc.text('PUESTO', xPuesto + colPuesto / 2, y + headH / 2 + 1.5, { align: 'center' });
    doc.text('CARGO', xCargo + colCargo / 2, y + headH / 2 + 1.5, { align: 'center' });
    doc.text('GOZÓ DE LICENCIA', licenciaCenter, cy1, { align: 'center' });
    doc.text('DE', xDe + colDe / 2, cy2, { align: 'center' });
    doc.text('A', xA + colA / 2, cy2, { align: 'center' });
    doc.text('SÍ', xSiLbl + colSiLbl / 2, cy2, { align: 'center' });
    doc.text('NO', xNoLbl + colNoLbl / 2, cy2, { align: 'center' });
    doc.setFontSize(5);
    doc.text('ESPECIFICAR', xSiLbl + colSiLbl / 2, cy2 + 0.8, { align: 'center' });

    y += headH;

    // -- month rows
    const monthNames = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
    ];

    doc.rect(xSiLbl, y, CW - colMes - colDe - colA - colPuesto - colCargo, rowH * 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    for (let i = 0; i < 12; i++) {
      const ry = y + i * rowH;
      const cy = ry + rowH / 2 + 1.5;

      doc.rect(L, ry, colMes + colDe + colA + colPuesto + colCargo, rowH);
      doc.line(xDe, ry, xDe, ry + rowH);
      doc.line(xA, ry, xA, ry + rowH);
      doc.line(xPuesto, ry, xPuesto, ry + rowH);
      doc.line(xCargo, ry, xCargo, ry + rowH);

      doc.text(monthNames[i], xMes + 1.5, cy);

      if (data.months[i].startDay) doc.text(String(data.months[i].startDay), xDe + colDe / 2, cy, { align: 'center' });
      if (data.months[i].endDay) doc.text(String(data.months[i].endDay), xA + colA / 2, cy, { align: 'center' });
      if (data.months[i].position) doc.text(data.months[i].position, xPuesto + 1.5, cy);
      if (data.months[i].rolePerformed) doc.text(data.months[i].rolePerformed, xCargo + 1.5, cy);

      if (data.hasLeave) {
        doc.text('X', xSiBox + colSiBox / 2, cy, { align: 'center' });
      } else {
        doc.text('X', xNoBox + colNoBox / 2, cy, { align: 'center' });
      }
    }

    // -- leave notes
    if (data.hasLeave && data.leaveNotes) {
      doc.setFontSize(7);
      const lines = doc.splitTextToSize(data.leaveNotes, CW - colMes - colDe - colA - colPuesto - colCargo - 4);
      doc.text(lines, xSiLbl + 2, y + 5);
    }

    y += rowH * 12 + 15;

    // -- signatories
    const sigW = 60;
    const gap = (CW - sigW * 2) / 3;

    const x0 = L + gap;
    doc.line(x0, y, x0 + sigW, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('firma :', x0, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.text(data.signatories[0].fullName, x0 + sigW / 2, y + 10, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('Vo.Bo.: Tesorero', x0 + sigW / 2, y + 15, { align: 'center' });

    const x1 = L + gap * 2 + sigW;
    doc.line(x1, y, x1 + sigW, y);
    doc.setFont('helvetica', 'bold');
    doc.text(data.signatories[1].fullName, x1 + sigW / 2, y + 10, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('Director', x1 + sigW / 2, y + 15, { align: 'center' });

    // -- emission date
    y += 25;
    const today = new Date();
    const date = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    doc.text(`Fecha de emisión: ${date}`, R, y, { align: 'right' });

    if (data.registry && data.year) {
      doc.save(`${data.registry}-${data.year}.pdf`);
    } else {
      doc.save('relacion-laboral.pdf');
    }
  }
}
