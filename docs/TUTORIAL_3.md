# Tutorial 3: Gasless Transactions Deep Dive

**Master Lazorkit's paymaster system for seamless user experiences without gas fees**

This tutorial explains how to implement gasless transactions that eliminate the barrier of requiring SOL for gas fees, making your app accessible to any user regardless of their SOL balance.

## The Gas Fee Problem

Traditional Solana apps face a UX barrier:

```
New User Journey (Traditional):
1. User wants to try your app
2. Needs SOL for gas fees first
3. Must buy SOL on exchange
4. Transfer to wallet
5. Finally can use your app
✗ 90% of users drop off
```

## Lazorkit's Solution: Paymaster

```
New User Journey (Lazorkit):
1. User wants to try your app
2. Creates passkey with biometric
3. Immediately starts using app
✓ Seamless onboarding
```

## How Paymaster Works

### 1. Transaction Sponsorship

The paymaster is a service that:
- Monitors transaction requests
- Pays SOL gas fees on behalf of users
- Optionally accepts alternative fee tokens (USDC)
- Ensures transactions are properly authorized

### 2. Security Model

```typescript
// User signs transaction with passkey
const userSignature = await signWithPasskey(transaction);

// Paymaster verifies signature and sponsors gas
const paymasterSignature = await paymaster.sponsor(transaction, userSignature);

// Both signatures are required for execution
const finalTransaction = combineSignatures(userSignature, paymasterSignature);
```

## Implementing Gasless SOL Transfer

### Complete Implementation

```typescript
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@lazorkit/wallet-mobile-adapter';

function GaslessSendScreen() {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const sendSOL = async () => {
    if (!smartWalletPubkey || !recipient || !amount) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // Validate recipient address
    try {
      new PublicKey(recipient);
    } catch {
      Alert.alert('Error', 'Invalid recipient address');
      return;
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Invalid amount');
      return;
    }

    setLoading(true);
    try {
      // Create transfer instruction
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: new PublicKey(recipient),
        lamports: amountNum * LAMPORTS_PER_SOL,
      });

      // Execute gasless transaction
      const signature = await signAndSendTransaction(
        {
          instructions: [transferInstruction],
          // Paymaster configuration
          transactionOptions: {
            feeToken: 'SOL',  // or 'USDC' to pay fees with USDC
            clusterSimulation: 'devnet',
          },
        },
        {
          redirectUrl: 'keyless://callback',
          onSuccess: (txSignature) => {
            console.log('✓ Transaction successful:', txSignature);
            Alert.alert(
              'Success! 🎉',
              `Transaction sent successfully!\n\nSignature: ${txSignature.slice(0, 8)}...`,
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          },
          onFail: (error) => {
            console.error('✗ Transaction failed:', error);
            Alert.alert('Transaction Failed', error.message || 'Unknown error');
          },
        }
      );

      return signature;
    } catch (error: any) {
      console.error('Send error:', error);
      Alert.alert('Error', error.message || 'Failed to send transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send SOL (Gasless)</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>🎯 Zero Gas Fees</Text>
        <Text style={styles.infoText}>
          This transaction is sponsored by Lazorkit's paymaster. 
          You don't need SOL for gas fees!
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Recipient Address"
        value={recipient}
        onChangeText={setRecipient}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Amount (SOL)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      <TouchableOpacity
        style={[styles.sendButton, loading && styles.sendButtonDisabled]}
        onPress={sendSOL}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.sendIcon}>⚡</Text>
            <Text style={styles.sendButtonText}>Send (Gasless)</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
```

## Advanced Paymaster Features

### 1. Fee Token Selection

Pay gas fees with different tokens:

```typescript
// Pay with SOL (default)
transactionOptions: {
  feeToken: 'SOL',
}

// Pay with USDC
transactionOptions: {
  feeToken: 'USDC',
}

// Pay with any SPL token
transactionOptions: {
  feeToken: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mint
}
```

### 2. Transaction Batching

Send multiple instructions in one gasless transaction:

```typescript
const instructions = [
  // Transfer SOL
  SystemProgram.transfer({
    fromPubkey: smartWalletPubkey,
    toPubkey: new PublicKey(recipient1),
    lamports: 0.1 * LAMPORTS_PER_SOL,
  }),
  
  // Transfer to another recipient
  SystemProgram.transfer({
    fromPubkey: smartWalletPubkey,
    toPubkey: new PublicKey(recipient2),
    lamports: 0.2 * LAMPORTS_PER_SOL,
  }),
];

await signAndSendTransaction({
  instructions,
  transactionOptions: { feeToken: 'SOL' },
});
```

### 3. Custom Paymaster Configuration

Configure your own paymaster:

```typescript
<LazorKitProvider
  rpcUrl="https://api.devnet.solana.com"
  portalUrl="https://portal.lazor.sh"
  configPaymaster={{
    paymasterUrl: "https://your-custom-paymaster.com",
    // Optional: API key for private paymaster
    apiKey: "your-api-key",
  }}
>
```

