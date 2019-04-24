console.log('----- Cold Start -----');

/** EXPORT ALL FUNCTIONS
 *
 *   Loads all `.f.js` files
 *   Exports a cloud function matching the file name
 *   Author: David King
 *   Edited: Tarik Huber, Anton Shubin
 *   Based on this thread:
 *     https://github.com/firebase/functions-samples/issues/170
 */
const glob = require('glob');
const camelCase = require('camelcase');
const files = glob.sync('./**/*.f.js', { cwd: __dirname, ignore: './node_modules/**' }); // returns functions files
for (const file of files) {
  const filePathJoinedWithUnderscore = file
    .slice(0, -5)
    .split('/')
    .join('_');
  const functionName = camelCase(filePathJoinedWithUnderscore); // Strip off '.f.js'
  const isFunctionsDeploy = !process.env.FUNCTION_NAME;
  const isFunctionRunning = process.env.FUNCTION_NAME === functionName;
  if (isFunctionsDeploy || isFunctionRunning) {
    exports[functionName] = require(file); // registers or runs the function
  }
}
