export const NotificationStatuses = {
  notSent: {
    title: 'Not sent',
    slug: 'notSent',
  },
  sent: {
    title: 'Sent',
    slug: 'sent',
  },
};
export const NotificationStatusesArray = Object.keys(NotificationStatuses).map(slug => NotificationStatuses[slug]);
