/**
 * SignMessageScreen Component
 * 
 * Provides message signing functionality using biometric authentication.
 * Message signing proves wallet ownership without revealing private keys.
 * 
 * Key Features:
 * - Custom message input with multi-line support
 * - Predefined quick message templates
 * - Biometric signing using Lazorkit's passkey system
 * - Signature verification and display
 * - Copy functionality for signatures and payloads
 * 
 * Use Cases:
 * - Proving wallet ownership for dApps
 * - Authentication without revealing private keys
 * - Creating verifiable digital signatures
 * - Identity verification for services
 * 
 * Security Features:
 * - Messages are signed locally using secure hardware
 * - Private keys never leave the device
 * - Biometric authentication required for each signature
 * - Signatures can be independently verified
 * 
 * Technical Details:
 * - Returns both signature and signed payload
 * - Compatible with standard message verification tools
 * - Uses Solana's message signing standards
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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '@lazorkit/wallet-mobile-adapter';
import * as Clipboard from 'expo-clipboard';
import { styles } from '../styles/SignMessageScreen.styles';
import { ChevronLeft, Fingerprint, Info, Copy, CheckCircle } from 'lucide-react-native';

// Deep link scheme for signing callbacks
const APP_SCHEME = 'keyless://callback';

/**
 * Props interface for SignMessageScreen component
 */
interface SignMessageScreenProps {
  /** Callback function to navigate back to previous screen */
  onBack: () => void;
}

export function SignMessageScreen({ onBack }: SignMessageScreenProps) {
  // Wallet signing functionality from Lazorkit SDK
  const { signMessage, isConnected } = useWallet();

  // Component state management
  const [message, setMessage] = useState('Welcome to Lazorkit! This message proves I own this wallet.'); // Default message
  const [loading, setLoading] = useState(false); // Signing process state
  const [showResult, setShowResult] = useState(false); // Success modal visibility
  const [signature, setSignature] = useState(''); // Generated signature
  const [signedPayload, setSignedPayload] = useState(''); // Complete signed payload

  /**
   * Predefined message templates for common use cases
   * Provides quick options for users who don't want to write custom messages
   */
  const predefinedMessages = [
    'Welcome to Lazorkit!',
    'I own this wallet address',
    'Signed with biometric authentication',
    'Proving wallet ownership',
  ];

  /**
   * Main message signing handler with comprehensive error handling
   * Uses Lazorkit's biometric signing system
   */
  const handleSign = async () => {
    // Connection validation
    if (!isConnected) {
      Alert.alert('Error', 'Wallet not connected');
      return;
    }

    // Message validation
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message to sign');
      return;
    }

    try {
      setLoading(true);

      // Execute message signing with biometric authentication
      const result = await signMessage(message, {
        redirectUrl: APP_SCHEME,
        onSuccess: (res) => {
          console.log('Message signed:', res);
          setSignature(res.signature);
          setSignedPayload(res.signedPayload);
          setShowResult(true);
        },
        onFail: (error) => {
          console.error('Signing failed:', error);
          Alert.alert('Error', error.message || 'Failed to sign message');
        },
      });

      // Handle direct result (if not using callbacks)
      if (result) {
        setSignature(result.signature);
        setSignedPayload(result.signedPayload);
        setShowResult(true);
      }
    } catch (error: any) {
      console.error('Sign error:', error);
      Alert.alert('Error', error.message || 'Failed to sign message');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Copies the signature to clipboard for external use
   * Useful for pasting into dApps or verification tools
   */
  const copySignature = async () => {
    await Clipboard.setStringAsync(signature);
    Alert.alert('Copied!', 'Signature copied to clipboard');
  };

  /**
   * Copies the complete signed payload to clipboard
   * Contains both message and signature for full verification
   */
  const copyPayload = async () => {
    await Clipboard.setStringAsync(signedPayload);
    Alert.alert('Copied!', 'Signed payload copied to clipboard');
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
        <Text style={styles.title}>Sign Message</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
        {/* Message Input Area - Glass panel design */}
        <View style={styles.messageCard}>
          <Text style={styles.label}>Message to Sign</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter the message you wish to sign..."
            placeholderTextColor="#6b7280"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Quick Message Templates - User convenience feature */}
        <View style={styles.quickMessagesSection}>
          <Text style={styles.quickMessagesTitle}>Quick Messages</Text>
          <View style={styles.quickMessages}>
            {predefinedMessages.map((msg, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickMessage}
                onPress={() => setMessage(msg)}
                activeOpacity={0.8}
              >
                <Text style={styles.quickMessageText}>{msg}</Text>
                {/* Placeholder icon for consistent spacing */}
                <Copy size={14} color="#ced7dc" style={{ opacity: 0 }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sign Button with Biometric Icon */}
        <TouchableOpacity
          style={[styles.signButton, loading && styles.signButtonDisabled]}
          onPress={handleSign}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#040401" />
          ) : (
            <>
              <Fingerprint size={20} color="#040401" />
              <Text style={styles.signButtonText}>Sign with Passkey</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Educational Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Info size={20} color="#3b82f6" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>About Message Signing</Text>
              <Text style={styles.infoText}>
                Message signing proves you own a wallet without revealing private keys. The signature can be verified by anyone to confirm authenticity.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Success Modal - Displays signing results */}
      <Modal visible={showResult} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <CheckCircle size={24} color="#22c55e" />
              <Text style={styles.modalTitle}>Message Signed!</Text>
            </View>
            
            {/* Original Message Display */}
            <View style={styles.resultSection}>
              <Text style={styles.resultLabel}>Original Message:</Text>
              <Text style={styles.resultText}>{message}</Text>
            </View>

            {/* Signature with Copy Functionality */}
            <View style={styles.resultSection}>
              <Text style={styles.resultLabel}>Signature:</Text>
              <View style={styles.copyableRow}>
                <Text style={styles.hashText} numberOfLines={1}>
                  {signature.slice(0, 20)}...
                </Text>
                <TouchableOpacity 
                  onPress={copySignature} 
                  style={styles.copyBtn}
                  activeOpacity={0.8}
                >
                  <Copy size={16} color="#ced7dc" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Signed Payload with Copy Functionality */}
            <View style={styles.resultSection}>
              <Text style={styles.resultLabel}>Signed Payload:</Text>
              <View style={styles.copyableRow}>
                <Text style={styles.hashText} numberOfLines={1}>
                  {signedPayload.slice(0, 20)}...
                </Text>
                <TouchableOpacity 
                  onPress={copyPayload} 
                  style={styles.copyBtn}
                  activeOpacity={0.8}
                >
                  <Copy size={16} color="#ced7dc" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Done Button - Clears form and returns to wallet */}
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => {
                setShowResult(false);
                setMessage('');
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