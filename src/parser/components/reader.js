
import validate from "./validator";

export default function (string) {
    let notation = {};

    // If the string can't be validated, simply return.
    // Shallow validation to skip most of the work.
    if (!validate(string))
        return;

    
}
