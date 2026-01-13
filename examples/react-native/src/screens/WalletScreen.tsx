/**
 * WalletScreen Component - Main Dashboard
 * 
 * The central hub of the Lazorkit wallet application. Manages user authentication,
 * displays wallet information, and provides navigation to all wallet features.
 * 
 * Key Features:
 * - Biometric wallet connection/disconnection
 * - Real-time balance display with refresh functionality
 * - Transaction history with blockchain data
 * - Navigation to Send, Receive, Sign Message screens
 * - Onboarding flow for new users
 * - Persistent user state management
 * 
 * Architecture:
 * - Uses React hooks for state management
 * - Integrates with Lazorkit SDK for wallet operations
 * - Connects to Solana Devnet for blockchain data
 * - Implements AsyncStorage for user preferences
 * 
 * User Flow:
 * 1. First-time users see onboarding flow
 * 2. Returning users can connect with biometrics
 * 3. Connected users access full wallet functionality
 * 4. Real-time data updates and transaction monitoring
 * 
 * Security Features:
 * - Biometric authentication required
 * - No private key storage or exposure
 * - Secure hardware-based key management
 * - Session management with proper cleanup
 * 
 * Development Features:
 * - Devnet environment indicators
 * - Debug controls for testing
 * - Comprehensive error handling
 * - Loading states for all async operations
 * 
 * @author exyness
 * @version 1.5.1
 */

import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Image,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '@lazorkit/wallet-mobile-adapter';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Edit,
  Lock} from 'lucide-react-native';
import { SendScreen } from './SendScreen';
import { ReceiveScreen } from './ReceiveScreen';
import { SignMessageScreen } from './SignMessageScreen';
import { OnboardingScreen } from './OnboardingScreen';
import { TransactionHistoryScreen } from './TransactionHistoryScreen';
import { styles } from '../styles/WalletScreen.styles';

// Configuration constants
const APP_SCHEME = 'keyless://home'; // Deep link scheme for wallet callbacks
const RPC_URL = 'https://api.devnet.solana.com'; // Solana Devnet RPC endpoint

// Screen navigation type definition
type Screen = 'onboarding' | 'wallet' | 'send' | 'receive' | 'sign' | 'transactions';

