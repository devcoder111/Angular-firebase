export function isEmailInWhiteList(email: string): boolean {
  const whitelist = [
    'michael@michaeldistel.com',
    'cherry.seniorqa@gmail.com',
    '2spy4x@gmail.com',
    '2urnix@gmail.com',
    'noorayemon@gmail.com',
    'groxotsasha@gmail.com',
    'w8it@mail.ru',
    'andrabasuki@gmail.com',
  ];
  if (whitelist.indexOf(email) < 0) {
    throw new Error(
      'Email ' + email + ' is not in the whitelist. Currently whitelisted emails:' + whitelist.join(', '),
    );
  }
  return true;
}

export function isPhoneInWhiteList(phoneNumber: string): boolean {
  const whitelist = ['+6597218638'];
  if (whitelist.indexOf(phoneNumber) < 0) {
    throw new Error(
      'Phone ' + phoneNumber + ' is not in whitelist. Currently whitelisted phones:' + whitelist.join(', '),
    );
  }
  return true;
}

export function isFaxInWhiteList(faxNumber: string): boolean {
  const whitelist = [];
  if (whitelist.indexOf(faxNumber) < 0) {
    throw new Error('Fax ' + faxNumber + ' is not in whitelist. Currently whitelisted faxes:' + whitelist.join(', '));
  }
  return true;
}
