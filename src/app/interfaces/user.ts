import { Role } from "../enums/role";

export interface User {
    id: string,
    name: string,
    email: string,
    role: Role,
}