## Error Handling for Gasless Transactions

### Common Errors and Solutions

```typescript
try {
  await signAndSendTransaction(/* ... */);
} catch (error) {
  if (error.message.includes('Paymaster rejected')) {
    // Paymaster declined to sponsor (insufficient funds, rate limit, etc.)
    Alert.alert(
      'Transaction Declined',
      'The paymaster cannot sponsor this transaction. Please try again later.'
    );
  } else if (error.message.includes('Insufficient funds')) {
    // User doesn't have enough tokens to send
    Alert.alert('Insufficient Balance', 'You don\'t have enough SOL to send.');
  } else if (error.message.includes('User rejected')) {
    // User cancelled biometric authentication
    Alert.alert('Cancelled', 'Transaction was cancelled.');
  } else if (error.message.includes('Invalid recipient')) {
    // Invalid Solana address
    Alert.alert('Invalid Address', 'Please check the recipient address.');
  } else {
    // Generic error
    Alert.alert('Transaction Failed', 'Please try again.');
    console.error('Transaction error:', error);
  }
}
```

## Paymaster Rate Limits

Most paymasters implement rate limiting to prevent abuse:

```typescript
// Check paymaster status before transaction
const checkPaymasterStatus = async () => {
  try {
    const response = await fetch('https://kora.devnet.lazorkit.com/status');
    const status = await response.json();
    
    if (status.rateLimited) {
      Alert.alert(
        'Rate Limited',
        `Please wait ${status.resetTime} seconds before next transaction.`
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn('Could not check paymaster status:', error);
    return true; // Proceed anyway
  }
};

// Use before transactions
const sendSOL = async () => {
  const canProceed = await checkPaymasterStatus();
  if (!canProceed) return;
  
  // Proceed with transaction...
};
```

## Testing Gasless Transactions

### 1. Devnet Testing Strategy

**Test Environment Setup:**
```typescript
const DEVNET_CONFIG = {
  RPC_URL: 'https://api.devnet.solana.com',
  PAYMASTER_URL: 'https://kora.devnet.lazorkit.com',
  NETWORK: 'devnet',
};

// Progressive testing amounts
const TEST_AMOUNTS = {
  MICRO: 0.001,    // 1,000 lamports - basic functionality
  SMALL: 0.01,     // 10,000 lamports - normal usage
  MEDIUM: 0.1,     // 100,000 lamports - larger transactions
  LARGE: 1.0,      // 1 SOL - stress testing
};
```

**Testing Workflow:**
```typescript
const runGaslessTests = async () => {
  const testWallet = 'RECIPIENT_ADDRESS_HERE';
  
  // Test 1: Micro transaction
  console.log('🧪 Testing micro transaction...');
  await testGaslessTransfer(testWallet, TEST_AMOUNTS.MICRO);
  
  // Test 2: Batch transactions
  console.log('🧪 Testing batch transactions...');
  await testBatchTransfer([testWallet], TEST_AMOUNTS.SMALL);
  
  // Test 3: Rate limiting
  console.log('🧪 Testing rate limits...');
  await testRateLimiting(testWallet, TEST_AMOUNTS.MICRO);
  
  // Test 4: Error handling
  console.log('🧪 Testing error scenarios...');
  await testErrorScenarios();
};
```

### 2. Production Deployment Checklist

**Pre-Mainnet Validation:**
```typescript
const MAINNET_CONFIG = {
  RPC_URL: 'https://api.mainnet-beta.solana.com',
  PAYMASTER_URL: 'https://kora.mainnet.lazorkit.com', // Verify URL
  NETWORK: 'mainnet-beta',
  MAX_TRANSACTION_AMOUNT: 1.0, // SOL limit for safety
};

// Enhanced validation for production
const validateProductionTransaction = (amount: number, recipient: string) => {
  // Amount validation
  if (amount > MAINNET_CONFIG.MAX_TRANSACTION_AMOUNT) {
    throw new Error(`Amount exceeds limit: ${MAINNET_CONFIG.MAX_TRANSACTION_AMOUNT} SOL`);
  }
  
  // Recipient validation
  if (!isValidSolanaAddress(recipient)) {
    throw new Error('Invalid recipient address');
  }
  
  // Additional security checks
  if (isKnownMaliciousAddress(recipient)) {
    throw new Error('Recipient address flagged as malicious');
  }
  
  return true;
};
```

**Mainnet Safety Features:**
```typescript
const SAFETY_FEATURES = {
  // Transaction limits
  DAILY_LIMIT: 10.0,        // Max SOL per day
  HOURLY_LIMIT: 2.0,        // Max SOL per hour
  SINGLE_TX_LIMIT: 1.0,     // Max SOL per transaction
  
  // Rate limiting
  MIN_INTERVAL: 30000,      // 30 seconds between transactions
  MAX_PENDING: 3,           // Max pending transactions
  
  // Confirmation requirements
  REQUIRE_DOUBLE_CONFIRM: true,  // For amounts > 0.5 SOL
  BIOMETRIC_REAUTH: true,        // Re-authenticate for large amounts
};
```

