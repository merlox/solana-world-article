import React, { useMemo } from 'react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider, WalletMultiButton } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

export default () => {
    return (
        <Context>
            <Content />
        </Context>
    )
}

// export default () => {
//     return (<div>a</div>)
// }

const Context = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network])

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    const wallets = [
        new SlopeWalletAdapter(),
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter({ network }),
        new TorusWalletAdapter(),
        new LedgerWalletAdapter(),
        new SolletWalletAdapter({ network }),
        new SolletExtensionWalletAdapter({ network }),
    ]

    console.log('wallets', wallets)

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

const Content = () => {
    return <WalletMultiButton />
}
