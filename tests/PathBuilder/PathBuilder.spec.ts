import IPathBuilder from "../../src/PathBuilder/IPathBuilder";
import PathBuilder from "../../src/PathBuilder/PathBuilder";
import PropertyPathComponent from "../../src/PathBuilder/PropertyPathComponent";

test("Gets an empty path", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    expect(pathBuilder.getPath()).toEqual("");
    expect(pathBuilder.getCurrentIndex()).toEqual("");
});

test("Gets a component path", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));

    expect(pathBuilder.getPath()).toEqual("foo");
    expect(pathBuilder.getCurrentIndex()).toEqual("");
});