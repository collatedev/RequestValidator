import IRequestMapping from "./IRequestMapping";

export default class RequestMapping implements IRequestMapping {
    constructor(mapping : any) {
        if (mapping === null) {
            throw new TypeError("Mapping can not be null");
        }
    }

    public keys(): string[] {
        throw new Error("Method not implemented.");
    }    
    
    public value(key: string) : any {
        throw new Error("Method not implemented.");
    }

    public has(key: string): boolean {
        throw new Error("Method not implemented.");
    }
}