# Tutorial 4: Message Signing & Authentication

**Implement secure message signing with passkeys for authentication and verification**

This tutorial shows how to use Lazorkit's message signing capabilities to authenticate users, verify ownership, and create secure communication protocols.

## Why Message Signing Matters

Message signing enables:

- **Wallet Ownership Proof** - Verify users own a specific wallet
- **Authentication** - Login without passwords using wallet signatures
- **Data Integrity** - Ensure messages haven't been tampered with
- **Off-Chain Verification** - Authenticate without blockchain transactions

## How Message Signing Works

### 1. Cryptographic Process

```
1. User creates message: "I own wallet ABC123"
2. Message is hashed: SHA-256(message)
3. Hash is signed with passkey: signature = sign(hash, privateKey)
4. Anyone can verify: verify(signature, hash, publicKey) = true/false
```

### 2. Passkey Integration

With Lazorkit, the signing happens with biometric authentication:

```typescript
const signature = await signMessage("Hello World", {
  redirectUrl: 'myapp://callback',
  onSuccess: (result) => {
    // result.signature - cryptographic signature
    // result.signedPayload - complete signed message
  }
});
```

## Complete Message Signing Implementation

### SignMessageScreen Component

```typescript
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useWallet } from '@lazorkit/wallet-mobile-adapter';
import * as Clipboard from 'expo-clipboard';

export function SignMessageScreen({ onBack }: { onBack: () => void }) {
  const { signMessage, isConnected, smartWalletPubkey } = useWallet();
  
  const [message, setMessage] = useState('Welcome to Lazorkit! This proves I own this wallet.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    signature: string;
    signedPayload: string;
    originalMessage: string;
  } | null>(null);

  // Predefined message templates
  const messageTemplates = [
    'I own this wallet address',
    'Authenticating with my passkey',
    'Proving wallet ownership for login',
    'Signed message for verification',
  ];

  const handleSignMessage = async () => {
    if (!isConnected) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message to sign');
      return;
    }

    setLoading(true);
    try {
      const signResult = await signMessage(message, {
        redirectUrl: 'keyless://callback',
        onSuccess: (res) => {
          console.log('✅ Message signed successfully');
          setResult({
            signature: res.signature,
            signedPayload: res.signedPayload,
            originalMessage: message,
          });
        },
        onFail: (error) => {
          console.error('❌ Message signing failed:', error);
          Alert.alert('Signing Failed', error.message || 'Unknown error');
        },
      });

      // Handle direct return (if not using callbacks)
      if (signResult) {
        setResult({
          signature: signResult.signature,
          signedPayload: signResult.signedPayload,
          originalMessage: message,
        });
      }
    } catch (error: any) {
      console.error('Sign message error:', error);
      Alert.alert('Error', error.message || 'Failed to sign message');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', `${label} copied to clipboard`);
  };

  const verifySignature = () => {
    if (!result) return;
    
    Alert.alert(
      'Signature Verification',
      `This signature can be verified by anyone to prove that the wallet ${smartWalletPubkey?.toString().slice(0, 8)}... signed the message "${result.originalMessage}"`
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Sign Message</Text>
      </View>

      {!result ? (
        // Message Input Screen
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>🔐 Cryptographic Signing</Text>
            <Text style={styles.infoText}>
              Sign messages with your passkey to prove wallet ownership without revealing private keys.
            </Text>
          </View>

          <Text style={styles.label}>Message to Sign</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter your message..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Quick Templates</Text>
          <View style={styles.templates}>
            {messageTemplates.map((template, index) => (
              <TouchableOpacity
                key={index}
                style={styles.template}
                onPress={() => setMessage(template)}
              >
                <Text style={styles.templateText}>{template}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.signButton, loading && styles.signButtonDisabled]}
            onPress={handleSignMessage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.signIcon}>✍️</Text>
                <Text style={styles.signButtonText}>Sign with Passkey</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        // Results Screen
        <View style={styles.content}>
          <View style={styles.successCard}>
            <Text style={styles.successTitle}>✅ Message Signed Successfully!</Text>
            <Text style={styles.successText}>
              Your message has been cryptographically signed with your passkey.
            </Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Original Message:</Text>
            <Text style={styles.resultText}>{result.originalMessage}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Signature:</Text>
            <View style={styles.copyableField}>
              <Text style={styles.hashText} numberOfLines={2}>
                {result.signature}
              </Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(result.signature, 'Signature')}
                style={styles.copyButton}
              >
                <Text style={styles.copyIcon}>📋</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Signed Payload:</Text>
            <View style={styles.copyableField}>
              <Text style={styles.hashText} numberOfLines={2}>
                {result.signedPayload}
              </Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(result.signedPayload, 'Signed Payload')}
                style={styles.copyButton}
              >
                <Text style={styles.copyIcon}>📋</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.verifyButton} onPress={verifySignature}>
              <Text style={styles.verifyButtonText}>How to Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.newMessageButton}
              onPress={() => {
                setResult(null);
                setMessage('');
              }}
            >
              <Text style={styles.newMessageButtonText}>Sign New Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
```

