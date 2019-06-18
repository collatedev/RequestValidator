import IPathBuilder from "./IPathBuilder";
import IPathComponent from "./IPathComponent";
import IndexPathComponent from "./IndexPathComponent";

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
        if (path.startsWith(".")) {
            path = path.substring(1, path.length);
        }
        return path;
    }

    public getCurrentIndex() : string {
        let currentIndex : string = "";
        let i : number = this.pathComponents.length - 1;
        while (this.pathComponents[i] instanceof IndexPathComponent) {
            currentIndex += this.pathComponents[i--].toString();
        }
        return currentIndex;
    }

    public addPathComponent(component : IPathComponent) : void {
        this.pathComponents.push(component);
    }

    public popComponent() : IPathComponent {
        const poppedComponent : IPathComponent | undefined = this.pathComponents.pop();
        if (poppedComponent === undefined) {
            throw new RangeError("Can not pop a component from an empty stack");
        }
        return poppedComponent;
    }
}