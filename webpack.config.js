

const path = require("path"),
    configuration = {
        entry: "./src/core.js",
        output: {
            path: path.resolve(__dirname, "build/"),
            filename: "build.js"
        }
    };

module.exports = configuration;
