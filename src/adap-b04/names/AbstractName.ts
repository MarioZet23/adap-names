import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { escape, unescape } from "./utils";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        //precondition
        IllegalArgumentException.assert(typeof delimiter === 'string' && delimiter.length === 1, "Delimiter must be a single character string");
        IllegalArgumentException.assert(delimiter !== ESCAPE_CHARACTER, `Delimiter cannot be the escape character '${ESCAPE_CHARACTER}'`);
        this.delimiter = delimiter;
        //postcondition
        MethodFailedException.assert(AbstractName.instanceIsAbstractName(this), "Constructor did not create a valid AbstractName instance");
    }

    protected static instanceIsName(obj: any): obj is Name {
        return "clone" in obj && typeof obj.clone === 'function' &&
                "asString" in obj && typeof obj.asString === 'function' &&
                "toString" in obj && typeof obj.toString === 'function' &&
                "asDataString" in obj && typeof obj.asDataString === 'function' &&
                "isEqual" in obj && typeof obj.isEqual === 'function' &&
                "getHashCode" in obj && typeof obj.getHashCode === 'function' &&
                "isEmpty" in obj && typeof obj.isEmpty === 'function' &&
                "getDelimiterCharacter" in obj && typeof obj.getDelimiterCharacter === 'function' &&
                "getNoComponents" in obj && typeof obj.getNoComponents === 'function' &&
                "getComponent" in obj && typeof obj.getComponent === 'function' &&
                "setComponent" in obj && typeof obj.setComponent === 'function' &&
                "insert" in obj && typeof obj.insert === 'function' &&
                "append" in obj && typeof obj.append === 'function' &&
                "remove" in obj && typeof obj.remove === 'function' &&
                "concat" in obj && typeof obj.concat === 'function';
    }

    protected static instanceIsAbstractName(obj: any): obj is AbstractName {
        return AbstractName.instanceIsName(obj) &&
                "delimiter" in obj && typeof obj.delimiter === 'string' && obj.delimiter.length === 1 && obj.delimiter !== ESCAPE_CHARACTER;
    }

    protected static assertInstanceIsAbstractName(obj: any){
        InvalidStateException.assert(AbstractName.instanceIsAbstractName(obj), "Instance does not fullfill AbstractName prototype");
    }

    public clone(): Name {
        AbstractName.assertInstanceIsAbstractName(this);
        let res = Object.create(this);
        //postcondition
        MethodFailedException.assert(AbstractName.instanceIsName(res), "Clone did not create a valid AbstractName instance");
        return res;
    }

    public asString(delimiter: string = this.delimiter): string {
        AbstractName.assertInstanceIsAbstractName(this);

        //precondition
        IllegalArgumentException.assert(typeof delimiter === 'string' && delimiter.length === 1, "Delimiter must be a single character string");
        IllegalArgumentException.assert(delimiter !== ESCAPE_CHARACTER, `Delimiter cannot be the escape character '${ESCAPE_CHARACTER}'`);
        let components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            let comp = this.getComponent(i);
            comp = unescape(comp, this.delimiter);
            components.push(comp);
        }
        let res = components.join(delimiter);
        //postcondition
        MethodFailedException.assert(typeof res === 'string', "asString did not return a valid string");
        return res;
    }

    public toString(): string {
        AbstractName.assertInstanceIsAbstractName(this);
        let res = this.asDataString();
        //postcondition
        MethodFailedException.assert(typeof res === 'string', "toString did not return a valid string");
        return res;
    }

    public asDataString(): string {
        AbstractName.assertInstanceIsAbstractName(this);
        let components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            let comp = this.getComponent(i);
            comp = unescape(comp, this.delimiter);
            comp = escape(comp, DEFAULT_DELIMITER);
            components.push(comp);
        }
        let res =  components.join(DEFAULT_DELIMITER);
        //postcondition
        MethodFailedException.assert(typeof res === 'string', "asDataString did not return a valid string");
        return res;
    }

    public isEqual(other: Name): boolean {
        AbstractName.assertInstanceIsAbstractName(this);
        //precondition
        IllegalArgumentException.assert(AbstractName.instanceIsName(other), "Other is not a valid Name instance");
        return this.asDataString() === other.asDataString() && this.getDelimiterCharacter() === other.getDelimiterCharacter();
    }

    public getHashCode(): number {
        AbstractName.assertInstanceIsAbstractName(this);
        let hashCode: number = 0;
        const s: string = this.toString() + this.getDelimiterCharacter();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        AbstractName.assertInstanceIsAbstractName(this);
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        AbstractName.assertInstanceIsAbstractName(this);
        let res = this.delimiter;
        //postcondition
        MethodFailedException.assert(res.length === 1, "getDelimiterCharacter did not return a valid single character string");
        return res;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        AbstractName.assertInstanceIsAbstractName(this);
        //precondition
        IllegalArgumentException.assert(AbstractName.instanceIsName(other), "Other is not a valid Name instance");
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}