## Authentication Use Cases

### 1. Login Authentication

```typescript
// Server-side verification endpoint
app.post('/auth/wallet-login', async (req, res) => {
  const { walletAddress, message, signature, signedPayload } = req.body;
  
  // Verify the signature matches the wallet
  const isValid = await verifyWalletSignature({
    walletAddress,
    message,
    signature,
    signedPayload,
  });
  
  if (isValid) {
    // Generate JWT token
    const token = jwt.sign({ walletAddress }, process.env.JWT_SECRET);
    res.json({ token, authenticated: true });
  } else {
    res.status(401).json({ error: 'Invalid signature' });
  }
});

// Client-side login flow
const loginWithWallet = async () => {
  const loginMessage = `Login to MyApp at ${new Date().toISOString()}`;
  
  const result = await signMessage(loginMessage, {
    redirectUrl: 'myapp://auth-callback',
    onSuccess: async (signResult) => {
      // Send to server for verification
      const response = await fetch('/auth/wallet-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: smartWalletPubkey.toString(),
          message: loginMessage,
          signature: signResult.signature,
          signedPayload: signResult.signedPayload,
        }),
      });
      
      const { token } = await response.json();
      // Store auth token
      await AsyncStorage.setItem('authToken', token);
    },
  });
};
```

### 2. Ownership Verification

```typescript
const verifyWalletOwnership = async (claimedAddress: string) => {
  const verificationMessage = `I own wallet ${claimedAddress} - ${Date.now()}`;
  
  const result = await signMessage(verificationMessage, {
    redirectUrl: 'myapp://verify-callback',
    onSuccess: (signResult) => {
      // Verify on server or client
      const isOwner = verifySignature(
        signResult.signature,
        verificationMessage,
        claimedAddress
      );
      
      if (isOwner) {
        Alert.alert('Verified!', 'Wallet ownership confirmed');
      } else {
        Alert.alert('Failed', 'Could not verify ownership');
      }
    },
  });
};
```

### 3. Secure Communication

```typescript
const sendSecureMessage = async (recipient: string, messageContent: string) => {
  const timestamp = Date.now();
  const secureMessage = `To: ${recipient}\nFrom: ${smartWalletPubkey}\nTime: ${timestamp}\nMessage: ${messageContent}`;
  
  const result = await signMessage(secureMessage, {
    redirectUrl: 'myapp://message-callback',
    onSuccess: (signResult) => {
      // Send signed message to recipient
      sendToRecipient({
        to: recipient,
        from: smartWalletPubkey.toString(),
        message: messageContent,
        signature: signResult.signature,
        timestamp,
      });
    },
  });
};
```

## Signature Verification

### Client-Side Verification (JavaScript)

```typescript
import { PublicKey } from '@solana/web3.js';
import { verify } from '@noble/ed25519';

const verifyMessageSignature = async (
  message: string,
  signature: string,
  walletAddress: string
): Promise<boolean> => {
  try {
    // Convert message to bytes
    const messageBytes = new TextEncoder().encode(message);
    
    // Convert signature from base58
    const signatureBytes = bs58.decode(signature);
    
    // Get public key
    const publicKey = new PublicKey(walletAddress);
    
    // Verify signature
    const isValid = await verify(signatureBytes, messageBytes, publicKey.toBytes());
    
    return isValid;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
};

// Usage
const isValid = await verifyMessageSignature(
  "Hello World",
  "signature_string_here",
  "wallet_address_here"
);
```

### Server-Side Verification (Node.js)

```typescript
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

const verifySignatureServer = (
  message: string,
  signature: string,
  walletAddress: string
): boolean => {
  try {
    const messageBytes = Buffer.from(message, 'utf8');
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = new PublicKey(walletAddress).toBytes();
    
    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
  } catch (error) {
    console.error('Server verification error:', error);
    return false;
  }
};
```

## Advanced Message Signing Patterns

### 1. Timestamped Messages

```typescript
const signTimestampedMessage = async (content: string) => {
  const timestamp = Date.now();
  const message = `${content}\nTimestamp: ${timestamp}\nWallet: ${smartWalletPubkey}`;
  
  return await signMessage(message, {
    redirectUrl: 'myapp://callback',
  });
};
```

### 2. Structured Data Signing

