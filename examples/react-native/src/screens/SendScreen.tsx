/**
 * SendScreen Component
 * 
 * Handles SOL token transfers with comprehensive validation and user feedback.
 * Features gasless transactions powered by Lazorkit's paymaster system.
 * 
 * Key Features:
 * - Real-time balance validation
 * - Solana address validation
 * - Amount input with MAX button
 * - Transaction preview with gasless benefits
 * - Success modal with explorer link
 * - Comprehensive error handling
 * 
 * Security Features:
 * - Address format validation using Solana's PublicKey
 * - Balance checks before transaction
 * - Confirmation dialog before sending
 * - Input sanitization and validation
 * 
 * User Experience:
 * - Clear transaction summary
 * - Loading states during processing
 * - Success feedback with transaction details
 * - Direct link to Solana Explorer for verification
 * 
 * @author exyness
 * @version 1.5.1
 */

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '@lazorkit/wallet-mobile-adapter';
import { 
  SystemProgram, 
  PublicKey, 
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import * as Linking from 'expo-linking';
import { ChevronLeft, CheckCircle, Send, ExternalLink } from 'lucide-react-native';
import { styles } from '../styles/SendScreen.styles';

// Deep link scheme for transaction callbacks
const APP_SCHEME = 'keyless://callback';

/**
 * Props interface for SendScreen component
 */
interface SendScreenProps {
  /** Callback function to navigate back to previous screen */
  onBack: () => void;
  /** Current wallet balance in SOL for validation */
  balance: number;
}

export function SendScreen({ onBack, balance }: SendScreenProps) {
  // Wallet connection and transaction hooks from Lazorkit SDK
  const { signAndSendTransaction, smartWalletPubkey, isConnected } = useWallet();

  // Form state management
  const [recipient, setRecipient] = useState(''); // Recipient wallet address
  const [amount, setAmount] = useState(''); // Amount to send in SOL
  const [loading, setLoading] = useState(false); // Transaction processing state
  const [showResult, setShowResult] = useState(false); // Success modal visibility
  const [txSignature, setTxSignature] = useState(''); // Transaction signature for explorer link

  /**
   * Validates a Solana wallet address format
   * Uses Solana's PublicKey constructor which throws on invalid addresses
   * @param address - The address string to validate
   * @returns boolean indicating if address is valid
   */
  const validateAddress = (address: string): boolean => {
    if (!address || typeof address !== 'string') {
      return false;
    }
    
    const trimmedAddress = address.trim();
    if (trimmedAddress.length === 0) {
      return false;
    }
    
    try {
      new PublicKey(trimmedAddress);
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * Main transaction handler with comprehensive validation and error handling
   * Performs multiple validation checks before initiating the transaction
   */
  const handleSend = async () => {
    // Connection validation
    if (!isConnected || !smartWalletPubkey) {
      Alert.alert('Error', 'Wallet not connected');
      return;
    }

    // Input sanitization
    const trimmedRecipient = recipient.trim();
    const trimmedAmount = amount.trim();

    // Required field validation
    if (!trimmedRecipient || !trimmedAmount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Address format validation
    if (!validateAddress(trimmedRecipient)) {
      Alert.alert('Error', 'Invalid recipient address. Please enter a valid Solana address.');
      return;
    }

    // Amount validation
    const sendAmount = parseFloat(trimmedAmount);
    if (isNaN(sendAmount) || sendAmount <= 0) {
      Alert.alert('Error', 'Invalid amount. Please enter a valid number.');
      return;
    }

    // Balance validation
    if (sendAmount > balance) {
      Alert.alert('Error', `Insufficient balance. Available: ${balance.toFixed(4)} SOL`);
      return;
    }

    // User confirmation dialog with transaction preview
    Alert.alert(
      'Confirm Transaction',
      `Send ${sendAmount} SOL to ${trimmedRecipient.slice(0, 6)}...${trimmedRecipient.slice(-6)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            try {
              setLoading(true);

              // Create Solana transfer instruction
              const transferInstruction = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: new PublicKey(trimmedRecipient),
                lamports: Math.floor(sendAmount * LAMPORTS_PER_SOL), // Convert SOL to lamports
              });

              // Execute transaction using Lazorkit's gasless system
              await signAndSendTransaction(
                {
                  instructions: [transferInstruction],
                  transactionOptions: {
                    clusterSimulation: 'devnet', // Development environment
                    computeUnitLimit: 200_000, // Gas limit for transaction
                  },
                },
                {
                  redirectUrl: APP_SCHEME,
                  onSuccess: (sig) => {
                    setTxSignature(sig);
                    setShowResult(true);
                    setLoading(false);
                  },
                  onFail: (error) => {
                    console.error('Transaction failed:', error);
                    Alert.alert('Transaction Failed', error.message || 'Transaction failed. Please try again.');
                    setLoading(false);
                  },
                }
              );
            } catch (error: any) {
              console.error('Send error:', error);
              Alert.alert('Error', error.message || 'Failed to send transaction. Please try again.');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  /**
   * Handles recipient address input with sanitization
   * Removes whitespace and invalid characters for better UX
   */
  const handleRecipientChange = (text: string) => {
    // Remove any potential whitespace or invalid characters
    const cleanText = text.replace(/\s+/g, '').trim();
    setRecipient(cleanText);
  };

  /**
   * Handles amount input with numeric validation
   * Only allows numbers and single decimal point
   */
  const handleAmountChange = (text: string) => {
    // Only allow numbers and decimal point
    const cleanText = text.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = cleanText.split('.');
    if (parts.length > 2) {
      return;
    }
    setAmount(cleanText);
  };

  /**
   * Sets amount to maximum available balance minus transaction buffer
   * Leaves small buffer for potential fees and transaction overhead
   */
  const handleMax = () => {
    // Leave buffer for fees and transaction overhead
    const maxAmount = Math.max(0, balance - 0.005).toFixed(4);
    setAmount(maxAmount);
  };

  /**
   * Opens transaction in Solana Explorer for verification
   * Uses Devnet explorer for development environment
   */
  const openExplorer = () => {
    if (txSignature) {
      Linking.openURL(`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back navigation */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={onBack} 
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <ChevronLeft size={20} color="#ced7dc" style={{ marginRight: 4 }} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Send SOL</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Input Form - Glass panel design for modern UI */}
        <View style={styles.inputCard}>
          {/* Recipient Address Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Recipient Address</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter Solana address"
                placeholderTextColor="#555b61"
                value={recipient}
                onChangeText={handleRecipientChange}
                autoCapitalize="none"
                autoCorrect={false}
                multiline={false}
                numberOfLines={1}
              />
            </View>
          </View>

          {/* Amount Input with MAX button */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Amount (SOL)</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor="#555b61"
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="decimal-pad"
              />
              {/* MAX button for user convenience */}
              <TouchableOpacity 
                onPress={handleMax} 
                style={styles.maxButton}
                activeOpacity={0.8}
              >
                <Text style={styles.maxText}>MAX</Text>
              </TouchableOpacity>
            </View>
            {/* Balance display for user reference */}
            <View style={styles.balanceRow}>
              <Text style={styles.balanceText}>Available: <Text style={styles.balanceAmount}>{balance.toFixed(4)} SOL</Text></Text>
            </View>
          </View>
        </View>

        {/* Transaction Summary - Preview before sending */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Transaction Summary</Text>
          <View style={styles.summaryContent}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount</Text>
              <Text style={styles.summaryValue}>{amount || '0'} SOL</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Network Fee</Text>
              <Text style={styles.summaryValue}>Gasless</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabelBold}>Total</Text>
              <Text style={styles.summaryValueBold}>
                {amount || '0'} SOL
              </Text>
            </View>
          </View>
        </View>

        {/* Send Transaction Button */}
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#040401" />
          ) : (
            <>
              <Send size={18} color="#040401" />
              <Text style={styles.sendButtonText}>Send Transaction</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Gasless Feature Highlight - Key selling point */}
        <View style={styles.gaslessNotice}>
          <CheckCircle size={20} color="#4ade80" />
          <View style={styles.gaslessContent}>
            <Text style={styles.gaslessTitle}>Gasless Transactions</Text>
            <Text style={styles.gaslessText}>Transactions are gasless - fees are paid by the paymaster!</Text>
          </View>
        </View>
      </View>

      {/* Success Modal - Transaction completion feedback */}
      <Modal visible={showResult} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Transaction Sent!</Text>
            
            {/* Transaction Details */}
            <View style={styles.resultSection}>
              <Text style={styles.resultLabel}>Amount Sent:</Text>
              <Text style={styles.resultText}>{amount} SOL</Text>
            </View>

            <View style={styles.resultSection}>
              <Text style={styles.resultLabel}>Transaction Signature:</Text>
              <View style={styles.copyableRow}>
                <Text style={styles.hashText} numberOfLines={1}>
                  {txSignature.slice(0, 20)}...
                </Text>
              </View>
            </View>

            {/* Explorer Link for Transaction Verification */}
            <TouchableOpacity 
              style={styles.explorerButton} 
              onPress={openExplorer}
              activeOpacity={0.8}
            >
              <ExternalLink size={16} color="#3B82F6" />
              <Text style={styles.explorerText}>View in Explorer</Text>
            </TouchableOpacity>
            
            {/* Done Button - Clears form and returns to wallet */}
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => {
                setShowResult(false);
                setAmount('');
                setRecipient('');
                onBack();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
