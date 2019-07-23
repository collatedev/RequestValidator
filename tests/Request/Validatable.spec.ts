import Validatable from "../../src/Request/Validatable";
import RequestMapping from "../../src/Request/RequestMapping";
import IRequest from "../../src/Request/IRequest";

test("Should create a validatable object", () => {
    const validatable : IRequest = new Validatable({
        foo: "bar"
    }); 

    expect(validatable.getRequest()).toEqual(new RequestMapping({
        foo: "bar"
    }));
    expect(validatable.toJson()).toEqual({
        foo: "bar"
    });
});