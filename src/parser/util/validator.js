
export default function (string) {
    // Just find that an opening bracket closes.
    if (typeof string !== "string")
        return false;

    let i,
        tracker = [];

    for (i of string) {
        if (i === "{")
            tracker.push(0);
        else if (i === "}") {
            if (!tracker.length)
                return false;

            if (tracker[tracker.length - 1] === 0) {
                tracker.pop();
                continue;
            }

            return false;
        }
    }

    return !tracker.length;
}
