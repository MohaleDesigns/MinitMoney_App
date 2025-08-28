import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/utils/AuthContext';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TransactionWithUsers {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  sender: { id: string; fullName: string; email: string };
  receiver: { id: string; fullName: string; email: string };
}

export default function TransactionHistoryTab() {
  const [transactions, setTransactions] = useState<TransactionWithUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const loadTransactions = async () => {
    try {
      setError(null);
      setLoading(true);
      
      if (!user?.id) {
        setError('User not authenticated');
        return;
      }

      const response = await fetch(`/api/transaction?userId=${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      console.log('Fetched transactions:', data);
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transactions');
      console.error('Load transactions error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadTransactions();
    }
  }, [user?.id]);

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
              // For now, just clear local state
              // In a real app, you'd call an API to delete transactions
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

  const getStatusColor = (status: TransactionWithUsers['status']) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'failed': return '#F44336';
      default: return colors.tabIconDefault;
    }
  };

  const getStatusText = (status: TransactionWithUsers['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTransactionType = (transaction: TransactionWithUsers) => {
    if (transaction.senderId === user?.id) {
      return { type: 'Sent', color: '#F44336', prefix: '-' };
    } else {
      return { type: 'Received', color: '#4CAF50', prefix: '+' };
    }
  };

  const renderTransaction = ({ item }: { item: TransactionWithUsers }) => {
    const transactionType = getTransactionType(item);
    const recipientName = transactionType.type === 'Sent' ? item.receiver.fullName : item.sender.fullName;
    
    return (
      <View style={[styles.transactionCard, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
        <View style={styles.transactionHeader}>
          <View style={styles.recipientInfo}>
            <Text style={[styles.recipientName, { color: colors.text }]}>
              {recipientName}
            </Text>
            <Text style={[styles.transactionDate, { color: colors.tabIconDefault }]}>
              {formatDate(item.createdAt)}
            </Text>
            <Text style={[styles.transactionType, { color: transactionType.color }]}>
              {transactionType.type}
            </Text>
          </View>
          <View style={styles.amountInfo}>
            <Text style={[styles.amount, { color: colors.text }]}>
              ${(parseFloat(String(item.amount || '0')) || 0).toFixed(2)}
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
  };

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

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading user data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
    marginBottom: 4,
  },
  transactionType: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
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
