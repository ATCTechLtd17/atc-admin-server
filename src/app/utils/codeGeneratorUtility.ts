/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

export async function generateCode(
  model: mongoose.Model<any>,
  prefix: string,
  codeField: string = 'code', // Default to 'code', but allow flexibility
): Promise<string> {
  const lastRecord = await model
    .findOne({}, { [codeField]: 1 }) // Only select the code field for efficiency
    .sort({ [codeField]: -1 }) // Sort in descending order
    .exec();

  let newCode = `${prefix}-0001`; // Default if no previous records exist

  if (lastRecord?.[codeField]) {
    const lastCodePart = lastRecord[codeField].split('-')[1];
    const lastNumber = parseInt(lastCodePart, 10);

    if (!isNaN(lastNumber)) {
      newCode = `${prefix}-${String(lastNumber + 1).padStart(4, '0')}`; // Increment and format
    }
  }

  return newCode;
}
