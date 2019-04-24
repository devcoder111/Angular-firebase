try {
  const fs = require('fs');
  const glob = require('glob');

  const baseRules = 'src/base.rules';
  const resultRulesPath = 'firestore.rules';
  const placeholder = '#PLACEHOLDER#';
  const base = fs.readFileSync(baseRules, 'utf8');

  const filenames = (glob.sync('src/**/*.rules') || []).filter(filePath => filePath !== baseRules);
  const contentToInject = filenames.reduce((acc, cur) => acc + fs.readFileSync(cur, 'utf8'), '');
  fs.writeFileSync(resultRulesPath, base.replace(placeholder, contentToInject));

  console.log(`Rules were built successfully`);
} catch (error) {
  console.error(error);
  process.exit(1);
}
