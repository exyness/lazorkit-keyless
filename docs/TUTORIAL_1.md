# Tutorial 1: Creating Your First Wallet with Fingerprint Login

**Learn how to build a wallet that users can access with just their fingerprint - no passwords or complicated setup required!**

## What You'll Learn

In this tutorial, you'll understand:
- 🔐 How fingerprint/face ID login works for crypto wallets
- 📱 Why this is better than traditional wallets
- ⛯ How to set up the basic wallet connection
- ✓ How to test it on your phone

**Time needed:** 30 minutes  
**Difficulty:** Beginner

## The Problem with Traditional Crypto Wallets

**Traditional wallets are complicated:**
- ✗ Users must download a separate wallet app (like MetaMask)
- ✗ They need to write down 12-24 random words (seed phrase)
- ✗ They must remember passwords
- ✗ If they lose the seed phrase, they lose all their money
- ✗ They need to buy cryptocurrency just to pay transaction fees

**Your wallet will be different:**
- ✓ Built directly into your app (no separate download)
- ✓ Login with fingerprint or face ID
- ✓ No seed phrases to remember or lose
- ✓ Free transactions (no fees for users)
- ✓ Works across all their devices automatically

## What Are Passkeys?

**Passkeys are the new way to log in without passwords:**

**Traditional login:**
```
Username: john@email.com
Password: MyPassword123!
```

**Passkey login:**
```
👆 Touch fingerprint sensor
✓ Logged in!
```

**How they work:**
1. **Your phone creates a unique digital key** when you first sign up
2. **The key is stored securely** in your phone's secure chip
3. **To log in, you just use your fingerprint** - no typing needed
4. **The key syncs across your devices** via iCloud/Google

**Why they're secure:**
- 🔒 **Can't be stolen** - the key never leaves your device
- 🚫 **Can't be phished** - no password to trick you into giving away
- 🔐 **Hardware protected** - stored in your phone's secure chip
- 🌐 **Industry standard** - used by Apple, Google, Microsoft

## Setting Up Your First Wallet

### Step 1: Understanding the Code Structure

Your wallet app has a few key files:

**`App.tsx` - The main app wrapper:**
```typescript
import { LazorKitProvider } from '@lazorkit/wallet-mobile-adapter';

export default function App() {
  return (
    <LazorKitProvider
      rpcUrl="https://api.devnet.solana.com"        // Blockchain connection
      portalUrl="https://portal.lazor.sh"           // Passkey service
      configPaymaster={{
        paymasterUrl: "https://kora.devnet.lazorkit.com"  // Free transactions
      }}
    >
      <WalletScreen />
    </LazorKitProvider>
  );
}
```

**What this does:**
- **LazorKitProvider** wraps your app and provides wallet functionality
- **rpcUrl** connects to the Solana blockchain (we use "devnet" for testing)
- **portalUrl** connects to the passkey authentication service
- **configPaymaster** enables free transactions for your users

### Step 2: The Wallet Connection Screen

**`src/screens/WalletScreen.tsx` - Main wallet interface:**

```typescript
import { useWallet } from '@lazorkit/wallet-mobile-adapter';

function WalletScreen() {
  // Get wallet functions from Lazorkit
  const { connect, isConnected, smartWalletPubkey } = useWallet();

  // Function to connect wallet with passkey
  const handleConnect = async () => {
    await connect({
      redirectUrl: 'keyless://home',  // Where to return after login
      onSuccess: (walletInfo) => {
        console.log('✓ Wallet connected!');
        console.log('Wallet address:', walletInfo.smartWallet);
      },
      onFail: (error) => {
        console.log('✗ Connection failed:', error);
      }
    });
  };

  return (
    <View>
      {!isConnected ? (
        // Show connect button if not connected
        <TouchableOpacity onPress={handleConnect}>
          <Text>Connect with Fingerprint</Text>
        </TouchableOpacity>
      ) : (
        // Show wallet info if connected
        <View>
          <Text>✓ Wallet Connected!</Text>
          <Text>Address: {smartWalletPubkey?.toString()}</Text>
        </View>
      )}
    </View>
  );
}
```

