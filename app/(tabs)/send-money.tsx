import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/utils/AuthContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "PLN", name: "Polish Złoty", symbol: "zł" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
];

interface User {
  id: string;
  email: string;
  name: string;
}

export default function SendMoneyTab() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null);

  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Search for users when recipient input changes
  useEffect(() => {
    const searchUsers = async () => {
      if (recipient.trim().length >= 2) {
        try {
          // Mock search results
          const mockResults = [
            { id: "2", email: "jane@example.com", name: "Jane Smith" },
            { id: "3", email: "bob@example.com", name: "Bob Johnson" },
            { id: "4", email: "alice@example.com", name: "Alice Brown" },
          ].filter(
            (user) =>
              user.name.toLowerCase().includes(recipient.toLowerCase()) ||
              user.email.toLowerCase().includes(recipient.toLowerCase())
          );
          setSearchResults(mockResults);
          setShowSearchResults(true);
        } catch (error) {
          console.error("Search failed:", error);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [recipient]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedRecipient) {
      newErrors.recipient = "Please select a recipient from the search results";
    }

    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (Number(amount) > (user?.balance || 0)) {
      newErrors.amount = "Insufficient balance";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendMoney = async () => {
    if (!validateForm() || !selectedRecipient) return;

    setLoading(true);

    try {
      // Mock transaction creation
      const mockTransaction = {
        id: Date.now().toString(),
        senderId: user?.id || '1',
        receiverId: selectedRecipient.id,
        amount: Number(amount),
        description: description || "Money transfer",
        timestamp: new Date().toISOString(),
      };

      Alert.alert(
        "Success!",
        `${currency.symbol} ${amount} ${currency.code} sent to ${selectedRecipient.name} successfully!`,
        [
          {
            text: "View History",
            onPress: () => router.push("/transaction-history"),
          },
          { text: "Send More", onPress: () => resetForm() },
        ]
      );
      resetForm();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to send money. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRecipient("");
    setAmount("");
    setCurrency(CURRENCIES[0]);
    setDescription("");
    setErrors({});
    setSelectedRecipient(null);
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const selectRecipient = (user: User) => {
    setSelectedRecipient(user);
    setRecipient(user.email);
    setShowSearchResults(false);
  };

  const renderSearchResult = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={[styles.searchResult, { borderColor: colors.tabIconDefault }]}
      onPress={() => selectRecipient(item)}
    >
      <Text style={[styles.searchResultName, { color: colors.text }]}>
        {item.name}
      </Text>
      <Text
        style={[styles.searchResultEmail, { color: colors.tabIconDefault }]}
      >
        {item.email}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            <View style={styles.recipientContainer}>
              <Input
                label="Recipient"
                placeholder="Search by email or name"
                value={recipient}
                onChangeText={setRecipient}
                error={errors.recipient}
              />

              {showSearchResults && searchResults.length > 0 && (
                <View
                  style={[
                    styles.searchResults,
                    { borderColor: colors.tabIconDefault },
                  ]}
                >
                  <FlatList
                    data={searchResults}
                    renderItem={renderSearchResult}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                  />
                </View>
              )}

              {selectedRecipient && (
                <View
                  style={[
                    styles.selectedRecipient,
                    { backgroundColor: colors.tint + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.selectedRecipientText,
                      { color: colors.tint },
                    ]}
                  >
                    Selected: {selectedRecipient.name} (
                    {selectedRecipient.email})
                  </Text>
                </View>
              )}
            </View>

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
                  style={[
                    styles.currencyPicker,
                    { borderColor: colors.tabIconDefault },
                  ]}
                  onPress={() => {
                    // Show currency picker modal
                    Alert.alert(
                      "Select Currency",
                      "Choose a currency:",
                      CURRENCIES.map((curr) => ({
                        text: `${curr.symbol} ${curr.code} - ${curr.name}`,
                        onPress: () => setCurrency(curr),
                      }))
                    );
                  }}
                >
                  <Text
                    style={[
                      styles.currencyOption,
                      { color: colors.tint, fontWeight: "bold" },
                    ]}
                  >
                    {currency.symbol} {currency.code}
                  </Text>
                  <Text
                    style={[
                      styles.currencyDropdownIcon,
                      { color: colors.tabIconDefault },
                    ]}
                  >
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
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: colors.tabIconDefault },
                  ]}
                >
                  Amount:
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {amount
                    ? `${currency.symbol} ${amount} ${currency.code}`
                    : "--"}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: colors.tabIconDefault },
                  ]}
                >
                  Recipient:
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {selectedRecipient?.name || "--"}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: colors.tabIconDefault },
                  ]}
                >
                  Your Balance:
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                                     ${user?.balance?.toFixed(2) || '0.00'}
                </Text>
              </View>
            </View>

            <Button
              title="Send Money"
              onPress={handleSendMoney}
              loading={loading}
              disabled={!selectedRecipient || !amount.trim()}
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
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  recipientContainer: {
    marginBottom: 16,
  },
  searchResults: {
    borderWidth: 1,
    borderRadius: 12,
    maxHeight: 200,
    marginTop: 8,
    backgroundColor: "white",
  },
  searchResult: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  searchResultEmail: {
    fontSize: 14,
  },
  selectedRecipient: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  selectedRecipientText: {
    fontSize: 14,
    fontWeight: "500",
  },
  amountRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  amountInput: {
    flex: 2,
  },
  currencyContainer: {
    width: 150,
  },
  currencyLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  currencyPicker: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  currencyOption: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  currencyDropdownIcon: {
    fontSize: 10,
    marginLeft: 8,
  },
  summary: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  sendButton: {
    marginBottom: 16,
  },
  clearButton: {
    marginBottom: 24,
  },
});
