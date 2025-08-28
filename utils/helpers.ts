/**
 * Utility functions for common operations
 */

/**
 * Extracts the first name from a full name
 * @param fullName - The full name (e.g., "James Smith")
 * @returns The first name only (e.g., "James")
 */
export const getFirstName = (fullName: string | null | undefined): string => {
  if (!fullName || typeof fullName !== 'string') {
    return 'User';
  }
  
  // Split by space and take the first part
  const firstName = fullName.trim().split(' ')[0];
  return firstName || 'User';
};

/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number | string | null | undefined): string => {
  const numAmount = parseFloat(String(amount || '0')) || 0;
  return `$${numAmount.toFixed(2)}`;
};
