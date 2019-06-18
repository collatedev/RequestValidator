import IPathBuilder from "./IPathBuilder";
import IPathComponent from "./IPathComponent";

export default class PathBuilder implements IPathBuilder {
    public getPath() : string {
        return "";
    }

    public getCurrentIndex() : string {
        return "";
    }

    public addPathComponent(component : IPathComponent) : void {
        throw new Error("Method not implemented");
    }
}