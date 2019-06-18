import IPathBuilder from "./IPathBuilder";
import IPathComponent from "./IPathComponent";

export default class PathBuilder implements IPathBuilder {
    private pathComponents : IPathComponent[];

    constructor() {
        this.pathComponents = [];
    }

    public getPath() : string {
        let path : string = "";
        for (const component of this.pathComponents) {
            path += component.toString();
        }
        path = path.substring(1, path.length);
        return path;
    }

    public getCurrentIndex() : string {
        return "";
    }

    public addPathComponent(component : IPathComponent) : void {
        this.pathComponents.push(component);
    }
}