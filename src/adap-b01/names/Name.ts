export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    /** @methodtype initialization-method */
    constructor(other: string[], delimiter?: string) {
        if (other.length === 0) {
            throw new Error("Name must have at least one component");
        }
        this.components = [...other];
        
        this.delimiter = delimiter ?? this.delimiter;
        if (this.delimiter.length!== 1) {
            throw new Error("Delimiter must be a single character");
        }
        if (this.delimiter === ESCAPE_CHARACTER) {
            throw new Error("Delimiter cannot be the escape character");
        }

    }

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    /** @methodtype conversion-method */
    public asString(delimiter: string = this.delimiter): string {
        // Remove one level of Escape characters
        return this.components.map(c => c.replace(new RegExp('\\' + ESCAPE_CHARACTER + "(.)", "g"), "$1")).join(delimiter);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    /** @methodtype conversion-method */
    public asDataString(): string {
        // Remove Escape characters for custom delimiter
        let unmasked = this.components.map(c => c.replace(new RegExp('\\' + ESCAPE_CHARACTER + "(\\"+this.delimiter+")", "g"), "$1"));
        // Add Escape characters for default delimiter (only if not already escaped)
        let masked = unmasked.map(c => c.replace(new RegExp('([^\\' + ESCAPE_CHARACTER+ '])(\\' + DEFAULT_DELIMITER + ")", "g"), '$1' + ESCAPE_CHARACTER + '$2'))
        return masked.join(DEFAULT_DELIMITER);
    }

    /** Returns properly masked component string */
    /** @methodtype get-method */
    public getComponent(i: number): string {
        this.assertValidIndex(i);
        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    /** @methodtype set-method */
    public setComponent(i: number, c: string): void {
        this.assertValidIndex(i);
        this.components[i] = c;
    }

     /** Returns number of components in Name instance */
     /** @methodtype get-method */
     public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    /** @methodtype set-method */
    public insert(i: number, c: string): void {
        this.assertValidIndex(i, true);
        this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked */
    /** @methodtype set-method */
    public append(c: string): void {
        this.components.push(c);
    }

    /** @methodtype set-method */
    public remove(i: number): void {
        this.assertValidIndex(i);
        this.components.splice(i, 1);
    }
    // @methodtype assertion-method
    private assertValidIndex(i: number, forInsertion: boolean = false): void {
        // Allow insertion at the end
        if (i < 0 || i >= this.components.length + (forInsertion ? 1 : 0)) {
            throw new Error("Index out of bounds");
        }
    }

}