export function WalletScreen() {
  // Wallet connection hooks from Lazorkit SDK
  const { connect, disconnect, isConnected, smartWalletPubkey, isConnecting, isLoading } = useWallet();

  // Core application state
  const [balance, setBalance] = useState<number>(0); // Wallet balance in SOL
  const [refreshing, setRefreshing] = useState(false); // Data refresh state
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding'); // Current screen navigation
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null); // User onboarding status
  const [isCheckingExistingUser, setIsCheckingExistingUser] = useState(true); // Initial user check state
  const [transactions, setTransactions] = useState<any[]>([]); // Transaction history data
  const [loadingTransactions, setLoadingTransactions] = useState(false); // Transaction loading state
  
  // Animation references for UI feedback
  const rotateAnim = useRef(new Animated.Value(0)).current; // Refresh button rotation
  const fadeAnim = useRef(new Animated.Value(1)).current; // Screen transition fade

  /**
   * Starts the refresh button spinning animation
   * Provides visual feedback during data refresh operations
   */
  const startSpinning = () => {
    rotateAnim.setValue(0);
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  };

  /**
   * Stops the refresh button spinning animation
   * Called when refresh operations complete
   */
  const stopSpinning = () => {
    rotateAnim.stopAnimation();
    rotateAnim.setValue(0);
  };

  /**
   * Handles screen navigation with smooth fade transition
   * Provides visual continuity between different app screens
   * @param screen - Target screen to navigate to
   */
  const navigateToScreen = (screen: Screen) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    setTimeout(() => {
      setCurrentScreen(screen);
    }, 150);
  };

  // Animation interpolation for refresh button rotation
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Application lifecycle effects
  
  /**
   * Initialize user status check on app launch
   * Determines if user is new or returning for proper flow routing
   */
  useEffect(() => {
    checkUserStatus();
  }, []);

  /**
   * Handle screen routing based on connection and user status
   * Manages navigation between onboarding, connection, and wallet screens
   */
  useEffect(() => {
    if (isFirstLaunch === null || isCheckingExistingUser) return; // Still loading

    if (isConnected) {
      // User is connected, go to wallet dashboard
      setCurrentScreen('wallet');
    } else if (isFirstLaunch) {
      // First-time user, show onboarding flow
      setCurrentScreen('onboarding');
    } else {
      // Returning user, show connection screen
      setCurrentScreen('wallet');
    }
  }, [isConnected, isFirstLaunch, isCheckingExistingUser]);

  /**
   * Checks user onboarding status and manages session persistence
   * Determines appropriate user flow based on previous app usage
   */
  const checkUserStatus = async () => {
    try {
      setIsCheckingExistingUser(true);
      
      // Check if user has completed onboarding before
      const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
      
      if (hasCompletedOnboarding === 'true') {
        // Returning user - ready for connection
        setIsFirstLaunch(false);
        
        // Note: Silent reconnection could be implemented here if Lazorkit supports it
        if (!isConnected && !isConnecting) {
          console.log('Returning user detected, ready to connect');
        }
      } else {
        // First-time user - needs onboarding
        setIsFirstLaunch(true);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      // Default to first-time user experience on error
      setIsFirstLaunch(true);
    } finally {
      setIsCheckingExistingUser(false);
    }
  };

  /**
   * Marks onboarding as completed in persistent storage
   * Ensures returning users skip onboarding flow
   */
  const markOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  // Wallet address string for display and API calls
  const walletAddress = smartWalletPubkey?.toString() || '';

  /**
   * Load wallet data when connection is established
   * Fetches balance and transaction history from Solana blockchain
   */
  useEffect(() => {
    console.log('Wallet connection status:', { isConnected, walletAddress });
    if (isConnected && walletAddress) {
      // Load wallet data with error handling to prevent crashes
      const loadWalletData = async () => {
        try {
          await Promise.allSettled([
            fetchBalance(),
            fetchTransactions()
          ]);
        } catch (error) {
          console.error('Error loading wallet data:', error);
        }
      };
      loadWalletData();
    } else {
      // Clear data when disconnected
      setBalance(0);
      setTransactions([]);
    }
  }, [isConnected, walletAddress]);

  /**
   * Fetches current wallet balance from Solana blockchain
   * Connects to Devnet and retrieves balance in SOL units
   */
  const fetchBalance = async () => {
    if (!walletAddress || walletAddress.trim() === '') {
      console.log('No wallet address available for balance fetch');
      return;
    }
    
    try {
      console.log('Fetching balance for:', walletAddress);
      
      // Validate wallet address format before API call
      if (walletAddress.length < 32 || walletAddress.length > 44) {
        throw new Error('Invalid wallet address format');
      }
      
      const connection = new Connection(RPC_URL, 'confirmed');
      const pubkey = new PublicKey(walletAddress);
      const lamports = await connection.getBalance(pubkey);
      const solBalance = lamports / LAMPORTS_PER_SOL; // Convert lamports to SOL
      console.log('Balance fetched:', solBalance, 'SOL');
      setBalance(solBalance);
    } catch (err: any) {
      console.error('Failed to fetch balance:', err);
      // Don't re-throw in background fetch, only in user-initiated refresh
      setBalance(0);
    }
  };

  /**
   * Handles user-initiated data refresh with comprehensive error handling
   * Provides visual feedback and error reporting for failed operations
   */
  const handleRefresh = async () => {
    if (!walletAddress) {
      console.log('No wallet address for refresh');
      return;
    }
    
    if (refreshing) {
      console.log('Already refreshing, skipping');
      return;
    }
    
    console.log('Starting refresh for wallet:', walletAddress);
    setRefreshing(true);
    startSpinning();
    
    try {
      // Fetch balance and transactions in parallel for better performance
      const [balanceResult, transactionsResult] = await Promise.allSettled([
        fetchBalance(),
        fetchTransactions()
      ]);
      
      // Log individual operation results for debugging
      if (balanceResult.status === 'rejected') {
        console.error('Balance fetch failed:', balanceResult.reason);
      }
      
      if (transactionsResult.status === 'rejected') {
        console.error('Transactions fetch failed:', transactionsResult.reason);
      }
      
      console.log('Refresh completed successfully');
    } catch (error) {
      console.error('Refresh failed with error:', error);
      Alert.alert('Refresh Failed', 'Unable to refresh data. Please try again.');
    } finally {
      setRefreshing(false);
      stopSpinning();
    }
  };

  /**
   * Fetches transaction history from Solana blockchain
   * Processes and categorizes transactions by type (send/receive/sign)
   */
  const fetchTransactions = async () => {
    if (!walletAddress) return;
    setLoadingTransactions(true);
    try {
      const connection = new Connection(RPC_URL, 'confirmed');
      const pubkey = new PublicKey(walletAddress);
      
      // Get recent transaction signatures (limit to 10 for performance)
      const signatures = await connection.getSignaturesForAddress(pubkey, { limit: 10 });
      
      // Fetch detailed transaction data for each signature
      const transactionDetails = await Promise.all(
        signatures.map(async (sig) => {
          try {
            const tx = await connection.getTransaction(sig.signature, {
              maxSupportedTransactionVersion: 0
            });
            
            if (!tx) return null;
            
            // Find the account index for our wallet in the transaction
            const accountIndex = tx.transaction.message.staticAccountKeys.findIndex(
              key => key.toString() === walletAddress
            );
            
            if (accountIndex === -1) return null;
            
            // Calculate balance change to determine transaction type
            const preBalance = tx.meta?.preBalances?.[accountIndex] || 0;
            const postBalance = tx.meta?.postBalances?.[accountIndex] || 0;
            const balanceChange = (postBalance - preBalance) / LAMPORTS_PER_SOL;
            
            // Categorize transaction based on balance change
            let type = 'other';
            let title = 'Transaction';
            let amount = '0 SOL';
            
            if (Math.abs(balanceChange) < 0.000001) {
              // No balance change - likely a message signing or other operation
              type = 'sign';
              title = 'Message Signed';
              amount = 'No transfer';
            } else if (balanceChange > 0) {
              // Positive balance change - incoming transaction
              type = 'receive';
              title = 'Received SOL';
              amount = `+${balanceChange.toFixed(4)} SOL`;
            } else if (balanceChange < 0) {
              // Negative balance change - outgoing transaction
              type = 'send';
              title = 'Sent SOL';
              amount = `${balanceChange.toFixed(4)} SOL`;
            }
            
            return {
              signature: sig.signature,
              type,
              amount,
              time: new Date(sig.blockTime! * 1000).toLocaleDateString(),
              status: sig.confirmationStatus || 'confirmed',
              title
            };
          } catch (error) {
            console.error('Error fetching transaction details:', error);
            return null;
          }
        })
      );
      
      // Filter out failed transaction fetches
      const validTransactions = transactionDetails.filter(tx => tx !== null);
      setTransactions(validTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  /**
   * Initiates wallet connection using Lazorkit SDK
   * Handles biometric authentication and connection callbacks
   */
  const handleConnect = async () => {
    try {
      await connect({
        redirectUrl: APP_SCHEME,
        onSuccess: (walletInfo) => console.log('Connected:', walletInfo.smartWallet),
        onFail: (err) => console.error('Connection failed:', err),
      });
    } catch (err) {
      console.error('Connect error:', err);
    }
  };

  /**
   * Handles wallet disconnection and cleanup
   * Clears sensitive data and resets application state
   */
  const handleDisconnect = async () => {
    try {
      await disconnect({
        onSuccess: () => setBalance(0),
        onFail: (err) => console.error('Disconnect failed:', err),
      });
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  };

  /**
   * Development utility to reset onboarding status
   * Allows testing of first-time user experience
   */
  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('hasCompletedOnboarding');
      setIsFirstLaunch(true);
      setCurrentScreen('onboarding');
      Alert.alert('Reset Complete', 'You can now go through onboarding again');
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };



  // Show loading while checking user status
  if (isFirstLaunch === null || isCheckingExistingUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0071e3" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render sub-screens
  if (currentScreen === 'onboarding') {
    return (
      <OnboardingScreen
        onComplete={() => {
          markOnboardingComplete();
          navigateToScreen('wallet');
        }}
      />
    );
  }
  if (currentScreen === 'send') {
    return <SendScreen onBack={() => navigateToScreen('wallet')} balance={balance} />;
  }
  if (currentScreen === 'receive') {
    return <ReceiveScreen onBack={() => navigateToScreen('wallet')} walletAddress={walletAddress} />;
  }
  if (currentScreen === 'sign') {
    return <SignMessageScreen onBack={() => navigateToScreen('wallet')} />;
  }
  if (currentScreen === 'transactions') {
    return <TransactionHistoryScreen onBack={() => navigateToScreen('wallet')} transactions={transactions} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image 
              source={require('../../assets/welcome-logo.png')}
              style={styles.welcomeIcon}
              resizeMode="contain"
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Keyless</Text>
            </View>
          </View>
        </View>

        {!isConnected ? (
          <View style={styles.connectContainer}>
            <View style={styles.iconContainer}>
              <Lock size={48} color="#dde0e9" />
            </View>
            
            {isFirstLaunch ? (
              // First-time user messaging
              <>
                <Text style={styles.welcomeTitle}>Welcome to Keyless</Text>
                <Text style={styles.welcomeText}>
                  Create your secure wallet with biometric authentication
                </Text>
              </>
            ) : (
              // Returning user messaging
              <>
                <Text style={styles.welcomeTitle}>Welcome Back</Text>
                <Text style={styles.welcomeText}>
                  Use your passkey to securely access your wallet
                </Text>
              </>
            )}
            
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleConnect}
              disabled={isConnecting || isLoading}
              activeOpacity={0.8}
            >
              {isConnecting || isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isFirstLaunch ? 'Create Wallet' : 'Unlock Wallet'}
                </Text>
              )}
            </TouchableOpacity>
            
            {!isFirstLaunch && (
              <TouchableOpacity
                style={styles.onboardingButton}
                onPress={() => navigateToScreen('onboarding')}
                activeOpacity={0.8}
              >
                <Text style={styles.onboardingButtonText}>Need help? See how it works →</Text>
              </TouchableOpacity>
            )}
            
            {isFirstLaunch && (
              <TouchableOpacity
                style={styles.onboardingButton}
                onPress={() => navigateToScreen('onboarding')}
                activeOpacity={0.8}
              >
                <Text style={styles.onboardingButtonText}>Learn more about passkeys →</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.dashboard}>
            {/* Balance Card - Glass Panel Design */}
            <View style={styles.balanceSection}>
              <TouchableOpacity 
                onPress={handleRefresh} 
                disabled={refreshing} 
                style={styles.refreshButtonTop}
                activeOpacity={0.8}
              >
                <Animated.View style={{ transform: [{ rotate: refreshing ? spin : '0deg' }] }}>
                  <RefreshCw 
                    size={16} 
                    color={refreshing ? "#0071e3" : "#ced7dc"} 
                  />
                </Animated.View>
                <Text style={[styles.refreshButtonText, refreshing && styles.refreshButtonTextActive]}>
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Text>
              </TouchableOpacity>
              
              <View style={styles.balanceContainer}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)']}
                  style={styles.balanceGlassPanel}
                >
                  <View style={styles.balanceCard}>
                    <View style={styles.balanceHeader}>
                      <Text style={styles.balanceLabel}>Total Balance</Text>
                    </View>
                    <View style={styles.balanceAmountContainer}>
                      <Text style={styles.balanceAmount}>{balance.toFixed(4)}</Text>
                      <Text style={styles.balanceCurrency}>SOL</Text>
                    </View>
                  </View>
                  <View style={styles.balanceGlassBorderOverlay} />
                </LinearGradient>
              </View>
            </View>

            {/* Action Buttons Grid - 2x2 Layout */}
            <View style={styles.actionGrid2x2}>
              {/* Top Row */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.gridButton, styles.sendButton]}
                  onPress={() => navigateToScreen('send')}
                  activeOpacity={0.8}
                >
                  <View style={styles.gridIconContainer}>
                    <ArrowUpRight size={18} color="#040401" />
                  </View>
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.gridButton, styles.receiveButton]}
                  onPress={() => navigateToScreen('receive')}
                  activeOpacity={0.8}
                >
                  <View style={styles.gridIconContainerGlass}>
                    <ArrowDownLeft size={18} color="#dde0e9" />
                  </View>
                  <Text style={styles.receiveButtonText}>Receive</Text>
                </TouchableOpacity>
              </View>

              {/* Bottom Row - Sign Message Full Width */}
              <TouchableOpacity
                style={[styles.gridButton, styles.signMessageButton, styles.fullWidthButton]}
                onPress={() => navigateToScreen('sign')}
                activeOpacity={0.8}
              >
                <View style={styles.gridIconContainerSign}>
                  <Edit size={18} color="#22c55e" />
                </View>
                <Text style={styles.signMessageText}>Sign Message</Text>
              </TouchableOpacity>
            </View>

            {/* Recent Transactions */}
            <View style={styles.transactionsSection}>
              <View style={styles.transactionsHeader}>
                <Text style={styles.transactionsTitle}>Recent Activity</Text>
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => navigateToScreen('transactions')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              {loadingTransactions ? (
                <View style={styles.loadingTransactions}>
                  <ActivityIndicator color="#ced7dc" size="small" />
                  <Text style={styles.loadingTransactionsText}>Loading transactions...</Text>
                </View>
              ) : transactions.length > 0 ? (
                <View style={styles.transactionsList}>
                  {transactions.slice(0, 3).map((tx, index) => (
                  <View key={tx.signature || index} style={[
                    styles.transactionItem,
                    index === Math.min(transactions.length - 1, 2) && styles.lastTransactionItem
                  ]}>
                    <View style={styles.transactionIcon}>
                      {tx.type === 'send' ? (
                        <ArrowUpRight size={16} color="#ced7dc" />
                      ) : tx.type === 'receive' ? (
                        <ArrowDownLeft size={16} color="#ced7dc" />
                      ) : tx.type === 'sign' ? (
                        <Edit size={16} color="#ced7dc" />
                      ) : (
                        <Edit size={16} color="#ced7dc" />
                      )}
                    </View>
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionType}>{tx.title}</Text>
                      <Text style={styles.transactionTime}>{tx.time}</Text>
                    </View>
                    <View style={styles.transactionAmount}>
                      <Text style={[
                        styles.transactionValue,
                        tx.type === 'send' ? styles.transactionSend : 
                        tx.type === 'receive' ? styles.transactionReceive : 
                        tx.type === 'sign' ? styles.transactionSign : styles.transactionNeutral
                      ]}>
                        {tx.amount}
                      </Text>
                      <Text style={styles.transactionStatus}>{tx.status}</Text>
                    </View>
                  </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyTransactions}>
                  <Text style={styles.emptyTransactionsText}>No transactions yet</Text>
                  <Text style={styles.emptyTransactionsSubtext}>Your transaction history will appear here</Text>
                </View>
              )}
            </View>



            {/* Reset Onboarding (Dev) */}
            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={resetOnboarding}
              activeOpacity={0.8}
            >
              <Text style={styles.resetText}>Reset Onboarding (Dev)</Text>
            </TouchableOpacity>

            {/* Disconnect Button - Moved to bottom */}
            <TouchableOpacity 
              style={styles.disconnectButtonBottom} 
              onPress={handleDisconnect}
              activeOpacity={0.8}
            >
              <View style={styles.gridIconContainerDisconnect}>
                <ArrowUpRight size={18} color="#dc2626" style={{ transform: [{ rotate: '45deg' }] }} />
              </View>
              <Text style={styles.disconnectText}>Disconnect Wallet</Text>
            </TouchableOpacity>

            {/* Dev Environment Info */}
            <View style={styles.devInfoCard}>
              <Text style={styles.devTitle}>Development Environment</Text>
              <Text style={styles.devText}>
                Running on Solana Devnet • Test tokens only • For development and testing purposes
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
