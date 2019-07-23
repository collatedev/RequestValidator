import IPathComponent from "../../src/PathBuilder/IPathComponent";
import PropertyPathComponent from "../../src/PathBuilder/PropertyPathComponent";

test("Should create a path component with out double quotes", () => {
    const component : IPathComponent = new PropertyPathComponent("mode");

    expect(component.toString()).toEqual(".mode");
});

test("Should create a path component with double quotes", () => {
    const component : IPathComponent = new PropertyPathComponent("hub.mode");

    expect(component.toString()).toEqual(".\"hub.mode\"");
});