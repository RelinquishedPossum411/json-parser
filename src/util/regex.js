
// Some regexes

// Allow spaces if there are quotes, but don't if there aren't.
const   rEntry = /[\w]/,
        rWhitespace = /\s+/,
        rEnclosedQuotes = /^".*"$/,
        rEnclosedBrackets = /^{.*}$/;

export { rWhitespace, rEnclosedQuotes, rEnclosedBrackets };
