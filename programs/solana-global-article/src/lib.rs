use anchor_lang::prelude::*;

declare_id!("BJ2wuQvdMm7SNQbJRyiwvSEt738MtZQLwUnngpaVxRPn");

#[program]
pub mod solana_global_article {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        // Get the article
        let article_account = &mut ctx.accounts.article;
        // Initialize the variables (this is required)
        article_account.writers = Vec::new();
        article_account.content = ("").to_string();
        article_account.person_that_pays = *ctx.accounts.person_that_pays.key;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = person_that_pays,
        space = 8 // account discriminator
        + 32 // pubkey
        + 10000 // make the message max 10k bytes long
    )]
    pub article: Account<'info, Article>,
    pub person_that_pays: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Article {
    pub writers: Vec<Pubkey>,
    pub content: String,
    pub person_that_pays: Pubkey,
}