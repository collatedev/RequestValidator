import IRequest from "../../src/Request/IRequest";

export default class FakeRequest implements IRequest {
    public getBody(): { [key: string]: any; } {
        return {};
    }    
    
    public getCookies(): { [key: string]: any; } {
        return {};
    }
    
    public getHeaders(): { [key: string]: any; } {
        return {};
    }
    
    public getParams(): { [key: string]: any; } {
        return {};
    }
    
    public getQuery(): { [key: string]: any; } {
        return {};
    }
}