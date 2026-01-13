# Advanced Features

This guide covers advanced Lazorkit wallet features including multi-token support, DeFi integrations, and custom transaction types.

## Multi-Token Support

### Supporting SPL Tokens

Beyond SOL, you can support any SPL token on Solana:

```typescript
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Get token balance
const getTokenBalance = async (walletAddress: PublicKey, mintAddress: PublicKey) => {
  const connection = new Connection('https://api.devnet.solana.com');
  
  try {
    const tokenAccount = await getAssociatedTokenAddress(mintAddress, walletAddress);
    const balance = await connection.getTokenAccountBalance(tokenAccount);
    return balance.value.uiAmount || 0;
  } catch (error) {
    return 0; // Token account doesn't exist
  }
};
```

### Popular Tokens to Support

- **USDC**: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- **USDT**: `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`
- **SOL**: Native token (no mint address needed)

## DeFi Integrations

### Token Swapping

Integrate with Jupiter for token swaps:

```typescript
// Swap SOL for USDC
const swapTokens = async (inputMint: string, outputMint: string, amount: number) => {
  const jupiterQuoteApi = 'https://quote-api.jup.ag/v6/quote';
  
  // Get quote
  const quoteResponse = await fetch(
    `${jupiterQuoteApi}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}`
  );
  const quoteData = await quoteResponse.json();
  
  // Execute swap with Lazorkit
  const swapTransaction = await createSwapTransaction(quoteData);
  
  return await signAndSendTransaction({
    instructions: swapTransaction.instructions,
    transactionOptions: { feeToken: 'SOL' }
  });
};
```

### Staking Integration

Enable SOL staking for yield:

```typescript
// Stake SOL with a validator
const stakeSOL = async (amount: number, validatorAddress: string) => {
  const stakeInstruction = StakeProgram.createAccount({
    fromPubkey: smartWalletPubkey,
    stakePubkey: stakeAccount.publicKey,
    authorized: {
      staker: smartWalletPubkey,
      withdrawer: smartWalletPubkey,
    },
    lamports: amount * LAMPORTS_PER_SOL,
  });
  
  return await signAndSendTransaction({
    instructions: [stakeInstruction],
    transactionOptions: { feeToken: 'SOL' }
  });
};
```

## Custom Transaction Types

### Batch Transactions

Send multiple transactions in one signature:

```typescript
const batchTransactions = async (recipients: Array<{address: string, amount: number}>) => {
  const instructions = recipients.map(recipient => 
    SystemProgram.transfer({
      fromPubkey: smartWalletPubkey,
      toPubkey: new PublicKey(recipient.address),
      lamports: recipient.amount * LAMPORTS_PER_SOL,
    })
  );
  
  return await signAndSendTransaction({
    instructions,
    transactionOptions: { feeToken: 'SOL' }
  });
};
```

### Subscription Payments

Implement recurring payments:

```typescript
// Create subscription payment
const createSubscription = async (merchantAddress: string, amount: number, interval: number) => {
  // Store subscription details
  const subscription = {
    merchant: merchantAddress,
    amount,
    interval, // in days
    nextPayment: Date.now() + (interval * 24 * 60 * 60 * 1000),
    active: true
  };
  
  // Save to local storage or backend
  await AsyncStorage.setItem('subscriptions', JSON.stringify([subscription]));
  
  // Execute first payment
  return await sendPayment(merchantAddress, amount);
};
```

## Performance Optimizations

### Connection Pooling

Reuse Solana connections for better performance:

```typescript
class ConnectionManager {
  private static instance: Connection;
  
  static getConnection(): Connection {
    if (!this.instance) {
      this.instance = new Connection('https://api.devnet.solana.com', {
        commitment: 'confirmed',
        wsEndpoint: 'wss://api.devnet.solana.com/',
      });
    }
    return this.instance;
  }
}
```

### Caching Strategies

Cache frequently accessed data:

```typescript
const balanceCache = new Map<string, {balance: number, timestamp: number}>();
const CACHE_DURATION = 30000; // 30 seconds

const getCachedBalance = async (address: string): Promise<number> => {
  const cached = balanceCache.get(address);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.balance;
  }
  
  const balance = await fetchBalance(address);
  balanceCache.set(address, { balance, timestamp: now });
  
  return balance;
};
```

## Security Considerations

### Transaction Validation

Always validate transactions before signing:

