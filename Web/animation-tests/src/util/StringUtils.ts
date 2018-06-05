export const stringToBool: (theString: string) => boolean =
    (theString: string) => {
        try {
            return !!JSON.parse(theString);
        } catch (e) {
            throw new Error('Could not parse string.');
        }
    };

export const boolToString: (theBool: boolean) => string =
    (theBool: boolean) => {
        return '' + theBool;
    };
