const fs = require('fs')
const path = require('path')
const filename = 'solana_global_article.json'

fs.copyFileSync(
    path.join(__dirname, 'target', 'idl', filename),
    path.join(__dirname, 'app', 'src', filename)
)