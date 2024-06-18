export class UUID {
    public static readonly generateId = () => {
        return crypto.randomUUID();
    }
}