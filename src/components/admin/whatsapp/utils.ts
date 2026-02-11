export const getStatusConfig = (status: string) => {
  const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: string, label: string }> = {
    pending: { variant: 'secondary', icon: 'Clock', label: 'В очереди' },
    sent: { variant: 'default', icon: 'CheckCircle2', label: 'Отправлено' },
    failed: { variant: 'destructive', icon: 'XCircle', label: 'Ошибка' }
  };

  return config[status] || { variant: 'outline' as const, icon: 'HelpCircle', label: status };
};

export const formatDate = (dateString: string) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getCourseInfo = (course: string | null) => {
  const courses: Record<string, { emoji: string, name: string, color: string, borderColor: string }> = {
    acting: { emoji: '🎭', name: 'Актёрское мастерство', color: 'bg-purple-100 text-purple-700', borderColor: '#9333ea' },
    oratory: { emoji: '🎤', name: 'Ораторское искусство', color: 'bg-blue-100 text-blue-700', borderColor: '#3b82f6' }
  };
  return courses[course || ''] || { emoji: '📚', name: 'Общее', color: 'bg-gray-100 text-gray-700', borderColor: '#6b7280' };
};