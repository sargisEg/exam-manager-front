
export enum UserRole {
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
    ADMIN = "ADMIN"
}

export interface SignInResponse {
    token: string;
    refreshToken: string;
}

export interface UserResponse {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    role: UserRole;
}

export interface DepartmentResponse {
    id: string;
    name: string;
    nameShort: string;
}

export interface GroupResponse {
    id: string;
    name: string;
    startYear: number;
    endYear: number;
    department: DepartmentResponse;
}

export interface SubgroupResponse {
    id: string;
    name: string;
    group: GroupResponse;
}

export interface CourseResponse {
    id: string;
    name: string;
    group: GroupResponse;
    teacher: UserResponse;
}

export interface Page<T> {
    content: T[];
    page: {
        totalElements: number;
        totalPages: number;
    }
}