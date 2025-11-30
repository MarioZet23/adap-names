import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { isEscaped} from "./utils";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        //precondition
        IllegalArgumentException.assert(Array.isArray(other) && other.length > 0 && other.every(c => typeof c === 'string'), "Other must be an array of at least 1 string");
        IllegalArgumentException.assert(typeof delimiter === 'undefined' || (typeof delimiter === 'string' && delimiter.length === 1), "Delimiter must be a single character string");
        IllegalArgumentException.assert(delimiter !== ESCAPE_CHARACTER, `Delimiter cannot be the escape character '${ESCAPE_CHARACTER}'`);
        IllegalArgumentException.assert(other.every(c => isEscaped(c, delimiter ?? DEFAULT_DELIMITER)), "Components must not contain unescaped delimiter characters");
        super(delimiter);
        this.components = [...other];
        //postcondition
        MethodFailedException.assert(this.getNoComponents() === other.length, "Constructor did not properly set components");
        MethodFailedException.assert(StringArrayName.instanceIsStringArrayName(this), "Constructor did not create a valid StringArrayName instance");
        
    
    }

    protected static instanceIsStringArrayName(obj: any): obj is StringArrayName {
        return AbstractName.instanceIsAbstractName(obj) &&
                "components" in obj && Array.isArray(obj.components) && obj.components.every((c: any) => typeof c === 'string');
    }

    protected static assertInstanceIsStringArrayName(obj: any){
        InvalidStateException.assert(StringArrayName.instanceIsStringArrayName(obj), "Instance does not fullfill StringArrayName prototype");
    }

    public getNoComponents(): number {
        StringArrayName.assertInstanceIsStringArrayName(this);
        let res = this.components.length;
        //postcondition
        MethodFailedException.assert(typeof res === 'number' && res >= 0, "getNoComponents did not return a valid non-negative number");
        return res;
    }

    public getComponent(i: number): string {
        StringArrayName.assertInstanceIsStringArrayName(this);
        IllegalArgumentException.assert(typeof i === 'number' && i >= 0 && i < this.getNoComponents(), "Index out of bounds");
        let res = this.components[i];
        //postcondition
        MethodFailedException.assert(typeof res === 'string', "getComponent did not return a valid string");
        MethodFailedException.assert(isEscaped(res, this.getDelimiterCharacter()), "getComponent returned a component with unescaped delimiter characters");
        return res;
    }

    public setComponent(i: number, c: string): void {
        StringArrayName.assertInstanceIsStringArrayName(this);
        IllegalArgumentException.assert(typeof i === 'number' && i >= 0 && i < this.getNoComponents(), "Index out of bounds");
        IllegalArgumentException.assert(typeof c === 'string', "Component must be a string");
        IllegalArgumentException.assert(isEscaped(c, this.getDelimiterCharacter()), "Component must not contain unescaped delimiter characters");
        let before = this.components[i];
        this.components[i] = c;
        //postcondition
        try {
            MethodFailedException.assert(this.components[i] === c, "setComponent did not properly set the component");
            MethodFailedException.assert(this.getNoComponents() === this.components.length, "setComponent changed the number of components");
            MethodFailedException.assert(isEscaped(this.components[i], this.getDelimiterCharacter()), "setComponent set a component with unescaped delimiter characters");
        } catch (e) {
            //revert change
            this.components[i] = before;
            throw e;
        }
    }

    public insert(i: number, c: string): void {
        StringArrayName.assertInstanceIsStringArrayName(this);
        IllegalArgumentException.assert(typeof i === 'number' && i >= 0 && i <= this.getNoComponents(), "Index out of bounds");
        IllegalArgumentException.assert(typeof c === 'string', "Component must be a string");
        IllegalArgumentException.assert(isEscaped(c, this.getDelimiterCharacter()), "Component must not contain unescaped delimiter characters");
        let before = [...this.components];
        this.components.splice(i, 0, c);
        //postcondition
        try {
            MethodFailedException.assert(this.components[i] === c, "insert did not properly insert the component");
            MethodFailedException.assert(this.getNoComponents() === before.length + 1, "insert did not increase the number of components");
            MethodFailedException.assert(isEscaped(this.components[i], this.getDelimiterCharacter()), "insert set a component with unescaped delimiter characters");
        } catch (e) {
            //revert change
            this.components = before;
            throw e;
        }
    }

    public append(c: string): void {
        StringArrayName.assertInstanceIsStringArrayName(this);
        //precondition
        IllegalArgumentException.assert(typeof c === 'string', "Component must be a string");
        IllegalArgumentException.assert(isEscaped(c, this.getDelimiterCharacter()), "Component must not contain unescaped delimiter characters");
        let before = [...this.components];
        this.components.push(c);
        //postcondition
        try {
            MethodFailedException.assert(this.components[this.components.length - 1] === c, "append did not properly append the component");
            MethodFailedException.assert(this.getNoComponents() === before.length + 1, "append did not increase the number of components");
            MethodFailedException.assert(isEscaped(this.components[this.components.length - 1], this.getDelimiterCharacter()), "append set a component with unescaped delimiter characters");
        } catch (e) {
            //revert change
            this.components = before;
            throw e;
        }
    }

    public remove(i: number): void {
        StringArrayName.assertInstanceIsStringArrayName(this);
        //precondition
        IllegalArgumentException.assert(typeof i === 'number' && i >= 0 && i < this.getNoComponents(), "Index out of bounds");
        let before = [...this.components];
        this.components.splice(i, 1);
        //postcondition
        try {
            MethodFailedException.assert(this.getNoComponents() === before.length - 1, "remove did not decrease the number of components");
        } catch (e) {
            //revert change
            this.components = before;
            throw e;
        }
    }
}