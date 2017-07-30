
import reader from "./components/reader";

export default class Parser {
    constructor(jsonString) {
        this.str = jsonString;
    }

    parse() {
        // return a parsed and validated object in JSON.
        return reader(this.str);
    }

    static parse(jsonString) {
        return reader(jsonString);
    }

    static parseAll(...arrayOfStrings) {
        let i,
            arrayOfObjects = [];

        for (i of arrayOfStrings) {
            arrayOfObjects.push(reader(i));
        }

        return arrayOfObjects;
    }
}