**What happens when user taps "Connect with Fingerprint":**

1. **App opens browser** to `https://portal.lazor.sh`
2. **User sees passkey prompt** - "Use fingerprint to sign in"
3. **User touches fingerprint sensor** (or uses face ID)
4. **Passkey is created/used** - stored securely on their device
5. **Browser redirects back** to your app (`keyless://home`)
6. **Wallet is created** - user now has a Solana wallet address
7. **User is logged in** - they can now use all wallet features

### Step 3: Understanding Smart Wallets

**What you get after connection:**

```typescript
const walletInfo = {
  credentialId: "abc123...",           // Unique ID for this passkey
  passkeyPubkey: [1, 2, 3, ...],      // The actual cryptographic key
  smartWallet: "7xKXtg2CW3...",       // 🎯 This is the wallet address!
  walletDevice: "9mWxnKp5...",        // Internal technical address
  platform: "android"                 // Which device type
};
```

**The important part is `smartWallet`** - this is like a bank account number:
- ✓ **Users can receive money** at this address
- ✓ **Users can send money** from this address
- ✓ **Only their fingerprint** can authorize transactions
- ✓ **Works on all their devices** (iPhone, Android, etc.)

### Step 4: App Configuration

**`app.json` - App settings:**
```json
{
  "expo": {
    "name": "My Wallet App",
    "scheme": "keyless"  // 👈 This enables deep linking
  }
}
```

**The `scheme` is important:**
- When user finishes passkey login, browser redirects to `keyless://home`
- This brings them back to your app
- Without this, the login flow won't work

## Testing Your Wallet

### Step 1: Build and Install

**Build the app:**
```bash
# Navigate to your project
cd your-wallet-project

# Build for Android
cd android
./gradlew assembleDebug

# Install on your phone (connect via USB)
adb install app/build/outputs/apk/debug/app-debug.apk
```

### Step 2: Test the Connection Flow

**On your phone:**

1. **Open the app** - you should see the connect button
2. **Tap "Connect with Fingerprint"** - browser should open
3. **Follow the passkey prompts** - use your fingerprint/face ID
4. **Return to app** - you should see "Wallet Connected!"
5. **Note the wallet address** - this is your user's new wallet

**What to expect:**
- ✓ Browser opens to Lazorkit portal
- ✓ Passkey prompt appears
- ✓ Fingerprint/face ID works
- ✓ Returns to your app
- ✓ Shows wallet address

### Step 3: Test Persistence

**Close and reopen the app:**
- ✓ Should remember the connection
- ✓ Should show wallet address immediately
- ✓ No need to connect again

**This is the magic of passkeys** - once created, they work automatically!

## Common Issues and Solutions

### "Browser doesn't open"

**Problem:** Tapping connect button does nothing

**Solutions:**
1. Check that `scheme` is set in `app.json`
2. Rebuild the app after changing `app.json`
3. Make sure `expo-web-browser` is installed

### "Passkey prompt doesn't appear"

**Problem:** Browser opens but no fingerprint prompt

**Solutions:**
1. Make sure you're testing on a real device (not emulator)
2. Check that fingerprint/face ID is set up on your device
3. Try using Chrome browser if default browser doesn't work

### "Can't return to app"

**Problem:** Stuck in browser after passkey login

**Solutions:**
1. Verify `redirectUrl` matches your app scheme
2. Check that deep linking is configured correctly
3. Make sure the URL is exactly `keyless://home`

### "Connection fails"

**Problem:** Gets error message instead of success

**Solutions:**
1. Check internet connection
2. Verify all URLs in configuration are correct
3. Make sure you're using the devnet URLs for testing

## Understanding the User Experience

### First-Time User Journey

**Step 1: User opens your app**
- Sees welcome screen
- Taps "Get Started" or "Create Wallet"

