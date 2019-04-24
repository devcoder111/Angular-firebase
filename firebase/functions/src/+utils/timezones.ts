const moment = require('moment-timezone');

export const localizedDateStr = (date: Date, timezone: string = 'Singapore') => {
  return (
    moment(date)
      .tz(timezone)
      .format('DD MMM YYYY [GMT]Z') + ` ${timezone}`
  );
};
