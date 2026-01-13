# Tutorial 2: Adding Wallet Features - Send, Receive, and Balance

**Learn how to add essential wallet features that let users send money, receive payments, and check their balance - all for free!**

## What You'll Learn

In this tutorial, you'll add:
- 💰 **Balance checking** - Show users how much money they have
- 📤 **Send money** - Let users send cryptocurrency to others (gasless!)
- 📥 **Receive money** - Generate QR codes for receiving payments
- 📋 **Transaction history** - Show past transactions
- 🔄 **Refresh functionality** - Update data in real-time

**Time needed:** 45 minutes  
**Difficulty:** Beginner

## The Magic of Gasless Transactions

**Traditional crypto apps:**
- ✗ Users need cryptocurrency just to pay transaction fees
- ✗ New users can't do anything until they buy crypto first
- ✗ Every transaction costs money (like paying a stamp for each email)

**Your wallet with Lazorkit:**
- ✓ **All transactions are free** for your users
- ✓ **New users can start immediately** - no crypto needed
- ✓ **Lazorkit pays all fees** behind the scenes
- ✓ **Users just focus on using your app**

## Part 1: Checking Wallet Balance

### Understanding Solana Balances

**Solana uses "SOL" as its currency:**
- 1 SOL = 1,000,000,000 lamports (like dollars and cents)
- Balances are stored on the blockchain
- Anyone can check any wallet's balance (it's public)

### Adding Balance Display

**Create a balance component:**

```typescript
import { useState, useEffect } from 'react';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@lazorkit/wallet-mobile-adapter';

function BalanceDisplay() {
  const { smartWalletPubkey, isConnected } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Function to get balance from blockchain
  const fetchBalance = async () => {
    if (!smartWalletPubkey) return; // No wallet connected
    
    setLoading(true);
    try {
      // Connect to Solana blockchain
      const connection = new Connection('https://api.devnet.solana.com');
      
      // Get balance in lamports
      const lamports = await connection.getBalance(smartWalletPubkey);
      
      // Convert to SOL (divide by 1 billion)
      const solBalance = lamports / LAMPORTS_PER_SOL;
      
      setBalance(solBalance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch balance when wallet connects
  useEffect(() => {
    if (isConnected) {
      fetchBalance();
    }
  }, [isConnected, smartWalletPubkey]);

  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceLabel}>Your Balance</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Text style={styles.balanceAmount}>{balance.toFixed(4)} SOL</Text>
      )}
      <TouchableOpacity onPress={fetchBalance} style={styles.refreshButton}>
        <Text>🔄 Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}
```

**What this does:**
1. **Gets the wallet address** from the connected wallet
2. **Connects to Solana blockchain** using the RPC endpoint
3. **Fetches the balance** in lamports (smallest unit)
4. **Converts to SOL** for display (divides by 1 billion)
5. **Shows loading state** while fetching
6. **Provides refresh button** to update balance

## Part 2: Sending Money (Gasless!)

### Understanding Gasless Transactions

**How normal crypto transactions work:**
1. User wants to send 1 SOL to friend
2. User must also pay ~0.000005 SOL as fee
3. If user has 0 SOL, they can't send anything
4. Creates chicken-and-egg problem for new users

**How gasless transactions work:**
1. User wants to send 1 SOL to friend
2. User signs transaction with fingerprint
3. Lazorkit's "paymaster" pays the fee automatically
4. User only needs the SOL they want to send

### Creating the Send Screen

