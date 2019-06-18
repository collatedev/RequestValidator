import IPathBuilder from "../../src/PathBuilder/IPathBuilder";
import PathBuilder from "../../src/PathBuilder/PathBuilder";

test("Gets an empty path", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();

    expect(pathBuilder.getCurrentIndex()).toEqual("");
    expect(pathBuilder.getCurrentIndex()).toEqual("");
});