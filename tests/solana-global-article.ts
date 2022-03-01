import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { SolanaGlobalArticle } from '../target/types/solana_global_article'
import { expect } from 'chai'

describe('solana-global-article', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env())

  const program = anchor.workspace.SolanaGlobalArticle as Program<SolanaGlobalArticle>

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
    
    await program.rpc.writeIntoArticle('hey', {
      accounts: {
        article: deployerKeypair.publicKey,
      },
      signers: [],
    })

    const articleData = await program.account.article.fetch(deployerKeypair.publicKey)
    expect(articleData.content).to.equal('hey ') // Note the space at the end, added by the program
  })

  it("should write 3 words two times", async () => {
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
    
    await program.rpc.writeIntoArticle('hey whats up', {
      accounts: {
        article: deployerKeypair.publicKey,
      },
      signers: [],
    })

    await program.rpc.writeIntoArticle('this is my', {
      accounts: {
        article: deployerKeypair.publicKey,
      },
      signers: [],
    })

    const articleData = await program.account.article.fetch(deployerKeypair.publicKey)
    console.log('article data', articleData)
    expect(articleData.content).to.equal('hey whats up this is my ') // Note the space at the end, added by the program
  })
})