```typescript
import { useState } from 'react';
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@lazorkit/wallet-mobile-adapter';

function SendScreen({ balance }: { balance: number }) {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const sendSOL = async () => {
    // Validation checks
    if (!smartWalletPubkey) {
      Alert.alert('Error', 'Wallet not connected');
      return;
    }

    if (!recipient || !amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Check if recipient address is valid
    try {
      new PublicKey(recipient); // This will throw if invalid
    } catch {
      Alert.alert('Error', 'Invalid recipient address');
      return;
    }

    // Check if amount is valid
    const sendAmount = parseFloat(amount);
    if (isNaN(sendAmount) || sendAmount <= 0) {
      Alert.alert('Error', 'Invalid amount');
      return;
    }

    // Check if user has enough balance
    if (sendAmount > balance) {
      Alert.alert('Error', `Not enough SOL. You have ${balance.toFixed(4)} SOL`);
      return;
    }

    setLoading(true);
    try {
      // Create the transaction instruction
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,           // From user's wallet
        toPubkey: new PublicKey(recipient),      // To recipient
        lamports: sendAmount * LAMPORTS_PER_SOL, // Amount in lamports
      });

      // Send the gasless transaction
      const signature = await signAndSendTransaction(
        {
          instructions: [transferInstruction],
          transactionOptions: {
            feeToken: 'SOL',           // Paymaster pays fee in SOL
            clusterSimulation: 'devnet', // Using test network
          },
        },
        {
          redirectUrl: 'keyless://callback',
          onSuccess: (txSignature) => {
            Alert.alert(
              'Success! 🎉', 
              `Transaction sent!\nSignature: ${txSignature.slice(0, 8)}...`
            );
            // Clear form
            setAmount('');
            setRecipient('');
          },
          onFail: (error) => {
            Alert.alert('Transaction Failed', error.message);
          },
        }
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.sendContainer}>
      <Text style={styles.title}>Send SOL</Text>
      
      {/* Recipient Address Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Recipient Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Solana address (starts with letters/numbers)"
          value={recipient}
          onChangeText={setRecipient}
          autoCapitalize="none"
        />
      </View>

      {/* Amount Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Amount (SOL)</Text>
        <View style={styles.amountRow}>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
          <TouchableOpacity 
            onPress={() => setAmount((balance - 0.001).toFixed(4))}
            style={styles.maxButton}
          >
            <Text>MAX</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.balanceText}>
          Available: {balance.toFixed(4)} SOL
        </Text>
      </View>

      {/* Gasless Notice */}
      <View style={styles.gaslessNotice}>
        <Text style={styles.gaslessTitle}>⚡ Free Transaction</Text>
        <Text style={styles.gaslessText}>
          No fees! Lazorkit covers all transaction costs.
        </Text>
      </View>

      {/* Send Button */}
      <TouchableOpacity
        style={[styles.sendButton, loading && styles.sendButtonDisabled]}
        onPress={sendSOL}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.sendButtonText}>Send SOL</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
```

**What happens when user sends money:**
1. **User enters recipient and amount**
2. **App validates the inputs** (valid address, sufficient balance)
3. **Creates transaction instruction** (move X SOL from A to B)
4. **User confirms with fingerprint** (signs the transaction)
5. **Lazorkit pays the fee** (gasless transaction)
6. **Money is transferred** on the blockchain
7. **User sees success message** with transaction ID

## Part 3: Receiving Money with QR Codes

### Why QR Codes?

**QR codes make receiving money easy:**
- ✓ **No typing long addresses** - just scan and send
- ✓ **Reduces errors** - no chance of typos in addresses
- ✓ **Works with any wallet** - standard format
- ✓ **Quick and convenient** - like Venmo or Cash App

### Creating the Receive Screen

```typescript
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';

function ReceiveScreen({ walletAddress }: { walletAddress: string }) {
  const copyAddress = async () => {
    await Clipboard.setStringAsync(walletAddress);
    Alert.alert('Copied!', 'Wallet address copied to clipboard');
  };

  const formatAddress = (address: string) => {
    // Show first 8 and last 8 characters
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <View style={styles.receiveContainer}>
      <Text style={styles.title}>Receive SOL</Text>
      
      {/* QR Code */}
      <View style={styles.qrCard}>
        <Text style={styles.qrTitle}>Scan to Send SOL</Text>
        <View style={styles.qrContainer}>
          <QRCode
            value={walletAddress}  // The wallet address
            size={200}             // Size of QR code
            backgroundColor="white"
            color="black"
          />
        </View>
      </View>

      {/* Address Display */}
      <View style={styles.addressCard}>
        <Text style={styles.addressLabel}>Your Wallet Address</Text>
        
        {/* Shortened address for display */}
        <TouchableOpacity onPress={copyAddress} style={styles.addressButton}>
          <Text style={styles.addressText}>{formatAddress(walletAddress)}</Text>
          <Text style={styles.copyIcon}>📋</Text>
        </TouchableOpacity>
        
        {/* Full address (selectable) */}
        <Text style={styles.fullAddress} selectable>
          {walletAddress}
        </Text>
        
        <TouchableOpacity onPress={copyAddress} style={styles.copyButton}>
          <Text style={styles.copyButtonText}>Copy Address</Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>How to Receive SOL</Text>
        <Text style={styles.instructionText}>
          1. Share this QR code with the sender
        </Text>
        <Text style={styles.instructionText}>
          2. Or copy and share your wallet address
        </Text>
        <Text style={styles.instructionText}>
          3. Money will appear in your wallet automatically
        </Text>
      </View>

      {/* Safety Notice */}
      <View style={styles.safetyNotice}>
        <Text style={styles.safetyTitle}>⚠️ Important</Text>
        <Text style={styles.safetyText}>
          Only accept SOL or SPL tokens. This is a Devnet address for testing.
        </Text>
      </View>
    </View>
  );
}
```

