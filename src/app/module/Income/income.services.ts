/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../Builder/QueryBuilder';
import AppError from '../../Error/AppError';
import { generateCode } from '../../utils/codeGeneratorUtility';
import { TIncome } from './income.interface';
import { Income } from './income.model';
import httpStatus from 'http-status';
// import PDFDocument from 'pdfkit';
// import { format } from 'date-fns';
// const generateMRIdFromUUID = () => {
//   const uuid = uuidv4();
//   const digits = uuid.replace(/\D/g, '').slice(0, 4);
//   return `MR-${digits}`;
// };

const addIncome = async (payload: TIncome) => {
  const id = await generateCode(Income, 'MR', 'id');

  const newIncome = await Income.create({
    ...payload,
    id,
  });

  return newIncome;
};

const getAllIncome = async (query: Record<string, unknown>) => {
  const { fromDate, toDate, division, paymentStatus, ...restQuery } = query;

  const filter: Record<string, unknown> = {};

  // Filter by date range
  if (fromDate || toDate) {
    (filter.date as any) = {};
    if (fromDate) {
      (filter.date as any).$gte = fromDate;
    }
    if (toDate) {
      (filter.date as any).$lte = toDate;
    }
  }

  // Filter by division
  if (division) {
    filter.division = division;
  }

  // Filter by paymentStatus
  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  const incomesQuery = new QueryBuilder(
    Income.find(filter).populate({
      path: 'subCategory',
      populate: {
        path: 'category',
        populate: 'department',
      },
    }),
    restQuery,
  )
    .search(['contact', 'email', 'id'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await incomesQuery.modelQuery;
  const meta = await incomesQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleIncome = async (id: string) => {
  const income = await Income.findById(id);
  if (!income) {
    throw new AppError(httpStatus.NOT_FOUND, 'Income not found');
  }
  return income;
};

const getIncomeByCustomId = async (customId: string) => {
  const income = await Income.findOne({ id: customId }).populate({
    path: 'subCategory',
    populate: {
      path: 'category',
      populate: 'department',
    },
  });
  if (!income) {
    throw new AppError(httpStatus.NOT_FOUND, 'Income not found');
  }
  return income;
};

// const generateIncomePdf = async (id: string) => {
//   const income = await Income.findOne({ id: id }).populate({
//     path: 'subCategory',
//     populate: {
//       path: 'category',
//       populate: 'department',
//     },
//   });

//   if (!income) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Income not found');
//   }

//   // Create a PDF document
//   const doc = new PDFDocument({ margin: 50, size: 'A4' });
//   const buffers: Buffer[] = [];

//   // Collect PDF data chunks
//   doc.on('data', (chunk: any) => buffers.push(chunk));

//   // Add company header
//   doc
//     .fontSize(24)
//     .font('Helvetica-Bold')
//     .text('ATC Tech Limited', { align: 'center' });
//   doc
//     .fontSize(12)
//     .font('Helvetica')
//     .text('Level-7, Block: Silicn Tower, 85 Tech Park, Rajshahi', {
//       align: 'center',
//     });
//   doc.text('atctechtd@gmail.com | +8801713366776', { align: 'center' });
//   doc.moveDown(1);

//   // Add receipt title
//   doc.fontSize(16).font('Helvetica-Bold');
//   const titleWidth = doc.widthOfString('MONEY RECEIPT');
//   const titleHeight = doc.currentLineHeight();
//   const pageWidth =
//     doc.page.width - doc.page.margins.left - doc.page.margins.right;
//   const titleX = doc.page.margins.left + (pageWidth - titleWidth) / 2;

//   // Draw box around title
//   doc.rect(titleX - 10, doc.y - 5, titleWidth + 20, titleHeight + 10).stroke();
//   doc.text('MONEY RECEIPT', titleX, doc.y);
//   doc.moveDown(2);

//   // Bill to section
//   doc.fontSize(12).font('Helvetica');
//   doc
//     .text('BILL TO:', { continued: true })
//     .font('Helvetica-Bold')
//     .text(` ${income.contact}`);
//   doc.font('Helvetica').text(income.email);
//   doc.text(income.address);
//   if (income.organization) {
//     doc.text(income.organization);
//   }
//   doc.moveDown(1);

//   // Receipt details
//   doc.font('Helvetica').text(`Receipt No.: ${income.id}`, { align: 'right' });
//   doc.text(`Date: ${format(new Date(income.date), 'dd/MM/yyyy')}`, {
//     align: 'right',
//   });
//   doc.text(`Division: ${income.division || '-'}`, { align: 'right' });
//   doc.moveDown(1);

//   // Services table
//   const tableTop = doc.y;
//   const tableHeaders = [
//     'SL',
//     'DESCRIPTION',
//     'QTY',
//     'UNIT PRICE (৳)',
//     'AMOUNT (৳)',
//   ];
//   const tableWidths = [40, 220, 60, 100, 100];
//   const tableX = doc.x;

//   // Draw table headers
//   doc.font('Helvetica-Bold').fontSize(10);
//   let currentX = tableX;

//   tableHeaders.forEach((header, i) => {
//     doc.rect(currentX, tableTop, tableWidths[i], 20).stroke();
//     doc.text(header, currentX + 5, tableTop + 5, {
//       width: tableWidths[i] - 10,
//     });
//     currentX += tableWidths[i];
//   });

//   // Draw table rows
//   doc.font('Helvetica').fontSize(10);
//   let rowY = tableTop + 20;

//   income.services?.forEach((service, index) => {
//     currentX = tableX;

//     // Draw row cells
//     doc.rect(currentX, rowY, tableWidths[0], 20).stroke();
//     doc.text(`${index + 1}`, currentX + 5, rowY + 5, {
//       width: tableWidths[0] - 10,
//     });
//     currentX += tableWidths[0];

//     doc.rect(currentX, rowY, tableWidths[1], 20).stroke();
//     doc.text(service.serviceName, currentX + 5, rowY + 5, {
//       width: tableWidths[1] - 10,
//     });
//     currentX += tableWidths[1];

//     doc.rect(currentX, rowY, tableWidths[2], 20).stroke();
//     doc.text('1', currentX + 5, rowY + 5, {
//       width: tableWidths[2] - 10,
//       align: 'center',
//     });
//     currentX += tableWidths[2];

//     doc.rect(currentX, rowY, tableWidths[3], 20).stroke();
//     doc.text(service.price.toFixed(2), currentX + 5, rowY + 5, {
//       width: tableWidths[3] - 10,
//       align: 'center',
//     });
//     currentX += tableWidths[3];

//     doc.rect(currentX, rowY, tableWidths[4], 20).stroke();
//     doc.text(service.price.toFixed(2), currentX + 5, rowY + 5, {
//       width: tableWidths[4] - 10,
//       align: 'right',
//     });

//     rowY += 20;
//   });

//   doc.moveDown(1);

//   // Totals section
//   const totalsX = tableX + tableWidths[0] + tableWidths[1] + tableWidths[2];
//   const totalsWidth = tableWidths[3] + tableWidths[4];
//   let totalsY = rowY + 20;

//   // Helper function for total rows
//   function addTotalRow(label: string, value: string, isBold = false) {
//     if (isBold) {
//       doc.font('Helvetica-Bold');
//     } else {
//       doc.font('Helvetica');
//     }

//     doc.text(label, totalsX, totalsY, { width: totalsWidth / 2 });
//     doc.text(value, totalsX + totalsWidth / 2, totalsY, {
//       width: totalsWidth / 2,
//       align: 'right',
//     });
//     totalsY += 20;
//   }

//   addTotalRow('Subtotal:', `৳ ${income.subTotal.toFixed(2)}`);
//   addTotalRow(
//     `TAX (${income.tax}%):`,
//     `৳ ${((income.subTotal * income.tax) / 100).toFixed(2)}`,
//   );
//   addTotalRow(
//     `VAT (${income.vat}%):`,
//     `৳ ${((income.subTotal * income.vat) / 100).toFixed(2)}`,
//   );
//   addTotalRow('Gross Total:', `৳ ${income.grossTotal.toFixed(2)}`, true);
//   addTotalRow(
//     `Discount (${income.discount}%):`,
//     `৳ ${((income.subTotal * income.discount) / 100).toFixed(2)}`,
//   );
//   addTotalRow('Payable Amount:', `৳ ${income.payableAmount.toFixed(2)}`, true);
//   addTotalRow('Deposit Amount:', `৳ ${income.depositAmount.toFixed(2)}`);
//   addTotalRow('Due Amount:', `৳ ${income.dueAmount.toFixed(2)}`, true);

//   doc.moveDown(2);

//   // Terms and signature
//   doc
//     .fontSize(10)
//     .font('Helvetica-Bold')
//     .text('Terms & Conditions', { continued: false });
//   doc.font('Helvetica').fontSize(9);
//   doc.text('• Payment is due within 30 days');
//   doc.text('• Please include receipt number with your payment');
//   doc.text('• All prices are in Bangladeshi Taka (৳)');

//   doc
//     .fontSize(10)
//     .font('Helvetica-Bold')
//     .text('Authorized Signature', { align: 'right' });
//   doc
//     .font('Helvetica')
//     .fontSize(9)
//     .text('ATC Tech Limited', { align: 'right' });

//   doc.moveDown(2);

//   // Footer
//   doc
//     .fontSize(8)
//     .font('Helvetica-Oblique')
//     .text(
//       'Disclaimer: This is a system-generated electronic receipt. Please retain this receipt for your records.',
//       { align: 'center' },
//     );
//   doc.text('Thank you for your business!', { align: 'center' });

//   // Finalize the PDF
//   doc.end();

//   // Return the combined buffer
//   return Buffer.concat(buffers);
// };

const updateIncome = async (id: string, payload: Partial<TIncome>) => {
  const existingIncome = await Income.findById(id);
  if (!existingIncome) {
    throw new AppError(httpStatus.NOT_FOUND, 'Income not found');
  }

  // const currentDueAmount =
  //   payload.dueAmount !== undefined
  //     ? payload.dueAmount
  //     : existingIncome.dueAmount;

  // if (
  //   currentDueAmount > 0 &&
  //   payload.depositAmount &&
  //   payload.depositAmount > currentDueAmount
  // ) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     'Deposit amount cannot be greater than due amount',
  //   );
  // }

  const updatedIncome = await Income.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedIncome;
};

const deleteIncome = async (id: string) => {
  const deleted = await Income.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Income not found');
  }
  return deleted;
};

export const IncomeServices = {
  addIncome,
  getAllIncome,
  getSingleIncome,
  getIncomeByCustomId,
  updateIncome,
  deleteIncome,
  // generateIncomePdf,
};
