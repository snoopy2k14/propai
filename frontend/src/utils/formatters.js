export const formatPrice = (price, type) => {
  if (!price) return 'POA';
  const f = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(price);
  return type === 'RENT' ? `${f} pcm` : f;
};

export const formatPriceShort = (price) => {
  if (!price) return 'POA';
  if (price >= 1000000) return `£${(price/1000000).toFixed(1)}m`;
  if (price >= 1000)    return `£${(price/1000).toFixed(0)}k`;
  return `£${price}`;
};

export const formatDate = (d) => d ? new Intl.DateTimeFormat('en-GB', { day:'numeric', month:'short', year:'numeric' }).format(new Date(d)) : '';

export const formatRelativeDate = (d) => {
  if (!d) return '';
  const days = Math.floor((new Date() - new Date(d)) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7)  return `${days} days ago`;
  if (days < 30) return `${Math.floor(days/7)} weeks ago`;
  return formatDate(d);
};
