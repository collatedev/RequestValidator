import IRequestMapping from "./IRequestMapping";

export default class RequestMapping implements IRequestMapping {
    private mapping : Map<string, any>;

    constructor(json : any) {
        if (json === null) {
            throw new TypeError("Mapping can not be null");
        }
        if (typeof json !== 'object') {
            throw new TypeError("Mapping must be an object");
        }

        this.mapping = new Map<string, any>();
    }

    public keys(): string[] {
        const keys : string[] = [];
        for (const key of this.mapping.keys()) {
            keys.push(key);
        }
        return keys;
    }    
    
    public value(key: string) : any {
        return this.mapping.get(key);
    }

    public has(key: string): boolean {
        return this.mapping.has(key);
    }
}