**How receiving works:**
1. **Your app shows QR code** containing wallet address
2. **Sender scans QR code** with their wallet app
3. **Sender enters amount** and confirms transaction
4. **Money appears in your wallet** automatically
5. **Your balance updates** when you refresh

## Part 4: Getting Test Money

### Using the Solana Faucet

**Since we're on devnet (test network), money isn't real:**

```typescript
function GetTestSOL({ walletAddress }: { walletAddress: string }) {
  const openFaucet = () => {
    const faucetUrl = `https://faucet.solana.com/?address=${walletAddress}`;
    Linking.openURL(faucetUrl);
  };

  return (
    <View style={styles.faucetCard}>
      <Text style={styles.faucetTitle}>Need Test SOL?</Text>
      <Text style={styles.faucetText}>
        Get free test SOL to try out your wallet features
      </Text>
      <TouchableOpacity onPress={openFaucet} style={styles.faucetButton}>
        <Text style={styles.faucetButtonText}>Get Free SOL</Text>
      </TouchableOpacity>
    </View>
  );
}
```

**How to get test money:**
1. **Tap "Get Free SOL"** - opens Solana faucet website
2. **Complete captcha** - proves you're human
3. **Receive 1-2 SOL** - appears in your wallet in ~30 seconds
4. **Use for testing** - send to friends, test features

## Part 5: Transaction History

### Fetching Transaction History

```typescript
import { Connection } from '@solana/web3.js';

function TransactionHistory({ walletAddress }: { walletAddress: string }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    try {
      const connection = new Connection('https://api.devnet.solana.com');
      const pubkey = new PublicKey(walletAddress);
      
      // Get recent transaction signatures
      const signatures = await connection.getSignaturesForAddress(pubkey, {
        limit: 10, // Last 10 transactions
      });

      // Get transaction details
      const transactionDetails = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await connection.getTransaction(sig.signature);
          
          // Determine if this was sent or received
          const preBalance = tx?.meta?.preBalances?.[0] || 0;
          const postBalance = tx?.meta?.postBalances?.[0] || 0;
          const balanceChange = (postBalance - preBalance) / LAMPORTS_PER_SOL;
          
          return {
            signature: sig.signature,
            type: balanceChange > 0 ? 'received' : 'sent',
            amount: Math.abs(balanceChange).toFixed(4),
            date: new Date(sig.blockTime! * 1000).toLocaleDateString(),
            status: sig.err ? 'failed' : 'success',
          };
        })
      );

      setTransactions(transactionDetails);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [walletAddress]);

  return (
    <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>Recent Transactions</Text>
      
      {loading ? (
        <Text>Loading transactions...</Text>
      ) : transactions.length === 0 ? (
        <Text style={styles.emptyText}>No transactions yet</Text>
      ) : (
        transactions.map((tx, index) => (
          <View key={index} style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <Text>{tx.type === 'sent' ? '📤' : '📥'}</Text>
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionType}>
                {tx.type === 'sent' ? 'Sent' : 'Received'}
              </Text>
              <Text style={styles.transactionDate}>{tx.date}</Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text style={[
                styles.transactionValue,
                tx.type === 'sent' ? styles.sentAmount : styles.receivedAmount
              ]}>
                {tx.type === 'sent' ? '-' : '+'}{tx.amount} SOL
              </Text>
              <Text style={styles.transactionStatus}>{tx.status}</Text>
            </View>
          </View>
        ))
      )}
      
      <TouchableOpacity onPress={fetchTransactions} style={styles.refreshButton}>
        <Text>🔄 Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## Part 6: Putting It All Together

