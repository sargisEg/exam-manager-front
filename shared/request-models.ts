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
