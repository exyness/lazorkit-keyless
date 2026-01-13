# React Native Integration Example

This is a **complete, standalone React Native example** showing how to integrate Lazorkit SDK into your React Native app. This example can be copied and used as a starting point for your own projects.

## What This Example Shows

- ✅ **Proper polyfill setup** for React Native + Solana
- ✅ **Lazorkit provider configuration** for mobile apps  
- ✅ **Passkey authentication flow** with biometrics
- ✅ **Gasless transaction implementation** 
- ✅ **Complete wallet UI** with send/receive/balance features
- ✅ **Deep linking configuration** for authentication redirects

## Key Differences from Web Integration

This React Native example includes specific configurations needed for mobile:

### Required Polyfills
```typescript
// index.ts - MUST be at the very top
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';
global.Buffer = Buffer;
```

### Mobile-Specific Dependencies
```json
{
  "react-native-get-random-values": "~1.11.0",
  "react-native-url-polyfill": "^3.0.0", 
  "buffer": "^6.0.3",
  "expo-web-browser": "^15.0.10"
}
```

### Deep Linking Setup
```json
// app.json
{
  "expo": {
    "scheme": "keyless",
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [{ "scheme": "keyless" }],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

## Configuration

### Lazorkit Provider Setup

```typescript
// App.tsx
<LazorKitProvider
  rpcUrl="https://api.devnet.solana.com"
  portalUrl="https://portal.lazor.sh"
  configPaymaster={{
    paymasterUrl: "https://kora.devnet.lazorkit.com"
  }}
>
```

### Deep Linking Configuration

```json
// app.json
{
  "expo": {
    "scheme": "keyless",
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [{ "scheme": "keyless" }],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

## Features Demonstrated

- **Passkey Authentication** - Fingerprint/Face ID wallet creation
- **Gasless Transactions** - Send SOL without paying fees
- **QR Code Payments** - Easy receiving with QR codes
- **Message Signing** - Authentication and verification
- **Transaction History** - View past transactions

## Project Structure

```
src/
├── screens/                 # Main app screens
│   ├── OnboardingScreen.tsx    # User education flow
│   ├── WalletScreen.tsx        # Main dashboard
│   ├── SendScreen.tsx          # Send SOL interface
│   ├── ReceiveScreen.tsx       # QR code generation
│   ├── SignMessageScreen.tsx   # Message signing
│   └── TransactionHistoryScreen.tsx # Transaction history
├── styles/                  # Styled components
└── components/             # Reusable UI components
```

## Prerequisites

- Node.js 18+ and Bun package manager
- Android Studio (for Android development)
- Physical Android device (passkeys require real hardware)

## Installation

```bash
# Install dependencies
bun install

# Configure Android SDK path (if building locally)
echo "sdk.dir=YOUR_ANDROID_SDK_PATH" > android/local.properties

# Build and install on device
cd android
./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

## Testing

### Getting Test SOL

1. Open the app and create a wallet
2. Go to the Receive screen
3. Tap "Get Free SOL" to open the Solana faucet
4. Complete the captcha to receive test SOL

### Testing Scenarios

- First-time user onboarding
- Wallet creation with biometrics
- Sending gasless transactions
- Receiving payments via QR codes
- Message signing for authentication

## Customization

### Network Configuration

For mainnet deployment, update the configuration:

```typescript
<LazorKitProvider
  rpcUrl="https://api.mainnet-beta.solana.com"
  portalUrl="https://portal.lazor.sh"
  configPaymaster={{
    paymasterUrl: "https://kora.mainnet.lazorkit.com"
  }}
>
```

## Support

For issues specific to this React Native example:

1. Check the [main documentation](../../docs/)
2. Review the implementation in `src/screens/`
3. Test on a physical device (not emulator)
4. Ensure all polyfills are properly configured

## License

This example is provided under the MIT License.