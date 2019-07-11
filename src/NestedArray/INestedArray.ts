export default interface INestedArray {
    depth() : number;
    value() : any[];
    path() : string;
}