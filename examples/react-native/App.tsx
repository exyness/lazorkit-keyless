import { StatusBar } from 'expo-status-bar';
import { LazorKitProvider } from '@lazorkit/wallet-mobile-adapter';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WalletScreen } from './src/screens/WalletScreen';
import { ErrorBoundary } from './src/components/ErrorBoundary';

const CONFIG = {
  RPC_URL: 'https://api.devnet.solana.com',
  PORTAL_URL: 'https://portal.lazor.sh',
  PAYMASTER: {
    paymasterUrl: 'https://kora.devnet.lazorkit.com',
  },
};

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <LazorKitProvider
          rpcUrl={CONFIG.RPC_URL}
          portalUrl={CONFIG.PORTAL_URL}
          configPaymaster={CONFIG.PAYMASTER}
        >
          <WalletScreen />
          <StatusBar style="auto" />
        </LazorKitProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}