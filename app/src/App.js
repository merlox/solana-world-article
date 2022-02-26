import React, { useState, useEffect } from 'react'
import { TextField, Paper, Skeleton, Button } from '@mui/material'
import WalletContext from './WalletContext'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
	WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import { PublicKey } from '@solana/web3.js'
// import idl from 

// const programID = new PublicKey()

// Gotta separate the main component and App to add the WalletContext
const Main = () => {
	const [inputValue, setInputValue] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [connectedPublicKey, setConnectedPublicKey] = useState(null)
	const { connection } = useConnection()
	const { publicKey, sendTransaction } = useWallet()

	useEffect(() => {
		if (publicKey) {
			console.log('connection', connection)
			console.log('publicKey', publicKey)
			setConnectedPublicKey(publicKey)
		}
	}, [publicKey])

	const checkAndAddWords = e => {
		let words = e.target.value.split(' ')
		for (let i = 0; i < words.length; i++) {
			if (words[i].length > 15) {
				return
			}
		}
		if (words.length > 3) return
		setInputValue(words.join(' '))
	}

	return (
		<>
			<header className='header'>
				<img src='assets/solana.jpeg' className='solana-image' />
				<div className="title-container">
					<h1 className="main-title">Open Global Article</h1>
					<h4 className="main-subtitle">By Merunas</h4>
				</div>
				<div className="wallet-connect">
					<WalletMultiButton />
				</div>
			</header>

			{isLoading ? (
				<Paper elevation={2} className='content-box'>
					<Skeleton variant='text' />
					<Skeleton variant='text' />
					<Skeleton variant='text' />
				</Paper>
			) : (
				<Paper elevation={2} className='content-box'>
					This is the text that will show the article.
				</Paper>
			)}

			<TextField
				id='outlined-basic'
				label='Write to the open book (3 words max)'
				variant='outlined'
				className='words-input'
				value={inputValue}
				onChange={e => checkAndAddWords(e)}
			/>
		</>
	)
}

export default () => {
	return (
		<WalletContext>
			<Main/>
		</WalletContext>
	)
}
