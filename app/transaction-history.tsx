import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/utils/AuthContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock transaction type
type Transaction = {
  id: string;
  recipient: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: number;
  description?: string;
};

// Mock transaction data
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    recipient: 'John Doe',
    amount: 50.00,
    currency: 'USD',
    status: 'completed',
    timestamp: Date.now() - 86400000, // 1 day ago
    description: 'Lunch payment'
  },
  {
    id: '2',
    recipient: 'Jane Smith',
    amount: 25.50,
    currency: 'USD',
    status: 'completed',
    timestamp: Date.now() - 172800000, // 2 days ago
    description: 'Coffee and snacks'
  },
  {
    id: '3',
    recipient: 'Bob Johnson',
    amount: 100.00,
    currency: 'USD',
    status: 'pending',
    timestamp: Date.now() - 259200000, // 3 days ago
    description: 'Rent contribution'
  }
];

export default function TransactionHistoryScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const loadTransactions = async () => {
    try {
      setError(null);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTransactions(MOCK_TRANSACTIONS);
    } catch (err) {
      setError('Failed to load transactions');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const clearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all transaction history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: async () => {
            try {
              setTransactions([]);
              Alert.alert('Success', 'Transaction history cleared');
            } catch (err) {
              Alert.alert('Error', 'Failed to clear history');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'failed': return '#F44336';
      default: return colors.tabIconDefault;
    }
  };

  const getStatusText = (status: Transaction['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={[styles.transactionCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={styles.transactionHeader}>
        <View style={styles.recipientInfo}>
          <Text style={[styles.recipientName, { color: colors.text }]}>
            {item.recipient}
          </Text>
          <Text style={[styles.transactionDate, { color: colors.tabIconDefault }]}>
            {formatDate(item.timestamp)}
          </Text>
        </View>
        <View style={styles.amountInfo}>
          <Text style={[styles.amount, { color: colors.text }]}>
            {item.currency} {item.amount.toFixed(2)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>
      </View>
      
      {item.description && (
        <Text style={[styles.description, { color: colors.tabIconDefault }]}>
          {item.description}
        </Text>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        No Transactions Yet
      </Text>
      <Text style={[styles.emptyStateSubtitle, { color: colors.tabIconDefault }]}>
        Start sending money to see your transaction history here
      </Text>
      <Button
        title="Send Money"
        onPress={() => router.push('/send-money')}
        style={styles.emptyStateButton}
      />
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Text style={[styles.errorStateTitle, { color: colors.text }]}>
        Something went wrong
      </Text>
      <Text style={[styles.errorStateSubtitle, { color: colors.tabIconDefault }]}>
        {error}
      </Text>
      <Button
        title="Try Again"
        onPress={loadTransactions}
        style={styles.errorStateButton}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading transactions...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Transaction History
        </Text>
        <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {error ? (
        renderErrorState()
      ) : transactions.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.tint}
              />
            }
          />
          
          <View style={styles.footer}>
            <Button
              title="Send More Money"
              onPress={() => router.push('/send-money')}
              style={styles.sendMoreButton}
            />
            <Button
              title="Clear History"
              onPress={clearHistory}
              variant="outline"
              style={styles.clearButton}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  listContent: {
    padding: 24,
    paddingTop: 0,
  },
  transactionCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recipientInfo: {
    flex: 1,
    marginRight: 16,
  },
  recipientName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
  },
  amountInfo: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  emptyStateButton: {
    minWidth: 200,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  errorStateButton: {
    minWidth: 200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
  footer: {
    padding: 24,
    paddingTop: 16,
  },
  sendMoreButton: {
    marginBottom: 16,
  },
  clearButton: {
    marginBottom: 24,
  },
});
