import INestedArray from './INestedArray';

export default class NestedArray implements INestedArray {
    private readonly _value : any[];
    private readonly _depth : number;
    private readonly _path : string;

    constructor(value : any, depth : number, path : string) {
        if (value === null) {
            throw new Error("Array value must not be null");
        }
        if (!Array.isArray(value)) {
            throw new Error("Value must be an array");
        }
        if (depth < 0) {
            throw new Error("Depth can not be less than 0");
        }
        this._value = this.copyArray(value);
        this._depth = depth;
        this._path = path;
    }

    private copyArray(toCopy : any[]) : any[] {
        const newArray : any[] = new Array();
        for (const element of toCopy) {
            newArray.push(element);
        }
        return newArray;
    }

    public value() : any[] {
        return this._value;
    }

    public depth() : number {
        return this._depth;
    }

    public path() : string {
        return this._path;
    }
}