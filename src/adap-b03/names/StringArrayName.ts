import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter);
        if (other.length === 0) {
            throw new Error("Name must have at least one component");
        }
        this.components = [...other];
        if (this.delimiter.length!== 1) {
            throw new Error("Delimiter must be a single character");
        }
        if (this.delimiter === ESCAPE_CHARACTER) {
            throw new Error("Delimiter cannot be the escape character");
        }
    
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertValidIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertValidIndex(i);
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.assertValidIndex(i, true);
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.assertValidIndex(i);
        this.components.splice(i, 1);
    }

    private assertValidIndex(i: number, forInsertion: boolean = false): void {
        // Allow insertion at the end
        if (i < 0 || i >= this.components.length + (forInsertion ? 1 : 0)) {
            throw new Error("Index out of bounds");
        }
    }
}