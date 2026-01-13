# Lazorkit Keyless Wallet - React Native Example

![App Demo](assets/cover.png)

A **production-ready example** of integrating Lazorkit SDK into a React Native mobile app. Demonstrates how to eliminate traditional crypto wallet friction with passkey authentication and gasless transactions.

## Features

- **Passkey Authentication** - Users create wallets with fingerprint/Face ID (no seed phrases)
- **Gasless Transactions** - Send SOL without paying network fees  
- **Smart Wallet Integration** - Solana Program Derived Addresses controlled by passkeys
- **Cross-Device Sync** - Passkeys work across all user devices automatically

## 🚀 Try the Live Demo

**[📲 Download APK](https://github.com/exyness/lazorkit-keyless/releases/latest/download/lazorkit-keyless-wallet-v1.0.0.apk)**

Experience the app instantly on your Android device:
1. Download and install the APK
2. Create wallet with your fingerprint  
3. Get free test SOL from built-in faucet
4. Send gasless transactions to friends

*Requires Android device with biometric authentication*

## Quick Start

### Prerequisites
- Node.js 18+ and Bun package manager
- Android Studio (for Android development)
- Physical Android device (passkeys require real hardware)

### Installation

```bash
# Clone the repository
git clone https://github.com/exyness/lazorkit-keyless.git
cd lazorkit-keyless

# Install dependencies
bun install

# Configure Android SDK path
echo "sdk.dir=YOUR_ANDROID_SDK_PATH" > android/local.properties

# Build and install on device
cd android
./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

## Documentation

### Getting Started
- [Getting Started](docs/getting-started.md) - Create your first passkey wallet
- [Wallet Features](docs/wallet-features.md) - Add balance, send, receive functionality
- [Gasless Transactions](docs/gasless-transactions.md) - Implement fee-free transactions
- [Message Signing](docs/message-signing.md) - Add authentication capabilities
- [Advanced Features](docs/advanced-features.md) - Multi-token support and DeFi integrations

### Examples
- [React Native Integration](examples/react-native/) - Standalone example for integrating Lazorkit into your React Native app

## Quick Integration

Add Lazorkit to your existing React Native app in 3 steps:

1. **Install:** `bun add @lazorkit/wallet-mobile-adapter`
2. **Wrap your app** with `LazorKitProvider`
3. **Use wallet hooks** like `useWallet()`

*See [Getting Started Guide](docs/getting-started.md) for complete setup instructions.*

## Project Structure

This repository contains:

- **Main Application** - A complete React Native wallet app (root directory)
- **Documentation** - Step-by-step guides in `docs/` folder  
- **Integration Example** - Standalone example in `examples/react-native/` for copying into your own projects

```
├── src/                     # Main wallet app source code
├── docs/                    # Complete documentation
│   ├── getting-started.md      # Basic wallet setup
│   ├── wallet-features.md      # Send/receive functionality  
│   ├── gasless-transactions.md # Fee-free transactions
│   ├── message-signing.md      # Authentication
│   └── advanced-features.md    # Multi-token & DeFi
└── examples/                # Integration examples
    └── react-native/           # Standalone React Native example
        ├── README.md              # Integration guide
        ├── package.json           # Dependencies
        ├── src/                   # Example source code
        └── ...                    # Complete app structure
```

## Support & Resources

- **Documentation:** [docs/](docs/) - Complete implementation guides
- **Examples:** [examples/](examples/) - Working code examples
- **Lazorkit Docs:** [docs.lazorkit.com](https://docs.lazorkit.com/)
- **Community:** [t.me/lazorkit](https://t.me/lazorkit)

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built by:** exyness | **Version:** 1.4.1 | **Framework:** React Native (Expo)