export const InvoiceStatuses = {
  draft: {
    title: 'Draft',
    slug: 'draft',
  },
  actionNeeded: {
    title: 'Action Needed',
    slug: 'actionNeeded',
  },
  processing: {
    title: 'Processing',
    slug: 'processing',
  },
  done: {
    title: 'Done',
    slug: 'done',
  },
};
export const InvoiceStatusesArray = Object.keys(InvoiceStatuses).map(slug => InvoiceStatuses[slug]);
