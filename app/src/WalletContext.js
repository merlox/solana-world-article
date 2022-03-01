import React from 'react'
import {
	ConnectionProvider,
	WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
	LedgerWalletAdapter,
	PhantomWalletAdapter,
	SlopeWalletAdapter,
	SolflareWalletAdapter,
	SolletExtensionWalletAdapter,
	SolletWalletAdapter,
	TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import {
	WalletModalProvider,
} from '@solana/wallet-adapter-react-ui'
import config from './../config'
require('@solana/wallet-adapter-react-ui/styles.css')

export default ({ children }) => {
	const network = WalletAdapterNetwork.Devnet
	const wallets = [
		new PhantomWalletAdapter(),
		new SlopeWalletAdapter(),
		new SolflareWalletAdapter({ network }),
		new TorusWalletAdapter(),
		new LedgerWalletAdapter(),
		new SolletWalletAdapter({ network }),
		new SolletExtensionWalletAdapter({ network }),
	]

	return (
		<ConnectionProvider endpoint={config.endpoint}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>
					{children}
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	)
}
