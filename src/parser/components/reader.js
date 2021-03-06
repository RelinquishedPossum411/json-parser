
import validate from "./validator";
import * as regex from "../../util/regex";

export default function read(string) {
    let currentComponent = "",
        currentEntry = "",
        mode = 0, // Modes: 0 building key, 1 building value, 2 in between
        cursor = 0;

    const notation = {};

    // If the string can't be validated, simply return.
    // This performs a shallow validation to skip most of the work.
    if (!validate(string))
        return;

    while (cursor < string.length) {
        console.log("Token: " + string[cursor] + "\nMode: " + mode + "\n" + currentComponent + ": " + currentEntry);

        // Handle first character and address any parsing problems with it.
        if (cursor === 0) {
            if (string[cursor] !== "{" || string[string.length - 1] !== "}") {
                console.error("[JSON String Parser] Parsing error: Inbalanced brackets detected.");
                return;
            } else if (string[cursor] === "{") {
                cursor++;
                continue;
            }

            return;
        }

        // Check if the character is a colon and that it is correctly placed.
        // Perform checks to make sure we're not parsing an invalid key.
        else if (mode === 0 && string[cursor] === ":") {
            // The string begins with a quotation, so we can still accept
            // irregular characters.
            if (!enclosedQuotes(currentComponent) &&
                (currentComponent.startsWith("\"") ||
                currentComponent.trim().startsWith("\""))) {
                currentComponent += ":";
                cursor++;
                continue;
            }


            if (!validateKeyValue(currentComponent) &&
                !validateKeyValue(currentComponent.trim())) {
                console.error("[JSON String Parser] Parsing error: Invalid key value '" + currentComponent +  "'.");
                return;
            }

            mode++;
        }

        // Irregularly placed curly bracket.
        else if (mode === 0 && string[cursor] === "}" && string.length > 2) {
            console.error("[JSON String Parser] Parsing error: Unexpected syntax '}' at position " + cursor + ".");
            return;
        }

        // Append the completed entry. Only do it if we encounter a closing
        // parenthesis or comma.
        else if (mode === 1 &&
                (string[cursor] === "," || string[cursor] === "}")) {
            if (currentComponent && currentEntry) {
                if (typeof currentEntry === "string") {
                    currentEntry = currentEntry.trim();
                    currentEntry =  enclosedBrackets(currentEntry + "}") ?
                                    read(currentEntry + "}") :
                                    typify(polish(currentEntry));
                }

                notation[polish(currentComponent)] = currentEntry;

                currentComponent = "";
                currentEntry = "";
            }

            mode++;
        }

        // Mode 2 is the step between two entries: a comma token had been
        // detected, so in this step all whitespaces are skipped.
        else if (mode === 2) {
            if (!regex.rWhitespace.test(string[cursor])) {
                // Reset and parse a new entry.
                cursor--;
                mode = 0;
            }
        }

        else {
            if (mode === 0) {
                currentComponent += string[cursor];
            } else if (mode === 1) {
                if (currentEntry.trim() && currentEntry.trim()[0] !== "\"" && regex.rWhitespace.test(string[cursor])) {
                    console.error("[JSON String Parser] Values must be enclosed in quotation marks to feature whitespaces.");
                    return;
                }

                currentEntry += string[cursor];
            }
        }

        cursor++;
    }

    /**
     * Attempts to assign a "type" to a specified value.
     * @param   value - a string value to try finding a primitive value for.
     * @return  returns an equivalent primitive value if found. Otherwise,
     *          returns the original string.
     */
    function typify(value) {
        if (value === "true")
            return true;

        if (value === "false")
            return false;

        if (value === "null")
            return null;

        if (Number.parseFloat(value) == value)
            return Number.parseFloat(value);

        if (Number.parseInt(value) == value)
            return Number.parseInt(value);

        return value;
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

    /**
     * Trims enclosing quotation marks on a string, if any.
     * @param string - a string to be "polished."
     * @return returns the "polished" string, or the original string.
     */
    function polish(string) {
        string = string.trim();

        if (enclosedQuotes(string))
            return string.substring(1, string.length - 1);

        return string;
    }

    /**
     * Checks if a string, trimmed is enclosed in quotation marks.
     * @param string - some string to be tested.
     * @return returns true or false.
     */
    function enclosedQuotes(string) {
        return  regex.rEnclosedQuotes.test(string) ||
                regex.rEnclosedQuotes.test(string.trim());
    }

    /**
     * Checks if a string, trimmed is enclosed in curly brackets.
     * @param string - some string to be tested.
     * @return returns true or false.
     */
    function enclosedBrackets(string) {
        return  regex.rEnclosedBrackets.test(string) ||
                regex.rEnclosedBrackets.test(string.trim());
    }

    return notation;
}
