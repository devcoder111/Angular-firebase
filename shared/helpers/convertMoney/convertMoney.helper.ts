const ACCURACY = 10000;

/**
 * Converts money from
 * model value (as it should be stored in the database and for math calculations, in integer)
 * to
 * view value (as it should be displayed and edited by user, in float)
 * Examples: 53500 => 5.35, 12345 => 1.2345, 120006500 => 12000.65
 * @param {number} modelValue - integer
 * @returns {number} viewValue - float
 */
export function convertMoneyModelToView(modelValue: number): number {
  return modelValue / ACCURACY;
}

/**
 * Converts money from
 * view value (as it should be displayed and edited by user, in float)
 * to
 * model value (as it should be stored in the database and for math calculations, in integer)
 * Examples: 5.35 => 53500, 1.2345 => 12345, 12000.65 => 120006500
 * @param {number} viewValue - float
 * @returns {number} modelValue - integer
 */
export function convertMoneyViewToModel(viewValue: number): number {
  return Math.round(viewValue * ACCURACY);
}
