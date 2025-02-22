export interface UserDecorator {
    id: string;
    email: string;
}
export declare const User: (...dataOrPipes: unknown[]) => ParameterDecorator;
