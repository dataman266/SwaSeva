/**
 * Haptic micro-feedback utility.
 * Uses navigator.vibrate (supported in Android WebView / Capacitor).
 * Silent no-op on iOS Safari (vibrate is not supported there).
 */
export const haptic = {
  /** Light confirmation — save, like, select */
  light: () => navigator.vibrate?.(8),

  /** Medium emphasis — delete, cancel, warning */
  medium: () => navigator.vibrate?.(20),

  /** Success pattern — publish, order confirmed */
  success: () => navigator.vibrate?.([10, 30, 10]),

  /** Error pattern — failed action, validation */
  error: () => navigator.vibrate?.([30, 20, 30]),
};
