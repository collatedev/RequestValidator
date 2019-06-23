export default class TypeChecker {
    public static readonly RootType : string = "request";

    private static readonly PrimativeTypes : string[] = ["string", "boolean", "number"];

    public static isArray(fieldType : string) : boolean {
		return fieldType.startsWith("array");
	}

    public static isEnum(fieldType : string) : boolean {
		return fieldType === "enum";
	}

	public static isTypeOf(type : string, value : any) : boolean {
		return typeof value === type;
	}

	public static isPrimative(fieldType : string) : boolean {
		return this.PrimativeTypes.includes(fieldType);
	}
}