### 3. Monitoring and Analytics

**Transaction Tracking:**
```typescript
const trackGaslessTransaction = async (txData: TransactionData) => {
  const metrics = {
    timestamp: Date.now(),
    amount: txData.amount,
    recipient: txData.recipient,
    paymaster_used: true,
    network: 'devnet', // or 'mainnet-beta'
    user_id: getUserId(),
    session_id: getSessionId(),
  };
  
  // Send to analytics service
  await analytics.track('gasless_transaction_initiated', metrics);
  
  // Monitor success/failure
  try {
    const signature = await executeTransaction(txData);
    await analytics.track('gasless_transaction_success', {
      ...metrics,
      signature,
      confirmation_time: Date.now() - metrics.timestamp,
    });
  } catch (error) {
    await analytics.track('gasless_transaction_failed', {
      ...metrics,
      error: error.message,
      error_code: error.code,
    });
  }
};
```

**Paymaster Health Monitoring:**
```typescript
const monitorPaymasterHealth = async () => {
  try {
    const response = await fetch(`${PAYMASTER_URL}/health`);
    const health = await response.json();
    
    return {
      status: health.status,
      balance: health.balance,
      rate_limit: health.rate_limit,
      last_check: Date.now(),
    };
  } catch (error) {
    console.error('Paymaster health check failed:', error);
    return { status: 'unhealthy', error: error.message };
  }
};

// Check paymaster before critical transactions
const ensurePaymasterReady = async () => {
  const health = await monitorPaymasterHealth();
  
  if (health.status !== 'healthy') {
    throw new Error('Paymaster unavailable. Please try again later.');
  }
  
  if (health.balance < 0.1) {
    console.warn('Paymaster balance low:', health.balance);
  }
  
  return true;
};
```

## Building Your Own Paymaster

For production apps, consider running your own paymaster:

### 1. Paymaster Requirements

- Solana wallet with SOL balance
- Server to handle transaction requests
- Rate limiting and abuse prevention
- User authentication/authorization

### 2. Basic Paymaster Logic

```typescript
// Simplified paymaster server logic
app.post('/sponsor-transaction', async (req, res) => {
  const { transaction, userSignature } = req.body;
  
  // 1. Validate user signature
  const isValidUser = await validateUserSignature(userSignature);
  if (!isValidUser) {
    return res.status(401).json({ error: 'Invalid user signature' });
  }
  
  // 2. Check rate limits
  const isRateLimited = await checkRateLimit(req.ip);
  if (isRateLimited) {
    return res.status(429).json({ error: 'Rate limited' });
  }
  
  // 3. Sponsor transaction
  const paymasterSignature = await sponsorTransaction(transaction);
  
  res.json({ paymasterSignature });
});
```

## Best Practices

### 1. User Education

Educate users about gasless transactions:

```typescript
const GaslessInfo = () => (
  <View style={styles.infoCard}>
    <Text style={styles.infoTitle}>⚡ Gasless Transactions</Text>
    <Text style={styles.infoText}>
      This app covers all transaction fees for you. No need to buy SOL for gas!
    </Text>
  </View>
);
```

### 2. Fallback Mechanisms

Implement fallbacks when paymaster is unavailable:

```typescript
const sendWithFallback = async () => {
  try {
    // Try gasless first
    await signAndSendTransaction({
      instructions,
      transactionOptions: { feeToken: 'SOL' },
    });
  } catch (error) {
    if (error.message.includes('Paymaster unavailable')) {
      // Fallback to user-paid transaction
      Alert.alert(
        'Paymaster Unavailable',
        'Would you like to pay the gas fee yourself?',
        [
          { text: 'Cancel' },
          { text: 'Pay Gas', onPress: () => sendWithUserGas() },
        ]
      );
    }
  }
};
```

### 3. Transaction Monitoring

Monitor transaction success rates:

```typescript
const trackTransaction = async (signature: string) => {
  // Analytics tracking
  analytics.track('gasless_transaction_sent', {
    signature,
    timestamp: Date.now(),
  });
  
  // Monitor confirmation
  const connection = new Connection(RPC_URL);
  const confirmation = await connection.confirmTransaction(signature);
  
  analytics.track('gasless_transaction_confirmed', {
    signature,
    confirmed: !confirmation.value.err,
  });
};
```

## Next Steps

You now understand gasless transactions! Next, learn about:

- [Tutorial 4: Message Signing & Authentication](./TUTORIAL_4.md)
- Advanced DeFi integrations with gasless swaps
- Building subscription services with automated payments

## Resources

- [Solana Transaction Fees](https://docs.solana.com/transaction_fees)
- [Lazorkit Paymaster Docs](https://docs.lazorkit.com/paymaster)
- [WebAuthn Specification](https://w3c.github.io/webauthn/)