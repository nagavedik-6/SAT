export const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDaysDifference = (deadlineStr) => {
  if (!deadlineStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = deadlineStr.split('-').map(Number);
  const target = new Date(year, month - 1, day);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

export const formatDisplayDate = (deadlineStr) => {
  if (!deadlineStr) return 'No date';
  try {
    const [year, month, day] = deadlineStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return deadlineStr;
  }
};

export const getUrgencyStatus = (deadlineStr, completed) => {
  if (completed) {
    return {
      type: 'completed',
      label: 'Completed',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.25)',
      isOverdue: false,
      isToday: false
    };
  }

  const diff = getDaysDifference(deadlineStr);

  if (diff < 0) {
    const days = Math.abs(diff);
    return {
      type: 'overdue',
      label: days === 1 ? 'Overdue by 1 day' : `Overdue by ${days} days`,
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.3)',
      isOverdue: true,
      isToday: false
    };
  }

  if (diff === 0) {
    return {
      type: 'today',
      label: 'Due Today',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.14)',
      border: 'rgba(245, 158, 11, 0.3)',
      isOverdue: false,
      isToday: true
    };
  }

  if (diff === 1) {
    return {
      type: 'tomorrow',
      label: 'Due Tomorrow',
      color: '#f97316',
      bg: 'rgba(249, 115, 22, 0.12)',
      border: 'rgba(249, 115, 22, 0.25)',
      isOverdue: false,
      isToday: false
    };
  }

  if (diff <= 3) {
    return {
      type: 'soon',
      label: `Due in ${diff} days`,
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.12)',
      border: 'rgba(59, 130, 246, 0.25)',
      isOverdue: false,
      isToday: false
    };
  }

  return {
    type: 'upcoming',
    label: `In ${diff} days`,
    color: '#6366f1',
    bg: 'rgba(99, 102, 241, 0.12)',
    border: 'rgba(99, 102, 241, 0.25)',
    isOverdue: false,
    isToday: false
  };
};
