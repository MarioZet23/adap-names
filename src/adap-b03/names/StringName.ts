import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter)
        this.name = source;
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

}