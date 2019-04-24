## To drop your indexes:
 
1. Go to https://console.firebase.google.com/project/_/database/firestore/indexes
2. Open browser console and run:
```
interval = setInterval(() => {
  const indexMenuButton = $('.f7e-indexes-actions')[0];
  if (indexMenuButton) {
    indexMenuButton.click();
    const indexMenuDeleteButton = $('.mat-menu-item')[0];
    if (indexMenuDeleteButton) {
      indexMenuDeleteButton.click();
      const indexPopupDeleteButton = $('.delete-index-delete-button:last');
      if (indexMenuDeleteButton) {
        indexPopupDeleteButton.click();
      } else {
        console.error('No indexMenuDeleteButton:', $('.mat-menu-item'));
        clearInterval(interval);
      }
    } else {
      console.error('No indexMenuDeleteButton:', $('.mat-menu-item'));
      clearInterval(interval);
    }
  } else {
    clearInterval(interval);
  }
}, 2000);
```
In case of any error run again

## ‌To add new index:

1. Add it to `firebase/firestore/indexes/src.js`
2. run `node firebase/firestore/indexes/build.js` (it also will be built automatically by pre-commit hook)

## To deploy indexes run:

`yarn deploy --only firestore:indexes` (deploys only indexes)

or just 

`yarn deploy` (deploys everything)


