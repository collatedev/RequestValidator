import IPathBuilder from "../../src/PathBuilder/IPathBuilder";
import PathBuilder from "../../src/PathBuilder/PathBuilder";
import PropertyPathComponent from "../../src/PathBuilder/PropertyPathComponent";
import IndexPathComponent from "../../src/PathBuilder/IndexPathComponent";
import IPathComponent from "../../src/PathBuilder/IPathComponent";

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

test("Gets an index path", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    pathBuilder.addPathComponent(new IndexPathComponent(0));

    expect(pathBuilder.getPath()).toEqual("[0]");
    expect(pathBuilder.getCurrentIndex()).toEqual("[0]");
});

test("Gets an indexed path", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));
    pathBuilder.addPathComponent(new IndexPathComponent(1));

    expect(pathBuilder.getPath()).toEqual("foo[1]");
    expect(pathBuilder.getCurrentIndex()).toEqual("[1]");
});

test("Gets a path where the property is on an index", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));
    pathBuilder.addPathComponent(new IndexPathComponent(1));
    pathBuilder.addPathComponent(new PropertyPathComponent("bar"));

    expect(pathBuilder.getPath()).toEqual("foo[1].bar");
    expect(pathBuilder.getCurrentIndex()).toEqual("");
});

test("Gets a path where root is an index and it has a property", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    pathBuilder.addPathComponent(new IndexPathComponent(1));
    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));

    expect(pathBuilder.getPath()).toEqual("[1].foo");
    expect(pathBuilder.getCurrentIndex()).toEqual("");
});

test("Gets a path where a component has been removed", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));
    pathBuilder.addPathComponent(new IndexPathComponent(1));
    pathBuilder.addPathComponent(new PropertyPathComponent("bar"));

    const poppedComponent : IPathComponent = pathBuilder.popComponent();

    expect(pathBuilder.getPath()).toEqual("foo[1]");
    expect(pathBuilder.getCurrentIndex()).toEqual("[1]");
    expect(poppedComponent.toString()).toEqual(".bar");
});

test("Throws an error when a component is popped from an empty component", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    expect(() => {
        pathBuilder.popComponent();
    }).toThrow(RangeError);
});