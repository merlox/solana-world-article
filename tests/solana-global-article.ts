import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { SolanaGlobalArticle } from '../target/types/solana_global_article'
import { expect } from 'chai'

describe('solana-global-article', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env())

  const program = anchor.workspace.SolanaGlobalArticle as Program<SolanaGlobalArticle>
  const initialText = 'This is the story of '

  it('Is initialized!', async () => {
    const deployerKeypair = anchor.web3.Keypair.generate()
    const authority = program.provider.wallet

    // Add your test here
    await program.rpc.initialize({
      accounts: {
        article: deployerKeypair.publicKey,
        authority: authority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [deployerKeypair],
    })
  })

  it('Should write an article with 1 word successfully', async () => {
    const deployerKeypair = anchor.web3.Keypair.generate()
    const authority = program.provider.wallet

    // Add your test here
    await program.rpc.initialize({
      accounts: {
        article: deployerKeypair.publicKey,
        authority: authority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [deployerKeypair],
    })
    
    await program.rpc.writeIntoArticle('a', {
      accounts: {
        article: deployerKeypair.publicKey,
      },
      signers: [],
    })

    const articleData = await program.account.article.fetch(deployerKeypair.publicKey)
    expect(articleData.content).to.equal(initialText + 'a ') // Note the space at the end, added by the program
  })

  it("should write 5 words two times", async () => {
    const deployerKeypair = anchor.web3.Keypair.generate()
    const authority = program.provider.wallet
    const text1 = 'a brave soldier fighting for'
    const text2 = "a world he didn't build"

    // Add your test here
    await program.rpc.initialize({
      accounts: {
        article: deployerKeypair.publicKey,
        authority: authority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [deployerKeypair],
    })
    
    await program.rpc.writeIntoArticle(text1, {
      accounts: {
        article: deployerKeypair.publicKey,
      },
      signers: [],
    })

    await program.rpc.writeIntoArticle(text2, {
      accounts: {
        article: deployerKeypair.publicKey,
      },
      signers: [],
    })

    const articleData = await program.account.article.fetch(deployerKeypair.publicKey)
    expect(articleData.content).to.equal(initialText + text1 + ' ' + text2 + ' ') // Note the space at the end, added by the program
  })
})