### Main Wallet Screen

```typescript
function WalletScreen() {
  const { isConnected, smartWalletPubkey } = useWallet();
  const [currentScreen, setCurrentScreen] = useState('wallet');
  const [balance, setBalance] = useState(0);

  const walletAddress = smartWalletPubkey?.toString() || '';

  if (!isConnected) {
    return <ConnectScreen />; // From Tutorial 1
  }

  return (
    <View style={styles.container}>
      {currentScreen === 'wallet' && (
        <View>
          {/* Balance Display */}
          <BalanceDisplay />
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              onPress={() => setCurrentScreen('send')}
              style={styles.actionButton}
            >
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionText}>Send</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setCurrentScreen('receive')}
              style={styles.actionButton}
            >
              <Text style={styles.actionIcon}>📥</Text>
              <Text style={styles.actionText}>Receive</Text>
            </TouchableOpacity>
          </View>

          {/* Get Test SOL */}
          <GetTestSOL walletAddress={walletAddress} />
          
          {/* Transaction History */}
          <TransactionHistory walletAddress={walletAddress} />
        </View>
      )}

      {currentScreen === 'send' && (
        <SendScreen 
          balance={balance}
          onBack={() => setCurrentScreen('wallet')}
        />
      )}

      {currentScreen === 'receive' && (
        <ReceiveScreen 
          walletAddress={walletAddress}
          onBack={() => setCurrentScreen('wallet')}
        />
      )}
    </View>
  );
}
```

## Testing Your Wallet Features

### Step 1: Test Balance Display

1. **Open your app** and connect wallet
2. **Check balance shows 0.0000 SOL** initially
3. **Tap refresh** - should work without errors
4. **Get test SOL** from faucet
5. **Refresh balance** - should show new amount

### Step 2: Test Receiving Money

1. **Go to receive screen**
2. **Check QR code displays** properly
3. **Copy address** - should copy to clipboard
4. **Use faucet** to send test SOL to your address
5. **Refresh balance** - should increase

### Step 3: Test Sending Money

1. **Create second wallet** (different device or reset app)
2. **Get test SOL** in first wallet
3. **Try sending to second wallet** address
4. **Use fingerprint** to confirm transaction
5. **Check both balances** update correctly

### Step 4: Test Transaction History

1. **After sending/receiving** some transactions
2. **Check history screen** shows transactions
3. **Verify sent transactions** show as negative
4. **Verify received transactions** show as positive
5. **Check dates and amounts** are correct

## Common Issues and Solutions

### "Balance doesn't update"

**Possible causes:**
- Network connection issues
- Wrong RPC endpoint
- Wallet address not found

**Solutions:**
1. Check internet connection
2. Verify wallet address is correct
3. Try refreshing manually
4. Check console for error messages

### "Transaction fails"

**Possible causes:**
- Insufficient balance
- Invalid recipient address
- Network issues
- Paymaster problems

**Solutions:**
1. Check balance is sufficient
2. Verify recipient address format
3. Try again after a few minutes
4. Check error message for specific issue

### "QR code doesn't work"

**Possible causes:**
- QR code library not installed
- Wallet address is empty
- Display issues

**Solutions:**
1. Install QR code library: `bun add react-native-qrcode-svg`
2. Check wallet address is not empty
3. Test QR code with online scanner

### "Can't copy address"

**Possible causes:**
- Clipboard library not installed
- Permissions issues

**Solutions:**
1. Install clipboard library: `bun add expo-clipboard`
2. Test on physical device (not emulator)

## Understanding the User Experience

### New User Journey

**Day 1: First time using wallet**
1. Creates wallet with fingerprint
2. Sees 0 SOL balance
3. Gets test SOL from faucet
4. Sees balance update to 1-2 SOL
5. Tries sending small amount to friend

**Day 2: Regular usage**
1. Opens app - automatically connected
2. Checks balance - sees recent transactions
3. Receives payment via QR code
4. Sends money to pay someone back

### What Makes This Special

**Compared to traditional wallets:**
- ✗ **Traditional:** Download MetaMask → Create seed phrase → Buy ETH for gas → Finally use app
- ✓ **Your wallet:** Open app → Use fingerprint → Start using immediately

