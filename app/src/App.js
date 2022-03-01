import React, { useState, useEffect } from 'react'
import { TextField, Paper, Skeleton, Button } from '@mui/material'
import WalletContext from './WalletContext'
import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Connection, PublicKey } from '@solana/web3.js'
import idl from './solana_global_article.json'
import { Program, Provider, web3 } from '@project-serum/anchor'
import config from './../config'

const programID = new PublicKey(idl.metadata.address)
const { SystemProgram, Keypair } = web3
const SOLANA_BOOK_KEY = new PublicKey(config.solana_book_key)

// Gotta separate the main component and App to add the WalletContext
const Main = () => {
	const [inputValue, setInputValue] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const wallet = useAnchorWallet()
	const { connection } = useConnection()
	
	useEffect(() => {
		if (wallet) {
			getArticle()
		}
	}, [wallet])

	const initialize = async () => {
		const provider = new Provider(connection, wallet, {})
		const program = new Program(idl, programID, provider)
		const keypairOne = Keypair.fromSecretKey(Uint8Array.from(config.samplePrivateKey))

		try {
			await program.rpc.initialize({
				accounts: {
					authority: provider.wallet.publicKey,
					article: keypairOne.publicKey,
					systemProgram: SystemProgram.programId,
				},
				signers: [keypairOne],
			})

			console.log('done')
			console.log('done', keypairOne.publicKey.toString())
		} catch (e) {
			console.log('#1', e)
			return alert(e)
		}
	}

	const generateUserKey = (programKey, walletKey) => {
		const userAcc = Keypair.fromSeed(
			new TextEncoder().encode(
				`${programKey.toString().slice(0, 15)}__${walletKey.toString().slice(0, 15)}`
			)
		)
		return userAcc
	}

	const uploadWords = async () => {
		const provider = new Provider(connection, wallet, {})
		const program = new Program(idl, programID, provider)
		const userAcc = generateUserKey(programID, provider.wallet.publicKey)
		const keypairOne = Keypair.fromSecretKey(Uint8Array.from(config.samplePrivateKey))

		console.log('userAcc', userAcc)
		console.log('provider.wallet.publicKey', provider.wallet.publicKey.toString())
		console.log('keypairOne.publicKey.publicKey', keypairOne.publicKey.toString())

		try {
			console.log('inputValue', inputValue)
			await program.rpc.writeIntoArticle(inputValue, {
				accounts: {
					article: keypairOne.publicKey,
				},
			})
			console.log('Done')
		} catch (e) {
			console.log('#2', e)
			return alert(e)
		}

		const articleData = await program.account.article.fetch(keypairOne.publicKey)
		console.log('article data', articleData)
	}

	const getArticle = async () => {
		const provider = new Provider(connection, wallet, {})
		const program = new Program(idl, programID, provider)
		const keypairOne = Keypair.fromSecretKey(Uint8Array.from(config.samplePrivateKey))

		const articleData = await program.account.article.fetch(keypairOne.publicKey)
		console.log('article data', articleData)
	}

	// To limit users to input up to 3 words and up to 15 chars long each separated by a space
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
					<h1 className="main-title">Open Global Book</h1>
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

			{/* <Button onClick={initialize} color="secondary" variant="contained">initialize</Button> */}

			<div>
				<TextField
					id='outlined-basic'
					label='Write to the open book (3 words max)'
					variant='outlined'
					className='words-input'
					value={inputValue}
					onChange={e => checkAndAddWords(e)}
				/>
				<Button onClick={uploadWords}>Submit</Button>
			</div>
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
