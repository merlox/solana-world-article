use anchor_lang::prelude::*;

declare_id!("CQ2H1fTdvZUwMLfUMx6Qct4g5yMpWfmecR4p1eayoorv");

#[program]
pub mod solana_global_article {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        // Get the article
        let article_account = &mut ctx.accounts.article;
        // Initialize the variables (this is required)
        article_account.content = ("This is the story of ").to_string();

        Ok(())
    }

    pub fn write_into_article(
        ctx: Context<WriteIntoArticle>,
        three_words: String, // If more, after 3 they will be removed
    ) -> ProgramResult {
        // To update the article string
        let article = &mut ctx.accounts.article;
        let split_iterator = three_words.trim().split(" ");
        let mut final_words = Vec::new();
        let mut counter_added = 0;
        for s in split_iterator {
            if s.trim().is_empty() {
                continue;
            }
            if s.trim().len() >= 15 {
                return Err(Errors::WordTooLong.into());
            }
            final_words.push(s);
            counter_added += 1;
            if counter_added >= 5 {
                break;
            }
        }
        // Join the 3 words after removing spaces
        let mut joined_words = final_words.join(" ");
        // Add a space at the end with this
        joined_words.push_str(" ");
        // Article content gets immediately updated
        article.content.push_str(&joined_words);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 // account discriminator
        + 32 // pubkey
        + 1000 // make the message max 100 bytes long
    )]
    pub article: Account<'info, Article>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WriteIntoArticle<'info> {
    // Here goes the info that you want to modify like this
    #[account(mut)]
    pub article: Account<'info, Article>,
}

#[account]
pub struct Article {
    pub content: String,
}

#[error]
pub enum Errors {
    #[msg("Each word must be less than 15 characters")]
    WordTooLong,
}