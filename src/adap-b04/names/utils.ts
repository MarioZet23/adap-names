import { ESCAPE_CHARACTER } from "../common/Printable";

export function escape(str: string, delim: string) {
    const regex = new RegExp(`(?<!\\${ESCAPE_CHARACTER})\\${delim}`, "g");
    return str.replaceAll(regex, ESCAPE_CHARACTER + delim);
}

export function unescape(str: string, delim: string) {
    const regex = new RegExp(`\\${ESCAPE_CHARACTER}\\${delim}`, "g");
    return str.replaceAll(regex, delim);
}

export function isEscaped(str: string, delim: string): boolean {
    //return true if every occurrence of delim is preceded by ESCAPE_CHARACTER
    const regex = new RegExp(`(?<!\\${ESCAPE_CHARACTER})\\${delim}`);
    return !regex.test(str);
}
