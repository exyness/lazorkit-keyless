/**
 * ReceiveScreen Component
 * 
 * Displays the user's wallet address for receiving SOL and SPL tokens.
 * Features a QR code for easy scanning and address copying functionality.
 * 
 * Key Features:
 * - QR code generation for wallet address
 * - One-tap address copying to clipboard
 * - Formatted address display (truncated + full)
 * - Important safety notices for users
 * - Devnet-specific warnings and instructions
 * 
 * Security Considerations:
 * - Only displays receive functionality (no private key exposure)
 * - Clear warnings about supported token types
 * - Devnet environment notices for testing
 * 
 * @author exyness
 * @version 1.5.1
 */

import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { ChevronLeft, Copy, AlertTriangle } from 'lucide-react-native';
import { styles } from '../styles/ReceiveScreen.styles';

/**
 * Props interface for ReceiveScreen component
 */
interface ReceiveScreenProps {
  /** Callback function to navigate back to previous screen */
  onBack: () => void;
  /** The wallet address to display and generate QR code for */
  walletAddress: string;
}

export function ReceiveScreen({ onBack, walletAddress }: ReceiveScreenProps) {
  /**
   * Copies the wallet address to device clipboard and shows confirmation
   * Uses Expo's Clipboard API for cross-platform compatibility
   */
  const copyAddress = async () => {
    await Clipboard.setStringAsync(walletAddress);
    Alert.alert('Copied!', 'Wallet address copied to clipboard');
  };

  /**
   * Formats wallet address for display by showing first 8 and last 8 characters
   * This provides a recognizable preview while keeping the UI clean
   * @param address - The full wallet address to format
   * @returns Formatted address string (e.g., "ABC12345...XYZ67890")
   */
  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back navigation and screen title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={20} color="#ced7dc" style={{ marginRight: 4 }} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Receive SOL</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* QR Code Card - Main interaction area with glass panel design */}
        <View style={styles.qrCard}>
          <Text style={styles.qrTitle}>Your Wallet Address</Text>
          
          {/* QR Code Generation - Scannable by other wallets */}
          <View style={styles.qrContainer}>
            <QRCode
              value={walletAddress}
              size={192}
              backgroundColor="white"
              color="black"
            />
          </View>

          {/* Address Display Section - Multiple formats for user convenience */}
          <View style={styles.addressSection}>
            <Text style={styles.addressLabel}>WALLET ADDRESS</Text>
            {/* Truncated address for quick reference */}
            <TouchableOpacity style={styles.addressBox} onPress={copyAddress}>
              <Text style={styles.addressText}>{formatAddress(walletAddress)}</Text>
            </TouchableOpacity>
            {/* Full address for verification (selectable text) */}
            <Text style={styles.fullAddress} selectable>
              {walletAddress}
            </Text>
            {/* Copy button with clear call-to-action */}
            <TouchableOpacity style={styles.copyAddressButton} onPress={copyAddress}>
              <Copy size={16} color="#040401" />
              <Text style={styles.copyAddressText}>Copy Address</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Safety Notice - Critical information for users */}
        <View style={styles.importantNotice}>
          <View style={styles.noticeHeader}>
            <AlertTriangle size={16} color="#eab308" />
            <Text style={styles.noticeTitle}>Important</Text>
          </View>
          <View style={styles.noticeList}>
            {/* Token compatibility warning */}
            <View style={styles.noticeItem}>
              <Text style={styles.noticeBullet}>•</Text>
              <Text style={styles.noticeText}>
                Only send SOL or SPL tokens to this address. Sending other assets may result in permanent loss.
              </Text>
            </View>
            {/* Development environment notice */}
            <View style={styles.noticeItem}>
              <Text style={styles.noticeBullet}>•</Text>
              <Text style={styles.noticeText}>
                This is a Devnet address for testing purposes.
              </Text>
            </View>
            {/* Helpful resource for getting test tokens */}
            <View style={styles.noticeItem}>
              <Text style={styles.noticeBullet}>•</Text>
              <Text style={styles.noticeText}>
                Get free Devnet SOL at <Text style={styles.linkText}>faucet.solana.com</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
