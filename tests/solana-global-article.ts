import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { SolanaGlobalArticle } from '../target/types/solana_global_article'

describe('solana-global-article', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env())

  const program = anchor.workspace.SolanaGlobalArticle as Program<SolanaGlobalArticle>

  it('Is initialized!', async () => {
    const deployerKeypair = anchor.web3.Keypair.generate()
    const personThatPays = program.provider.wallet

    // Add your test here
    await program.rpc.initialize({
      accounts: {
        article: deployerKeypair.publicKey,
        personThatPays: personThatPays.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [deployerKeypair],
    })
    console.log('Writing into article...')
    await program.rpc.writeIntoArticle("hey     what's      up   fasdf sf", {
      accounts: {
        article: deployerKeypair.publicKey,
      },
      signers: [],
    })
    console.log('Done writing into article...')

    const a = await program.account.article.fetch(deployerKeypair.publicKey)
    console.log('a', a)
  })
})
