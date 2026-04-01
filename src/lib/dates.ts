export function formatDate(dateString: string): string {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];

  if (!dateString) return 'дата уточняется';

  const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const monthIndex = Number(isoMatch[2]) - 1;
    const day = Number(isoMatch[3]);
    if (monthIndex >= 0 && monthIndex < 12 && day >= 1 && day <= 31) {
      return `${day} ${months[monthIndex]} ${year}`;
    }
  }

  const ruMatch = dateString.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (ruMatch) {
    const day = Number(ruMatch[1]);
    const monthIndex = Number(ruMatch[2]) - 1;
    const year = Number(ruMatch[3]);
    if (monthIndex >= 0 && monthIndex < 12 && day >= 1 && day <= 31) {
      return `${day} ${months[monthIndex]} ${year}`;
    }
  }

  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return 'дата уточняется';
  return `${parsed.getDate()} ${months[parsed.getMonth()]} ${parsed.getFullYear()}`;
}
