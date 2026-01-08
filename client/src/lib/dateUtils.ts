/**
 * Check if current date is before the discount deadline (until end of March 31, 2026)
 * @returns true if discount is available (until March 31, 2026 inclusive), false otherwise
 */
export function isDiscountAvailable(): boolean {
  // Create deadline date in Romania timezone (Europe/Bucharest)
  // Discount available until end of March 31, 2026 (expires on April 1, 2026 at 00:00)
  // On April 1, 2026, Romania is in EEST (UTC+3) since DST starts on March 29, 2026
  // Deadline: April 1, 2026 00:00:00 EEST = March 31, 2026 21:00:00 UTC
  const deadline = new Date('2026-04-01T00:00:00+03:00');

  // Get current date
  const now = new Date();

  // Return true if we're before April 1, meaning March 31 and earlier dates qualify
  return now < deadline;
}

/**
 * Get the discount percentage if available
 * @returns 0.1 (10%) if discount is available, 0 otherwise
 */
export function getDiscountRate(): number {
  return isDiscountAvailable() ? 0.1 : 0;
}
