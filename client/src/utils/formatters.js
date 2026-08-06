export const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatOccupancyBadgeColor = (occupancy, capacity) => {
  const percent = (occupancy / capacity) * 100;
  if (percent >= 85) return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  if (percent >= 50) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
};
