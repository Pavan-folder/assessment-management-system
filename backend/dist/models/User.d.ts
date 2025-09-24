import { User as UserType } from '../types';
export declare class User implements UserType {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(email: string, password: string, firstName: string, lastName: string);
    hashPassword(): Promise<void>;
    verifyPassword(password: string): Promise<boolean>;
    updateProfile(firstName: string, lastName: string): void;
    getFullName(): string;
    toSafeJSON(): Omit<UserType, 'password'>;
    static fromDatabase(record: any): User;
    static isValidEmail(email: string): boolean;
    static isValidPassword(password: string): {
        isValid: boolean;
        errors: string[];
    };
    static validate(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }): {
        isValid: boolean;
        errors: string[];
    };
}
//# sourceMappingURL=User.d.ts.map