**Step 2: Passkey creation**
- Browser opens to authentication page
- Sees "Create passkey for [Your App Name]"
- Uses fingerprint/face ID to create passkey

**Step 3: Wallet ready**
- Returns to your app
- Wallet is created and ready to use
- Can immediately start receiving/sending money

### Returning User Journey

**Step 1: User opens your app**
- App automatically detects existing passkey
- Shows wallet dashboard immediately

**Step 2: Using wallet features**
- All transactions use the same fingerprint/face ID
- No passwords or seed phrases needed
- Works seamlessly across all their devices

## Security Benefits

### What Makes This Secure?

**Traditional wallet security:**
- 🔑 **Private key** stored as 12-24 word seed phrase
- 📝 **User must write it down** and keep it safe
- 💾 **Often stored insecurely** (photos, notes apps, etc.)
- 🎯 **Single point of failure** - lose the words, lose everything

**Passkey wallet security:**
- 🔐 **Private key** stored in secure hardware chip
- 🚫 **Never leaves the device** - can't be stolen remotely
- 🔄 **Syncs securely** across user's devices via iCloud/Google
- 👆 **Biometric authentication** required for every use

### What Users Don't Need to Worry About

- ✗ **No seed phrases to lose**
- ✗ **No passwords to remember**
- ✗ **No separate apps to download**
- ✗ **No complex backup procedures**
- ✗ **No risk of phishing attacks**

## Next Steps

### What You've Accomplished

✓ **Set up passkey authentication** - users can create wallets with fingerprint  
✓ **Understood smart wallets** - how addresses are generated and managed  
✓ **Tested the connection flow** - verified it works on real devices  
✓ **Learned about security** - why this is safer than traditional wallets  

### What's Next

Now that you have basic wallet connection working, you can add features:

**Tutorial 2: Adding Wallet Features**
- Check wallet balance
- Send money (gasless transactions)
- Receive money (QR codes)
- View transaction history

**Tutorial 3: Advanced Features**
- Message signing for authentication
- Multi-token support
- Custom transaction types

### Customizing for Your App

**Change the branding:**
```typescript
// In your connect function
await connect({
  redirectUrl: 'myapp://home',  // Use your app's scheme
  onSuccess: (walletInfo) => {
    // Your custom success handling
    showWelcomeMessage();
    trackUserSignup();
  }
});
```

**Add your own onboarding:**
```typescript
// Show your own tutorial before wallet connection
const showOnboarding = () => {
  // Explain what your app does
  // Show benefits of using your wallet
  // Then call connect() when user is ready
};
```

## Troubleshooting Checklist

**Before asking for help, check:**

✓ **Testing on real device** (not emulator)  
✓ **Fingerprint/face ID set up** on the device  
✓ **Internet connection** working  
✓ **App scheme configured** in app.json  
✓ **Deep linking working** (can open app from browser)  
✓ **All dependencies installed** (`bun install`)  
✓ **App rebuilt** after configuration changes  

## Resources

**Learn more about passkeys:**
- [WebAuthn.guide](https://webauthn.guide/) - How passkeys work technically
- [Passkeys.dev](https://passkeys.dev/) - Industry information and updates

**Solana blockchain basics:**
- [Solana.com](https://solana.com/) - Learn about the blockchain your wallet uses
- [Solana Cookbook](https://solanacookbook.com/) - Developer resources

**React Native development:**
- [React Native Docs](https://reactnative.dev/) - Learn the app framework
- [Expo Docs](https://docs.expo.dev/) - Tools for building mobile apps

---

**Congratulations!** 🎉 You now understand how to create wallets with fingerprint login. Your users can create secure wallets without any of the complexity of traditional crypto wallets.

**Key takeaway:** Passkeys make crypto wallets as easy to use as any other app, while being more secure than traditional methods.

**Next:** Learn how to add wallet features like sending money, checking balances, and viewing transaction history in Tutorial 2!

---

*Questions? Check out the other tutorials or reach out to the Lazorkit community for help.*
