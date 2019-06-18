import IPathComponent from "./IPathComponent";

export default interface IPathBuilder {
    addPathComponent(component : IPathComponent) : void;
    popComponent() : IPathComponent;
    getPath() : string;
    getCurrentIndex() : string;
}