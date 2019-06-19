import IPathComponent from "./IPathComponent";

export default class PropertyPathComponent implements IPathComponent {
    private property : string;

    constructor(property : string) {
        this.property = property;
    }

    public toString() : string {
        return `.${this.property}`;
    }
}