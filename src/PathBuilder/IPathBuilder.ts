import IPathComponent from "./IPathComponent";

export default interface IPathBuilder {
    addPathComponent(component : IPathComponent) : void;
    getPath() : string;
    getCurrentIndex() : string;
}