```typescript
interface SignedData {
  action: string;
  params: Record<string, any>;
  timestamp: number;
  nonce: string;
}

const signStructuredData = async (data: SignedData) => {
  const message = JSON.stringify(data, null, 2);
  
  return await signMessage(message, {
    redirectUrl: 'myapp://callback',
  });
};

// Usage
const signedOrder = await signStructuredData({
  action: 'place_order',
  params: {
    symbol: 'SOL/USDC',
    side: 'buy',
    amount: 1.5,
    price: 100.0,
  },
  timestamp: Date.now(),
  nonce: generateNonce(),
});
```

### 3. Multi-Step Authentication

```typescript
const multiStepAuth = async () => {
  // Step 1: Initial challenge
  const challenge = await fetch('/auth/challenge').then(r => r.json());
  
  // Step 2: Sign challenge
  const challengeResult = await signMessage(challenge.message, {
    redirectUrl: 'myapp://auth-step1',
  });
  
  // Step 3: Verify and get session token
  const authResult = await fetch('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({
      challengeId: challenge.id,
      signature: challengeResult.signature,
      walletAddress: smartWalletPubkey.toString(),
    }),
  });
  
  return authResult.json();
};
```

## Error Handling

### Common Signing Errors

```typescript
const handleSigningError = (error: any) => {
  if (error.message.includes('User rejected')) {
    Alert.alert('Cancelled', 'Message signing was cancelled');
  } else if (error.message.includes('Biometric not available')) {
    Alert.alert('Biometric Required', 'Please enable biometric authentication');
  } else if (error.message.includes('Network error')) {
    Alert.alert('Network Error', 'Please check your internet connection');
  } else {
    Alert.alert('Signing Failed', 'Please try again');
    console.error('Signing error:', error);
  }
};
```

## Security Best Practices

### 1. Message Validation

```typescript
const validateMessage = (message: string): boolean => {
  // Check message length
  if (message.length > 1000) {
    Alert.alert('Error', 'Message too long (max 1000 characters)');
    return false;
  }
  
  // Check for malicious content
  const dangerousPatterns = [
    /javascript:/i,
    /<script/i,
    /data:text\/html/i,
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(message)) {
      Alert.alert('Error', 'Message contains invalid content');
      return false;
    }
  }
  
  return true;
};
```

### 2. Replay Attack Prevention

```typescript
const signWithNonce = async (message: string) => {
  const nonce = generateSecureNonce();
  const timestamp = Date.now();
  const fullMessage = `${message}\nNonce: ${nonce}\nTimestamp: ${timestamp}`;
  
  return await signMessage(fullMessage, {
    redirectUrl: 'myapp://callback',
  });
};

const generateSecureNonce = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
```

### 3. Signature Expiration

```typescript
const verifyWithExpiration = (
  message: string,
  signature: string,
  walletAddress: string,
  maxAge: number = 300000 // 5 minutes
): boolean => {
  // Extract timestamp from message
  const timestampMatch = message.match(/Timestamp: (\d+)/);
  if (!timestampMatch) return false;
  
  const timestamp = parseInt(timestampMatch[1]);
  const age = Date.now() - timestamp;
  
  if (age > maxAge) {
    console.log('Signature expired');
    return false;
  }
  
  return verifyMessageSignature(message, signature, walletAddress);
};
```

## Testing Message Signing

### Unit Tests

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useWallet } from '@lazorkit/wallet-mobile-adapter';

describe('Message Signing', () => {
  test('signs message successfully', async () => {
    const { result } = renderHook(() => useWallet());
    
    await act(async () => {
      const signResult = await result.current.signMessage('test message', {
        redirectUrl: 'test://callback',
      });
      
      expect(signResult.signature).toBeDefined();
      expect(signResult.signedPayload).toContain('test message');
    });
  });
  
  test('handles signing cancellation', async () => {
    const { result } = renderHook(() => useWallet());
    
    await act(async () => {
      try {
        await result.current.signMessage('test', {
          redirectUrl: 'test://callback',
          onFail: (error) => {
            expect(error.message).toContain('User rejected');
          },
        });
      } catch (error) {
        expect(error.message).toContain('cancelled');
      }
    });
  });
});
```

## Next Steps

You now understand message signing! Next topics:

- Building authentication systems with signed messages
- Implementing secure communication protocols
- Creating verifiable credentials and attestations
- Advanced cryptographic patterns with passkeys

## Resources

- [Digital Signatures Explained](https://en.wikipedia.org/wiki/Digital_signature)
- [WebAuthn Authentication](https://webauthn.guide/)
- [Solana Message Signing](https://docs.solana.com/developing/clients/javascript-api#sign-message)
- [Ed25519 Signatures](https://ed25519.cr.yp.to/)