```typescript
const validateTransaction = (instruction: TransactionInstruction) => {
  // Check instruction type
  if (!ALLOWED_PROGRAMS.includes(instruction.programId.toString())) {
    throw new Error('Unauthorized program');
  }
  
  // Check amount limits
  const amount = extractAmount(instruction);
  if (amount > MAX_TRANSACTION_AMOUNT) {
    throw new Error('Amount exceeds limit');
  }
  
  // Check recipient whitelist (if applicable)
  const recipient = extractRecipient(instruction);
  if (RECIPIENT_WHITELIST.length > 0 && !RECIPIENT_WHITELIST.includes(recipient)) {
    throw new Error('Recipient not authorized');
  }
};
```

### Rate Limiting

Implement transaction rate limiting:

```typescript
class RateLimiter {
  private transactions: number[] = [];
  private readonly maxTransactions = 10;
  private readonly timeWindow = 60000; // 1 minute
  
  canSendTransaction(): boolean {
    const now = Date.now();
    
    // Remove old transactions
    this.transactions = this.transactions.filter(
      time => now - time < this.timeWindow
    );
    
    return this.transactions.length < this.maxTransactions;
  }
  
  recordTransaction(): void {
    this.transactions.push(Date.now());
  }
}
```

## Analytics and Monitoring

### Transaction Tracking

Track user transactions for analytics:

```typescript
const trackTransaction = async (type: string, amount: number, success: boolean) => {
  const event = {
    type,
    amount,
    success,
    timestamp: Date.now(),
    walletAddress: smartWalletPubkey?.toString(),
  };
  
  // Send to analytics service
  await analytics.track('wallet_transaction', event);
};
```

### Error Monitoring

Monitor and report errors:

```typescript
const handleTransactionError = (error: Error, context: any) => {
  // Log error details
  console.error('Transaction failed:', error);
  
  // Report to error tracking service
  errorReporting.captureException(error, {
    tags: { component: 'wallet' },
    extra: context,
  });
  
  // Show user-friendly message
  Alert.alert('Transaction Failed', getUserFriendlyError(error));
};
```

## Testing Advanced Features

### Unit Testing

Test wallet functions:

```typescript
describe('Wallet Functions', () => {
  test('should validate transaction amounts', () => {
    expect(() => validateAmount(-1)).toThrow('Amount must be positive');
    expect(() => validateAmount(0)).toThrow('Amount must be positive');
    expect(() => validateAmount(1000000)).toThrow('Amount too large');
    expect(validateAmount(1)).toBe(true);
  });
  
  test('should format addresses correctly', () => {
    const address = '7xKXtg2CW3...';
    expect(formatAddress(address)).toBe('7xKXtg2C...af40e2d');
  });
});
```

### Integration Testing

Test with real blockchain:

```typescript
describe('Blockchain Integration', () => {
  test('should fetch balance from devnet', async () => {
    const balance = await getBalance(TEST_WALLET_ADDRESS);
    expect(typeof balance).toBe('number');
    expect(balance).toBeGreaterThanOrEqual(0);
  });
  
  test('should send test transaction', async () => {
    const signature = await sendTestTransaction();
    expect(signature).toMatch(/^[A-Za-z0-9]{87,88}$/);
  });
});
```

## Deployment Considerations

### Environment Configuration

Set up different environments:

```typescript
const config = {
  development: {
    rpcUrl: 'https://api.devnet.solana.com',
    paymasterUrl: 'https://kora.devnet.lazorkit.com',
  },
  production: {
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    paymasterUrl: 'https://kora.mainnet.lazorkit.com',
  }
};

const getConfig = () => {
  return __DEV__ ? config.development : config.production;
};
```

### Monitoring and Alerts

Set up monitoring for production:

```typescript
// Monitor transaction success rates
const monitorTransactions = () => {
  const successRate = getTransactionSuccessRate();
  
  if (successRate < 0.95) {
    sendAlert('Low transaction success rate', { rate: successRate });
  }
};

// Monitor paymaster balance
const monitorPaymaster = async () => {
  const balance = await getPaymasterBalance();
  
  if (balance < MINIMUM_PAYMASTER_BALANCE) {
    sendAlert('Low paymaster balance', { balance });
  }
};
```

## Resources

- **Solana Program Library**: [spl.solana.com](https://spl.solana.com/)
- **Jupiter Aggregator**: [jup.ag](https://jup.ag/)
- **Solana Staking**: [docs.solana.com/staking](https://docs.solana.com/staking)
- **Performance Best Practices**: [docs.solana.com/developing/programming-model/transactions](https://docs.solana.com/developing/programming-model/transactions)

This covers the advanced features you can implement with Lazorkit. Start with the basics and gradually add more sophisticated functionality as your users' needs grow.