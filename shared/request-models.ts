export interface CreateDepartmentRequest {
    name: string;
    nameShort: string;
}

export interface CreateTeacherRequest {
    fullName: string;
    password: string;
    email: string;
    phone: string;
}

export interface CreateGroupRequest {
    name: string;
    startYear: number;
    endYear: number;
}

export interface CreateSubgroupRequest {
    name: string;
}

export interface CreateCourseRequest {
    name: string;
    teacherId: string;
}

export interface CreateStudentRequest {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    subgroupId: string;
}

export interface EditExamRequest {
    title: string;
    courseId: string;
    subgroupId: string
    location: string;
    startDate: number;
    endDate: number;
    maxPoints: number;
}
