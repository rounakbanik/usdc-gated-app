import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { goerli } from '@wagmi/core/chains'

import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import "../styles/globals.css";
import { apiKey } from '@/data/constants';

// Configure chains & provider
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli],
  [infuraProvider({ apiKey: apiKey }), publicProvider()],
)

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  publicClient,
  webSocketPublicClient,
})

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}
