import IRequest from "../src/Request/IRequest";

export default class FakeRequest implements IRequest {
    public getBody(): { [key: string]: any; } {
        throw new Error("Method not implemented.");
    }    
    
    public getCookie(): { [key: string]: any; } {
        throw new Error("Method not implemented.");
    }
    
    public getHeaders(): { [key: string]: any; } {
        throw new Error("Method not implemented.");
    }
    
    public getParams(): { [key: string]: any; } {
        throw new Error("Method not implemented.");
    }
    
    public getQuery(): { [key: string]: any; } {
        throw new Error("Method not implemented.");
    }
}