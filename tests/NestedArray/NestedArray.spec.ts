import INestedArray from "../../src/NestedArray/INestedArray";
import NestedArray from "../../src/NestedArray/NestedArray";

test("Creates a nested array", () => {
    const nestedArray : INestedArray = new NestedArray([], 0, "foo");

    expect(nestedArray.depth()).toEqual(0);
    expect(nestedArray.value()).toEqual([]);
    expect(nestedArray.path()).toEqual("foo");
});

test("Creates a nested array with null array", () => {
    expect(() => {
        getNestedArray(null, 0, "foo");
    }).toThrow(new Error("Array value must not be null"));
});

test("Creates a nested array with non array value", () => {
    expect(() => {
        getNestedArray(1, 0, "foo");
    }).toThrow(new Error("Value must be an array"));
});

test("Creates a nested array with illegal depth", () => {
    expect(() => {
        getNestedArray([], -1, "foo");
    }).toThrow(new Error("Depth can not be less than 0"));
});

function getNestedArray(value : any, depth : number, path : string) : NestedArray {
    return new NestedArray(value, depth, path);
}