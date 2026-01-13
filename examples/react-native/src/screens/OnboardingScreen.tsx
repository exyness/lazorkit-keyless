/**
 * OnboardingScreen Component
 * 
 * A comprehensive onboarding flow that introduces users to Lazorkit's keyless wallet features.
 * This screen guides users through 4 main steps:
 * 1. Welcome - Introduction to the app
 * 2. Gasless - Explanation of gasless transactions
 * 3. Passkey - Biometric security features
 * 4. Ready - Final step with wallet creation/login options
 * 
 * Features:
 * - Horizontal scrollable pages with smooth transitions
 * - Visual indicators with glass panel design
 * - Progressive disclosure of features
 * - Dual action buttons (Create/Login) on final step
 * - Skip functionality for returning users
 * 
 * @author exyness
 * @version 1.5.1
 */

import { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '@lazorkit/wallet-mobile-adapter';
import { 
  Fingerprint, 
  Wallet, 
  Shield, 
  Smartphone, 
  Fuel,
  Lock,
  CloudOff,
  ArrowRight,
  PiggyBank,
  Bolt,
  BadgeCheck
} from 'lucide-react-native';
import { Colors } from '../styles/constants';
import { styles } from '../styles/OnboardingScreen.styles';

// Get device screen width for horizontal scrolling calculations
const { width: screenWidth } = Dimensions.get('window');

// Deep link scheme for wallet connection callbacks
const APP_SCHEME = 'keyless://home';

/**
 * Props interface for OnboardingScreen component
 */
interface OnboardingScreenProps {
  /** Callback function called when onboarding is completed */
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  // Wallet connection hooks from Lazorkit SDK
  const { connect, isConnecting } = useWallet();
  
  // State management for onboarding flow
  const [currentStep, setCurrentStep] = useState(0); // Current onboarding step (0-3)
  const [actionType, setActionType] = useState<'create' | 'login' | null>(null); // Track which action is being performed
  const scrollViewRef = useRef<ScrollView>(null); // Reference for programmatic scrolling

  // Define the onboarding steps configuration
  const onboardingSteps = [
    { type: 'welcome' },   // Step 0: Welcome introduction
    { type: 'gasless' },   // Step 1: Gasless transactions explanation
    { type: 'passkey' },   // Step 2: Passkey security features
    { type: 'ready' },     // Step 3: Ready to create wallet
  ];

  /**
   * Handles navigation to the next onboarding step
   * On the final step, initiates wallet creation
   */
  const handleNext = async () => {
    if (currentStep < onboardingSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Smooth scroll to next page
      scrollViewRef.current?.scrollTo({ x: nextStep * screenWidth, animated: true });
    } else {
      // Final step - create new wallet
      await handleCreateWallet('create');
    }
  };

  /**
   * Handles existing user login flow
   */
  const handleLogin = async () => {
    await handleCreateWallet('login');
  };

  /**
   * Handles scroll events to update current step indicator
   * Automatically updates step based on scroll position
   */
  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const step = Math.round(contentOffset.x / screenWidth);
    if (step !== currentStep && step >= 0 && step < onboardingSteps.length) {
      setCurrentStep(step);
    }
  };

  /**
   * Core wallet creation/login function using Lazorkit SDK
   * @param type - Either 'create' for new users or 'login' for existing users
   */
  const handleCreateWallet = async (type: 'create' | 'login') => {
    setActionType(type); // Track which action is in progress
    try {
      await connect({
        redirectUrl: APP_SCHEME, // Deep link for callback
        onSuccess: (walletInfo) => {
          console.log(`✓ Wallet ${type === 'create' ? 'created' : 'logged in'} successfully:`, walletInfo.smartWallet);
          setActionType(null);
          onComplete(); // Notify parent component of completion
        },
        onFail: (error) => {
          console.error(`✗ Wallet ${type} failed:`, error);
          setActionType(null);
        },
      });
    } catch (error) {
      console.error(`${type} wallet error:`, error);
      setActionType(null);
    }
  };

  /**
   * Skip to final step for users who want to get started quickly
   */
  const handleSkip = () => {
    const lastStep = onboardingSteps.length - 1;
    setCurrentStep(lastStep);
    scrollViewRef.current?.scrollTo({ x: lastStep * screenWidth, animated: true });
  };

  // --- Render Step Components ---
  // Each step is a separate component for better organization and readability
  
  /**
   * Step 1: Welcome Screen
   * Introduces users to the app with a welcoming message and key benefits
   */
  const renderWelcomeStep = () => (
    <View style={styles.stepContent}>
      {/* Visual container with glass panel effect */}
      <View style={styles.visualContainer}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']}
          style={styles.glassPanelSquare}
        >
          <Image 
            source={require('../../assets/welcome-logo.png')}
            style={styles.handImage}
            resizeMode="contain"
          />
          <View style={styles.glassBorderOverlay} />
        </LinearGradient>
      </View>

      {/* Text content explaining the app's core value proposition */}
      <View style={styles.textContainer}>
        <Text style={styles.displayTitle}>Welcome to{'\n'}the Future</Text>
        <Text style={styles.bodyText}>
          No seed phrases, no app downloads, no gas fees. Just secure biometric authentication and instant transactions.
        </Text>
      </View>
    </View>
  );

  /**
   * Step 2: Gasless Transactions
   * Explains the gasless transaction feature - a key differentiator of Lazorkit
   */
  const renderGaslessStep = () => (
    <View style={styles.stepContent}>
      {/* Visual representation of gasless transactions */}
      <View style={styles.visualContainer}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']}
          style={styles.glassPanelCircle}
        >
        <Image 
            source={require('../../assets/gasless.png')}
            style={styles.handImage}
            resizeMode="contain"
          />
        </LinearGradient>
      </View>

      {/* Main messaging about gasless transactions */}
      <View style={styles.textContainer}>
        <Text style={styles.displayTitle}>Gasless Transactions</Text>
        <Text style={styles.subtitleBrand}>Send SOL without paying fees</Text>
        <Text style={styles.bodyText}>
          Lazorkit's paymaster covers all transaction costs. Send SOL even with zero balance.
        </Text>
      </View>

      {/* Benefits list with icons - helps users understand the value */}
      <View style={styles.benefitsContainer}>
        <View style={styles.benefitRow}>
          <View style={styles.iconBadgeOutline}>
            <PiggyBank size={22} color={Colors.textPrimary} />
          </View>
          <View>
            <Text style={styles.benefitTitle}>Zero transaction fees</Text>
            <Text style={styles.benefitSubtitle}>We cover all network costs</Text>
          </View>
        </View>
        <View style={styles.benefitRow}>
          <View style={styles.iconBadgeOutline}>
            <Bolt size={22} color={Colors.textPrimary} />
          </View>
          <View>
            <Text style={styles.benefitTitle}>Instant confirmation</Text>
            <Text style={styles.benefitSubtitle}>Transactions process immediately</Text>
          </View>
        </View>
        <View style={styles.benefitRow}>
          <View style={styles.iconBadgeOutline}>
            <BadgeCheck size={22} color={Colors.textPrimary} />
          </View>
          <View>
            <Text style={styles.benefitTitle}>Beginner friendly</Text>
            <Text style={styles.benefitSubtitle}>No complex setup required</Text>
          </View>
        </View>
      </View>
    </View>
  );

  /**
   * Step 3: Passkey Security
   * Educates users about biometric security and passkey technology
   */
  const renderPasskeyStep = () => (
    <View style={styles.stepContent}>
      {/* Fingerprint visual with security badge */}
      <View style={styles.visualContainer}>
        <View style={[styles.glowUnderlay, { opacity: 0.3 }]} />
         <LinearGradient
          colors={['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']}
          style={styles.glassPanelCircle}
        >
          <Fingerprint size={120} color={Colors.textPrimary} strokeWidth={1} />
          {/* Security badge overlay */}
          <View style={styles.floatingBadge}>
            <Lock size={20} color={Colors.textPrimary} />
          </View>
        </LinearGradient>
      </View>

      {/* Passkey security messaging */}
      <View style={styles.textContainer}>
        <Text style={styles.displayTitle}>Secure with Passkeys</Text>
        <View style={{ gap: 8 }}>
          <Text style={styles.subtitleNormal}>Biometric security for your assets</Text>
          <Text style={styles.bodyText}>
            Passkeys leverage secure hardware. No more passwords to remember, impossible to phish.
          </Text>
        </View>
      </View>

      {/* Security benefits with detailed explanations */}
      <View style={styles.benefitsContainer}>
        <View style={styles.benefitRow}>
          <View style={styles.iconBadgeOutline}>
            <Shield size={22} color={Colors.textPrimary} />
          </View>
          <View>
            <Text style={styles.benefitTitle}>Hardware Encrypted</Text>
            <Text style={styles.benefitSubtitle}>Keys never leave your device</Text>
          </View>
        </View>
        <View style={styles.benefitRow}>
          <View style={styles.iconBadgeOutline}>
            <Smartphone size={22} color={Colors.textPrimary} />
          </View>
          <View>
            <Text style={styles.benefitTitle}>Cross-Device Sync</Text>
            <Text style={styles.benefitSubtitle}>Access wallet on all iCloud devices</Text>
          </View>
        </View>
      </View>
    </View>
  );

  /**
   * Step 4: Ready to Start
   * Final step with call-to-action buttons for wallet creation or login
   */
  const renderReadyStep = () => (
    <View style={styles.stepContent}>
      {/* Wallet icon representing readiness to start */}
      <View style={styles.visualContainer}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']}
          style={styles.glassPanelCircle}
        >
          <Wallet size={80} color={Colors.textPrimary} strokeWidth={1} />
        </LinearGradient>
      </View>

      {/* Call-to-action messaging */}
      <View style={styles.textContainer}>
        <Text style={styles.displayTitle}>Ready to Start?</Text>
        <Text style={styles.subtitleNormal}>Create your wallet in 30 seconds</Text>
        <Text style={styles.bodyText}>
          Tap below to create your secure wallet using your biometric authentication.
        </Text>
      </View>

      {/* Summary of key benefits before wallet creation */}
      <View style={styles.benefitsContainer}>
        <View style={styles.benefitRow}>
          <View style={styles.iconBadgeOutline}>
            <Fingerprint size={22} color={Colors.textPrimary} />
          </View>
          <View>
            <Text style={styles.benefitTitle}>No Seed Phrases</Text>
            <Text style={styles.benefitSubtitle}>Your biometric is your backup</Text>
          </View>
        </View>
        <View style={styles.benefitRow}>
          <View style={styles.iconBadgeOutline}>
            <CloudOff size={22} color={Colors.textPrimary} />
          </View>
          <View>
            <Text style={styles.benefitTitle}>No App Downloads</Text>
            <Text style={styles.benefitSubtitle}>Works directly in this app</Text>
          </View>
        </View>
        <View style={styles.benefitRow}>
          <View style={styles.iconBadgeOutline}>
            <Fuel size={22} color={Colors.textPrimary} />
          </View>
          <View>
            <Text style={styles.benefitTitle}>No Gas Fees</Text>
            <Text style={styles.benefitSubtitle}>We cover all transaction costs</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header: Skip Button - Allows users to jump to final step */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Main Content: Horizontal Scrollable Pages */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Each page is full screen width */}
        <View style={styles.page}>{renderWelcomeStep()}</View>
        <View style={styles.page}>{renderGaslessStep()}</View>
        <View style={styles.page}>{renderPasskeyStep()}</View>
        <View style={styles.page}>{renderReadyStep()}</View>
      </ScrollView>

      {/* Footer: Navigation Controls */}
      <SafeAreaView style={styles.footer}>
        {/* Pagination Dots - Visual indicator of current step */}
        <View style={styles.paginationContainer}>
          {onboardingSteps.map((_, index) => {
            const isActive = index === currentStep;
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  isActive ? styles.dotActive : styles.dotInactive
                ]}
              />
            );
          })}
        </View>

        {/* Action Buttons - Context-sensitive based on current step */}
        <View style={styles.buttonContainer}>
          {currentStep === 3 ? (
            // Final screen: Side-by-side Create/Login buttons
            <View style={styles.sideBySideButtons}>
              <TouchableOpacity
                style={[
                  styles.primaryButtonHalf,
                  isConnecting && styles.buttonDisabled,
                ]}
                onPress={handleNext}
                disabled={isConnecting}
                activeOpacity={0.9}
              >
                {isConnecting && actionType === 'create' ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color="#040401" size="small" />
                    <Text style={styles.loadingTextSmall}>Creating...</Text>
                  </View>
                ) : (
                  <Text style={styles.primaryButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.secondaryButtonHalf,
                  isConnecting && styles.buttonDisabled,
                ]} 
                onPress={handleLogin}
                disabled={isConnecting}
                activeOpacity={0.8}
              >
                {isConnecting && actionType === 'login' ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color={Colors.textPrimary} size="small" />
                    <Text style={styles.loadingTextSmallSecondary}>Logging in...</Text>
                  </View>
                ) : (
                  <Text style={styles.secondaryButtonText}>Login</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            // Other screens: Full-width Continue button
            <TouchableOpacity
              style={[
                styles.primaryButton,
                isConnecting && styles.buttonDisabled,
              ]}
              onPress={handleNext}
              disabled={isConnecting}
              activeOpacity={0.9}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.primaryButtonText}>
                  {currentStep === 0 ? 'Get Started' : 'Continue'}
                </Text>
                {/* Show arrow icon on gasless step for visual continuity */}
                {currentStep === 1 && (
                  <ArrowRight size={16} color={Colors.accentText} style={{ marginLeft: 8 }} />
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}