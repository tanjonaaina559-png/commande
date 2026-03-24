import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export const generatePDF = (order) => {
  const doc = new jsPDF();

  // Header background
  doc.setFillColor(46, 125, 50);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('T-SHIRT BIZ', 105, 18, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('BON DE COMMANDE', 105, 30, { align: 'center' });

  // Client Info Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT :', 14, 52);
  doc.setFont('helvetica', 'normal');
  doc.text(order.client_name || 'Inconnu', 45, 52);

  const dateStr = order.date
    ? format(new Date(order.date), 'dd/MM/yyyy')
    : format(new Date(), 'dd/MM/yyyy');

  doc.setFont('helvetica', 'bold');
  doc.text('DATE :', 140, 52);
  doc.setFont('helvetica', 'normal');
  doc.text(dateStr, 162, 52);

  // T-shirt details
  const details = [
    ['Type', order.type_tshirt || ''],
    ['Couleur', order.couleur || ''],
    ['Motif Devant', order.motif_devant || 'N/A'],
    ['Motif Dos', order.motif_dos || 'N/A'],
  ];

  let y = 62;
  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label} :`, 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 60, y);
    y += 10;
  });

  // Items table
  const tableData = (order.items || []).map((item) => [
    item.taille,
    item.quantite,
    `${Number(item.prix).toLocaleString()} Ar`,
    `${(Number(item.quantite) * Number(item.prix)).toLocaleString()} Ar`,
  ]);

  autoTable(doc, {
    startY: y + 5,
    head: [['Taille', 'Quantité', 'Prix Unitaire', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [46, 125, 50], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [242, 249, 242] },
    styles: { halign: 'center' },
    columnStyles: { 0: { halign: 'left' }, 3: { halign: 'right' } },
  });

  // Totals
  const finalY = doc.lastAutoTable.finalY + 10;

  doc.setDrawColor(200, 200, 200);
  doc.line(100, finalY, 196, finalY);

  const addRow = (label, value, color) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    if (color) doc.setTextColor(...color);
    else doc.setTextColor(0);
    doc.text(label, 102, finalY + 10);
    doc.text(value, 196, finalY + 10, { align: 'right' });
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(0);
  doc.text('TOTAL :', 102, finalY + 10);
  doc.text(`${Number(order.total).toLocaleString()} Ar`, 196, finalY + 10, { align: 'right' });

  doc.setFontSize(11);
  doc.setTextColor(80);
  doc.text('Avance payée :', 102, finalY + 20);
  doc.text(`${Number(order.avance).toLocaleString()} Ar`, 196, finalY + 20, { align: 'right' });

  const reste = Number(order.reste);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(reste > 0 ? 200 : 46, reste > 0 ? 30 : 125, reste > 0 ? 30 : 50);
  doc.text('RESTE À PAYER :', 102, finalY + 32);
  doc.text(`${reste.toLocaleString()} Ar`, 196, finalY + 32, { align: 'right' });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text('Merci pour votre confiance ! — T-Shirt Biz', 105, 285, { align: 'center' });

  const fileName = `Recu_${(order.client_name || 'client').replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`;
  doc.save(fileName);
};
