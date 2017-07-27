
import validate from "./validator";
import * as regex from "../../util/regex";

export default function (string) {
    let currentComponent = "",
        currentEntry = "",
        cursor = 0;

    const notation = {};

    // If the string can't be validated, simply return.
    // This performs a shallow validation to skip most of the work.
    if (!validate(string))
        return;

    while (cursor < string.length) {

        // Parsing error.
        if (cursor === 0 &&
            (string[cursor] !== "{" || string[string.length - 1] !== "}")) {
            console.warn("[JSON String Parser] Parsing error: Inbalanced brackets detected.");
            return;
        }

        // Quote beginning
        if (string[cursor] === "\"") {
            currentComponent += "\"";
            continue;
        }

        // Check if the character is a colon.
        // Perform checks to make sure we're not parsing an invalid key.
        else if (string[cursor] === ":") {
            if (!validateKeyValue(currentComponent)) {
                console.warn("[JSON String Parser] Parsing error: Invalid key value.");
                return;
            }
        }
    }

    /**
     * Checks to see if the key or value is enclosed in quotation marks.
     * @param key - a value to validate.
     * @return returns whether a specified key or value is deemed valid (boolean).
     */
    function validateKeyValue(key) {
        if ((key[0] === "\"" && key[key.length - 1] !== "\"") ||
            (key[0] !== "\"" && key[key.length - 1] === "\""))
            return false;

        return true;
    }

    return notation;
}
