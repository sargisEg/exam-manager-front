
export enum UserRole {
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
    ADMIN = "ADMIN"
}

export enum ExamStatus {
    UPCOMING = "UPCOMING",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED",
    CANCELED = "CANCELED"
}

export enum ExamType {
    MIDTERM = "MIDTERM",
    GENERAL = "GENERAL",
    REPEAT = "REPEAT"
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

export interface TeacherResponse {
    user: UserResponse;
    courses: CourseResponse[];
}

export interface StudentResponse {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    subgroup: SubgroupResponse;
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

export interface ExamResponse {
    id: string;
    title: string;
    course: CourseResponse;
    subgroup: SubgroupResponse;
    location: string;
    startDate: number;
    endDate: number;
    maxPoints: number;
    isGranted: boolean;
    status: ExamStatus;
    type: ExamType;
}

export interface ExamResultResponse {
    id: string;
    exam: ExamResponse;
    studentId: string;
    points: number;
}

export interface Page<T> {
    content: T[];
    page: {
        totalElements: number;
        totalPages: number;
    }
}