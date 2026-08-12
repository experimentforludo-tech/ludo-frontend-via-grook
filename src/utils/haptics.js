export function triggerVibration(type = 'light') {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  if (type === 'light') navigator.vibrate(30);
  else if (type === 'heavy') navigator.vibrate([70, 40, 70]);
  else if (type === 'win') navigator.vibrate([100, 60, 100, 60, 200]);
}