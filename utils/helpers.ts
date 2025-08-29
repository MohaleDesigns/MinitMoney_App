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

/**
 * Calculates transaction statistics for a user
 * @param transactions - Array of transactions
 * @param userId - The current user's ID
 * @returns Object with transaction statistics
 */
export const calculateTransactionStats = (transactions: any[], userId: string) => {
  if (!transactions || !Array.isArray(transactions)) {
    return {
      totalTransactions: 0,
      totalSent: 0,
      totalReceived: 0,
      netPosition: 0
    };
  }

  let totalSent = 0;
  let totalReceived = 0;

  transactions.forEach(transaction => {
    const amount = parseFloat(String(transaction.amount || '0')) || 0;
    
    if (transaction.senderId === userId) {
      totalSent += amount;
    } else if (transaction.receiverId === userId) {
      totalReceived += amount;
    }
  });

  const netPosition = totalReceived - totalSent;

  return {
    totalTransactions: transactions.length,
    totalSent,
    totalReceived,
    netPosition
  };
};
