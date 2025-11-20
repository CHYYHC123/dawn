export function getTime(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');

  return `${hh}:${mm}`;
}

export function getGreetingByTime() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return 'Good morning.';
  if (hour >= 12 && hour < 18) return 'Good afternoon.';
  if (hour >= 18 && hour < 22) return 'Good evening.';
  return 'Good night.';
}
