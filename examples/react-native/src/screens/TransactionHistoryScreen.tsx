/**
 * TransactionHistoryScreen Component
 * 
 * Displays a comprehensive list of all wallet transactions with detailed information.
 * Provides easy access to transaction verification through Solana Explorer.
 * 
 * Key Features:
 * - Chronological transaction listing
 * - Transaction type identification (send/receive/sign)
 * - Status indicators and timestamps
 * - Direct links to Solana Explorer
 * - Empty state handling for new wallets
 * 
 * Transaction Types:
 * - Send: Outgoing SOL transfers (negative amounts)
 * - Receive: Incoming SOL transfers (positive amounts)  
 * - Sign: Message signing operations (no balance change)
 * 
 * Data Sources:
 * - Real transaction data from Solana blockchain
 * - Fetched and processed by parent WalletScreen
 * - Includes signatures, amounts, timestamps, and status
 * 
 * User Experience:
 * - Clean, scannable transaction list
 * - Visual icons for different transaction types
 * - One-tap access to blockchain verification
 * - Responsive design with proper spacing
 * 
 * @author exyness
 * @version 1.5.1
 */

import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { ChevronLeft, ArrowUpRight, ArrowDownLeft, Edit, ExternalLink } from 'lucide-react-native';
import { styles } from '../styles/TransactionHistoryScreen.styles';

/**
 * Props interface for TransactionHistoryScreen component
 */
interface TransactionHistoryScreenProps {
  /** Callback function to navigate back to previous screen */
  onBack: () => void;
  /** Array of transaction objects with details like signature, type, amount, etc. */
  transactions: any[];
}

export function TransactionHistoryScreen({ onBack, transactions }: TransactionHistoryScreenProps) {
  // Use the real transactions data passed from parent component
  const allTransactions = transactions;

  /**
   * Returns appropriate icon component based on transaction type
   * Provides visual distinction between different transaction types
   * @param type - Transaction type ('send', 'receive', 'sign', or default)
   * @returns JSX icon element with consistent styling
   */
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight size={18} color="#ced7dc" />;
      case 'receive':
        return <ArrowDownLeft size={18} color="#ced7dc" />;
      case 'sign':
        return <Edit size={18} color="#ced7dc" />;
      default:
        return <ArrowUpRight size={18} color="#ced7dc" />;
    }
  };

  /**
   * Opens transaction in Solana Explorer for blockchain verification
   * Uses Devnet explorer for development environment
   * @param signature - Transaction signature hash for lookup
   */
  const openExplorer = (signature: string) => {
    const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
    Linking.openURL(explorerUrl);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={20} color="#ced7dc" style={{ marginRight: 4 }} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Transaction History</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
        {/* Transaction List - Displays all wallet transactions */}
        <View style={styles.transactionsList}>
          {allTransactions.map((tx, index) => (
            <View key={tx.signature || index} style={[
              styles.transactionItem,
              // Remove bottom border from last item for clean appearance
              index === allTransactions.length - 1 && styles.lastTransactionItem
            ]}>
              {/* Transaction Type Icon */}
              <View style={styles.transactionIcon}>
                {getTransactionIcon(tx.type)}
              </View>
              
              {/* Transaction Details - Main information display */}
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{tx.title}</Text>
                <Text style={styles.transactionDescription}>
                  {tx.type === 'send' ? 'Outgoing transaction' : 
                   tx.type === 'receive' ? 'Incoming transaction' : 
                   'Blockchain transaction'}
                </Text>
                <Text style={styles.transactionDate}>{tx.time} • {tx.status}</Text>
              </View>
              
              {/* Transaction Amount and Actions */}
              <View style={styles.transactionRight}>
                <View style={styles.transactionAmount}>
                  {/* Amount with color coding based on transaction type */}
                  <Text style={[
                    styles.transactionValue,
                    tx.type === 'send' ? styles.transactionSend : 
                    tx.type === 'receive' ? styles.transactionReceive : styles.transactionNeutral
                  ]}>
                    {tx.amount}
                  </Text>
                  <Text style={styles.transactionUsd}>
                    {tx.status === 'confirmed' ? 'Confirmed' : tx.status}
                  </Text>
                </View>
                
                {/* Explorer Link Button */}
                <TouchableOpacity 
                  style={styles.explorerButton}
                  onPress={() => openExplorer(tx.signature)}
                >
                  <ExternalLink size={14} color="#ced7dc" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Empty State - Shown when no transactions exist */}
        {allTransactions.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Transactions Yet</Text>
            <Text style={styles.emptyText}>
              Your transaction history will appear here once you start using your wallet.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}