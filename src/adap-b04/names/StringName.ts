import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";
import { isEscaped } from "./utils";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        //precondition
        IllegalArgumentException.assert(typeof source === 'string', "Source must be a string");
        IllegalArgumentException.assert(typeof delimiter === 'undefined' || (typeof delimiter === 'string' && delimiter.length === 1), "Delimiter must be a single character string");
        IllegalArgumentException.assert(delimiter !== ESCAPE_CHARACTER, `Delimiter cannot be the escape character '${ESCAPE_CHARACTER}'`);
        super(delimiter)
        this.name = source;
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
        //postcondition
        MethodFailedException.assert(this.noComponents >= 0, "Constructor did not properly set noComponents");
        MethodFailedException.assert(StringName.instanceIsStringName(this), "Constructor did not create a valid StringName instance");
    }

    protected static instanceIsStringName(obj: any): obj is StringName {
        return AbstractName.instanceIsAbstractName(obj) &&
                "name" in obj && typeof obj.name === 'string' &&
                "noComponents" in obj && typeof obj.noComponents === 'number' && obj.noComponents >= 0;
    }

    protected static assertInstanceIsStringName(obj: any){
        InvalidStateException.assert(StringName.instanceIsStringName(obj), "Instance does not fullfill StringName prototype");
    }

    public getNoComponents(): number {
        StringName.assertInstanceIsStringName(this);
        let res =this.noComponents;
        //postcondition
        MethodFailedException.assert(typeof res === 'number' && res >= 0, "getNoComponents did not return a valid non-negative number");
        return res;
    }

    public getComponent(x: number): string {
        StringName.assertInstanceIsStringName(this);
        IllegalArgumentException.assert(typeof x === 'number' && x >= 0 && x < this.noComponents, "Index out of bounds");
        let currentComponent = 0;
        let componentStart = 0;
        let escaped = false;
        let res = "";
        for (let i = 0; i < this.name.length; i++) {
            let c = this.name.charAt(i);
            if (c === ESCAPE_CHARACTER) {
                escaped = !escaped;
            } else {
                if (c === this.delimiter && !escaped) {
                    if (currentComponent === x) {
                        res = this.name.substring(componentStart, i);
                    }
                    currentComponent++;
                    componentStart = i + 1;
                }
                escaped = false;
            }
        }
        // Last component
        if (currentComponent === x) {
            res = this.name.substring(componentStart);
        }
        //postcondition
        MethodFailedException.assert(typeof res === 'string', "getComponent did not return a valid string");
        MethodFailedException.assert(isEscaped(res, this.getDelimiterCharacter()), "getComponent returned a component with unescaped delimiter characters");
        return res;
    }

    public setComponent(n: number, c: string): void {
        StringName.assertInstanceIsStringName(this);
        IllegalArgumentException.assert(typeof n === 'number' && n >= 0 && n < this.noComponents, "Index out of bounds");
        IllegalArgumentException.assert(typeof c === 'string', "Component must be a string");
        IllegalArgumentException.assert(isEscaped(c, this.getDelimiterCharacter()), "Component must not contain unescaped delimiter characters");
        let components: string[] = [];
        let currentComponent = 0;
        let componentStart = 0;
        let escaped = false;
        let before = this.name;
        let beforeNoComponents = this.noComponents;
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
        try{
            //postcondition
            MethodFailedException.assert(this.getComponent(n) === c, "setComponent did not properly set the component");
            MethodFailedException.assert(this.getNoComponents() === beforeNoComponents, "setComponent changed the number of components");
            MethodFailedException.assert(isEscaped(this.getComponent(n), this.getDelimiterCharacter()), "setComponent set a component with unescaped delimiter characters");
        } catch (e) {
            //revert change
            this.name = before;
            this.noComponents = beforeNoComponents;
            throw e;
        }
    }

    public insert(n: number, c: string): void {
        StringName.assertInstanceIsStringName(this);
        IllegalArgumentException.assert(typeof n === 'number' && n >= 0 && n <= this.noComponents, "Index out of bounds");
        IllegalArgumentException.assert(typeof c === 'string', "Component must be a string");
        IllegalArgumentException.assert(isEscaped(c, this.getDelimiterCharacter()), "Component must not contain unescaped delimiter characters");
        let before = this.name;
        let beforeNoComponents = this.noComponents;
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
        try{
            //postcondition
            MethodFailedException.assert(this.getComponent(n) === c, "insert did not properly insert the component");
            MethodFailedException.assert(this.getNoComponents() === beforeNoComponents + 1, "insert did not increase the number of components");
            MethodFailedException.assert(isEscaped(this.getComponent(n), this.getDelimiterCharacter()), "insert set a component with unescaped delimiter characters");
        } catch (e) {
            //revert change
            this.name = before;
            this.noComponents = beforeNoComponents;
            throw e;
        }
    }

    public append(c: string): void {
        StringName.assertInstanceIsStringName(this);
        //precondition
        IllegalArgumentException.assert(typeof c === 'string', "Component must be a string");
        IllegalArgumentException.assert(isEscaped(c, this.getDelimiterCharacter()), "Component must not contain unescaped delimiter characters");
        let before = this.name;
        let beforeNoComponents = this.noComponents;
        if (this.noComponents === 0) {
            this.name = c;
        } else {
            this.name = this.name + this.delimiter + c;
        }
        this.noComponents++;
        try{
            //postcondition
            MethodFailedException.assert(this.getComponent(this.noComponents - 1) === c, "append did not properly append the component");
            MethodFailedException.assert(this.getNoComponents() === beforeNoComponents + 1, "append did not increase the number of components");
            MethodFailedException.assert(isEscaped(this.getComponent(this.noComponents - 1), this.getDelimiterCharacter()), "append set a component with unescaped delimiter characters");
        } catch (e) {
            //revert change
            this.name = before;
            this.noComponents = beforeNoComponents;
            throw e;
        }
    }

    public remove(n: number): void {
        StringName.assertInstanceIsStringName(this);
        //precondition
        IllegalArgumentException.assert(typeof n === 'number' && n >= 0 && n < this.noComponents, "Index out of bounds");
         let before = this.name;
         let beforeNoComponents = this.noComponents;
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
        try{
            //postcondition
            MethodFailedException.assert(this.getNoComponents() === beforeNoComponents - 1, "remove did not decrease the number of components");
        } catch (e) {
            //revert change
            this.name = before;
            this.noComponents = beforeNoComponents;
            throw e;
        }
    }

}