import IRequestMapping from "../../src/Request/IRequestMapping";
import RequestMapping from "../../src/Request/RequestMapping";

test('should fail to create request mapping due to null mapping', () => {
    expect(createMapping(null)).toThrow(TypeError);
});

function createMapping(mapping : any) : () => IRequestMapping {
    return () : IRequestMapping => {
        return new RequestMapping(mapping);
    };
}