**User benefits:**
- 🚀 **Instant onboarding** - no complex setup
- 💸 **Free transactions** - never pay fees
- 🔒 **Secure by default** - biometric authentication
- 📱 **Native experience** - feels like any other app

## Next Steps

### What You've Accomplished

✓ **Balance checking** - Users can see their SOL balance  
✓ **Gasless sending** - Users can send money for free  
✓ **QR code receiving** - Easy way to receive payments  
✓ **Transaction history** - Users can see past activity  
✓ **Test money integration** - Easy way to get started  

### Advanced Features to Add

**Tutorial 3: Message Signing**
- Sign messages for authentication
- Prove wallet ownership
- Login to websites with wallet

**Tutorial 4: Multi-token Support**
- Support USDC and other tokens
- Token swapping
- Portfolio tracking

**Custom Features for Your App**
- Subscription payments
- Loyalty rewards
- In-app purchases
- Social payments

### Customization Ideas

**For different use cases:**

**Gaming app:**
```typescript
// Custom transaction for buying in-game items
const buyItem = async (itemId: string, price: number) => {
  // Send SOL to game's wallet
  // Include item ID in transaction memo
  // Update user's inventory
};
```

**Social app:**
```typescript
// Send money to friends with message
const sendToFriend = async (friendAddress: string, amount: number, message: string) => {
  // Include message in transaction
  // Notify friend of payment
  // Update social feed
};
```

**E-commerce app:**
```typescript
// Pay for products with crypto
const payForOrder = async (orderId: string, total: number) => {
  // Send payment to merchant
  // Include order ID
  // Update order status
};
```

## Security Best Practices

### Input Validation

**Always validate user inputs:**
```typescript
const validateSendInputs = (recipient: string, amount: string) => {
  // Check recipient address format
  if (!isValidSolanaAddress(recipient)) {
    throw new Error('Invalid recipient address');
  }
  
  // Check amount is positive number
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Amount must be a positive number');
  }
  
  // Check reasonable limits
  if (numAmount > 1000) {
    throw new Error('Amount too large for single transaction');
  }
  
  return { recipient, amount: numAmount };
};
```

### Error Handling

**Provide helpful error messages:**
```typescript
const handleTransactionError = (error: any) => {
  if (error.message.includes('Insufficient funds')) {
    Alert.alert('Not Enough SOL', 'You need more SOL to complete this transaction.');
  } else if (error.message.includes('Invalid recipient')) {
    Alert.alert('Invalid Address', 'Please check the recipient address and try again.');
  } else if (error.message.includes('Network error')) {
    Alert.alert('Connection Problem', 'Please check your internet and try again.');
  } else {
    Alert.alert('Transaction Failed', 'Something went wrong. Please try again.');
  }
};
```

### Rate Limiting

**Prevent spam transactions:**
```typescript
let lastTransactionTime = 0;
const MIN_TRANSACTION_INTERVAL = 10000; // 10 seconds

const checkRateLimit = () => {
  const now = Date.now();
  if (now - lastTransactionTime < MIN_TRANSACTION_INTERVAL) {
    throw new Error('Please wait before sending another transaction');
  }
  lastTransactionTime = now;
};
```

## Resources

**Solana Development:**
- [Solana Cookbook](https://solanacookbook.com/) - Code examples and guides
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/) - JavaScript SDK

**React Native Libraries:**
- [React Native QR Code](https://github.com/rosskhanas/react-native-qrcode-svg) - QR code generation
- [Expo Clipboard](https://docs.expo.dev/versions/latest/sdk/clipboard/) - Copy to clipboard

**Testing Tools:**
- [Solana Explorer](https://explorer.solana.com/?cluster=devnet) - View transactions
- [Solana Faucet](https://faucet.solana.com/) - Get test SOL

---

**Congratulations!** 🎉 You now have a fully functional wallet with all essential features. Users can check balances, send money for free, receive payments via QR codes, and view their transaction history.

**Key achievement:** Your users can now do everything they need with cryptocurrency, without any of the complexity of traditional crypto wallets.

**Next:** Learn how to add message signing for authentication and advanced features in Tutorial 3!

---

*Questions about wallet features? Check out the other tutorials or reach out to the Lazorkit community for help.*
