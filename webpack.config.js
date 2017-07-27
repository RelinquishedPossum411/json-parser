

const path = require("path"),
    configuration = {
        entry: "",
        output: {
            path: path.resolve(__dirname, "build/"),
            filename: "build.js"
        }
    };

module.exports = configuration;
