import TypeChecker from "../../src/TypeChecker/TypeChecker";

test("Is a primative value", () => {
    expect(TypeChecker.isPrimative("number")).toEqual("true");
});

test("Is an array value", () => {
    expect(TypeChecker.isArray("array[number]")).toEqual("true");
});

test("Is an enum", () => {
    expect(TypeChecker.isEnum("a")).toBeTruthy();
});

test("Is type of boolean", () => {
    expect(TypeChecker.isTypeOf('boolean', true)).toBeTruthy();
})