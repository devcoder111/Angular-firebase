const modes = {
  A: 'ASCENDING',
  D: 'DESCENDING',
  AC: 'ARRAY_CONTAINS',
};
try {
  let src = require('./src');
  let fs = require('fs');
  let source = src.FIREBASE_INDEXES;
  let totalIndexes = 0;
  let totalIndexesPerCol = {};

  const indexes = Object.keys(source).reduce((acc, collectionId) => {
    return [
      ...acc,
      ...source[collectionId].map(colIndexes => {
        totalIndexes++;
        totalIndexesPerCol[collectionId] = (totalIndexesPerCol[collectionId] || 0) + 1;
        const fields = Object.entries(colIndexes).map(index => {
          const fieldName = index[0];
          const fieldOrder = index[1];
          return {
            fieldPath: fieldName,
            mode: modes[fieldOrder],
          };
        });
        return { collectionId, fields };
      }),
    ];
  }, []);

  fs.writeFileSync('firestore.indexes.json', JSON.stringify({ indexes }, null, 2));

  console.log(`
Indexes build completed successfully:
-------------------------------------
Total indexes: ${totalIndexes}
Per collection: ${JSON.stringify(totalIndexesPerCol, null, 2)}`);
} catch (error) {
  console.error(error);
  process.exit(1);
}
