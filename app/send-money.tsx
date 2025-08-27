import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' }
];

export default function SendMoneyScreen() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!recipient.trim()) {
      newErrors.recipient = 'Recipient is required';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendMoney = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      Alert.alert(
        'Success!', 
        `${currency.symbol} ${amount} ${currency.code} sent to ${recipient} successfully!`,
        [
          { 
            text: 'View History', 
            onPress: () => router.push('/transaction-history') 
          },
          { text: 'Send More', onPress: () => resetForm() }
        ]
      );
      resetForm();
      setLoading(false);
    }, 1000);
  };

  const resetForm = () => {
    setRecipient('');
    setAmount('');
    setCurrency(CURRENCIES[0]);
    setDescription('');
    setErrors({});
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Send Money
            </Text>
            <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
              Transfer money to friends and family instantly
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Recipient"
              placeholder="Enter recipient name or email"
              value={recipient}
              onChangeText={setRecipient}
              error={errors.recipient}
            />

            <View style={styles.amountRow}>
              <View style={styles.amountInput}>
                <Input
                  label="Amount"
                  placeholder="0.00"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  error={errors.amount}
                />
              </View>
              
                             <View style={styles.currencyContainer}>
                 <Text style={[styles.currencyLabel, { color: colors.text }]}>
                   Currency
                 </Text>
                 <TouchableOpacity
                   style={[styles.currencyPicker, { borderColor: colors.tabIconDefault }]}
                   onPress={() => {
                     // Show currency picker modal
                     Alert.alert(
                       'Select Currency',
                       'Choose a currency:',
                       CURRENCIES.map((curr) => ({
                         text: `${curr.symbol} ${curr.code} - ${curr.name}`,
                         onPress: () => setCurrency(curr)
                       }))
                     );
                   }}
                 >
                   <Text style={[styles.currencyOption, { color: colors.tint, fontWeight: 'bold' }]}>
                     {currency.symbol} {currency.code}
                   </Text>
                   <Text style={[styles.currencyDropdownIcon, { color: colors.tabIconDefault }]}>
                     ▼
                   </Text>
                 </TouchableOpacity>
               </View>
            </View>

            <Input
              label="Description (Optional)"
              placeholder="What's this payment for?"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <View style={styles.summary}>
              <Text style={[styles.summaryTitle, { color: colors.text }]}>
                Transaction Summary
              </Text>
                             <View style={styles.summaryRow}>
                 <Text style={[styles.summaryLabel, { color: colors.tabIconDefault }]}>
                   Amount:
                 </Text>
                 <Text style={[styles.summaryValue, { color: colors.text }]}>
                   {amount ? `${currency.symbol} ${amount} ${currency.code}` : '--'}
                 </Text>
               </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.tabIconDefault }]}>
                  Recipient:
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {recipient || '--'}
                </Text>
              </View>
            </View>

            <Button
              title="Send Money"
              onPress={handleSendMoney}
              loading={loading}
              disabled={!recipient.trim() || !amount.trim()}
              style={styles.sendButton}
            />

            <Button
              title="Clear Form"
              onPress={resetForm}
              variant="outline"
              style={styles.clearButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  amountRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  amountInput: {
    flex: 2,
  },
  currencyContainer: {
    flex: 1,
  },
  currencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  currencyPicker: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  currencyOption: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  currencyDropdownIcon: {
    fontSize: 12,
    marginLeft: 8,
  },
  summary: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  sendButton: {
    marginBottom: 16,
  },
  clearButton: {
    marginBottom: 24,
  },
});
