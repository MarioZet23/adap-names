import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.name = source;
        this.delimiter = delimiter ?? this.delimiter;
        if (this.delimiter.length!== 1) {
            throw new Error("Delimiter must be a single character");
        }
        if (this.delimiter === ESCAPE_CHARACTER) {
            throw new Error("Delimiter cannot be the escape character");
        }
        // Count components
        
        this.noComponents = 1;
        let escaped = false;
        for (let i = 0; i < this.name.length; i++) {
            let c = this.name.charAt(i);
            if (c === ESCAPE_CHARACTER) {
                escaped = !escaped;
            } else {
                if (c === this.delimiter && !escaped) {
                    this.noComponents++;
                }
                escaped = false;
            }
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        if (delimiter.length !== 1) {
            throw new Error("Delimiter must be a single character");
        }
        if (delimiter === ESCAPE_CHARACTER) {
            throw new Error("Delimiter cannot be the escape character");
        }
        let masked: string;
        if (delimiter !== this.delimiter) {
            // Replace non escaped current delimiters with non escaped new delimiters
            masked = this.name.replace(new RegExp('([^\\' + ESCAPE_CHARACTER+ '])(\\' + this.delimiter + ")", "g"), '$1' + delimiter);
        }else {
            masked = this.name;
        }
        // Remove one layer of escaping
        return masked.replace(new RegExp('\\' + ESCAPE_CHARACTER + "(\\"+this.delimiter+")", "g"), "$1");
    }

    public asDataString(): string {
        // add one level of escaping to default delimiter if current delimiter is different
        let escaped: string;
        if (this.delimiter !== DEFAULT_DELIMITER) {
            // Escape existing default delimiters
            escaped = this.name.replace(new RegExp('([^\\' + ESCAPE_CHARACTER+ '])(\\' + DEFAULT_DELIMITER + ")", "g"), '$1' + ESCAPE_CHARACTER + '$2');
            // Replace current delimiters with default delimiters
            escaped = escaped.replace(new RegExp('([^\\' + ESCAPE_CHARACTER+ '])(\\' + this.delimiter + ")", "g"), '$1' + DEFAULT_DELIMITER);
            // Remove existing escaping for current delimiter
            return escaped.replace(new RegExp('([\\' + ESCAPE_CHARACTER+ '])(\\' + this.delimiter + ")", "g"),'$2');
        } else {
            return this.name;
        }
        // replace current delimiter with default delimiter
        return escaped.replace(new RegExp('([^\\' + ESCAPE_CHARACTER+ '])(\\' + this.delimiter + ")", "g"), '$1' + DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        if (x < 0 || x >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        let currentComponent = 0;
        let componentStart = 0;
        let escaped = false;
        for (let i = 0; i < this.name.length; i++) {
            let c = this.name.charAt(i);
            if (c === ESCAPE_CHARACTER) {
                escaped = !escaped;
            } else {
                if (c === this.delimiter && !escaped) {
                    if (currentComponent === x) {
                        return this.name.substring(componentStart, i);
                    }
                    currentComponent++;
                    componentStart = i + 1;
                }
                escaped = false;
            }
        }
        // Last component
        if (currentComponent === x) {
            return this.name.substring(componentStart);
        }
        throw new Error("Index out of bounds");
    }

    public setComponent(n: number, c: string): void {
        if (n < 0 || n >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        let components: string[] = [];
        let currentComponent = 0;
        let componentStart = 0;
        let escaped = false;
        for (let i = 0; i < this.name.length; i++) {
            let ch = this.name.charAt(i);
            if (ch === ESCAPE_CHARACTER) {
                escaped = !escaped;
            } else {
                if (ch === this.delimiter && !escaped) {
                    if (currentComponent === n) {
                        components.push(c);
                    } else {
                        components.push(this.name.substring(componentStart, i));
                    }
                    currentComponent++;
                    componentStart = i + 1;
                }
                escaped = false;
            }
        }
        // Last component
        if (currentComponent === n) {
            components.push(c);
        } else {
            components.push(this.name.substring(componentStart));
        }
        this.name = components.join(this.delimiter);
    }

    public insert(n: number, c: string): void {
        if (n < 0 || n > this.noComponents) {
            throw new Error("Index out of bounds");
        }
        if (this.noComponents === 0) {
            this.name = c;
            this.noComponents++;
            return;
        }else if (this.noComponents === 1 && this.name === "") {
            if (n === 0) {
                this.name = c + this.delimiter;
            } else {
                this.name = this.delimiter + c;
            }
            this.noComponents++;
            return;
        }
        let components: string[] = [];
        let currentComponent = 0;
        let componentStart = 0;
        let escaped = false;
        for (let i = 0; i < this.name.length; i++) {
            let ch = this.name.charAt(i);
            if (ch === ESCAPE_CHARACTER) {
                escaped = !escaped;
            } else {
                if (ch === this.delimiter && !escaped) {
                    
                    components.push(this.name.substring(componentStart, i));
                    currentComponent++;
                    componentStart = i + 1;
                    if (currentComponent === n) {
                        components.push(c);
                    }
                }
                escaped = false;
            }
        }
        components.push(this.name.substring(componentStart, this.name.length));
        currentComponent++;
        // Last component
        if (currentComponent === n) {
            components.push(c);
        }
        // components.push(this.name.substring(componentStart));
        this.name = components.join(this.delimiter);
        this.noComponents++;
    }

    public append(c: string): void {
        if (this.noComponents === 0) {
            this.name = c;
        } else {
            this.name = this.name + this.delimiter + c;
        }
        this.noComponents++;
    }

    public remove(n: number): void {
        if (n < 0 || n >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        let components: string[] = [];
        let currentComponent = 0;
        let componentStart = 0;
        let escaped = false;
        for (let i = 0; i < this.name.length; i++) {
            let ch = this.name.charAt(i);
            if (ch === ESCAPE_CHARACTER) {
                escaped = !escaped;
            } else {
                if (ch === this.delimiter && !escaped) {
                    if (currentComponent !== n) {
                        components.push(this.name.substring(componentStart, i));
                    }
                    currentComponent++;
                    componentStart = i + 1;
                }
                escaped = false;
            }
        }
        // Last component
        if (currentComponent !== n) {
            components.push(this.name.substring(componentStart));
        }
        this.name = components.join(this.delimiter);
        this.noComponents--;
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}