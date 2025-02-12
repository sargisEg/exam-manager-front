import { pgTable, text, serial, integer, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  role: text("role", { enum: ['STUDENT', 'TEACHER', 'ADMIN'] }).notNull(),
  subgroupId: integer("subgroup_id").references(() => subgroups.id),
});

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameShort: text("name_short").notNull(),
  headOfDepartmentId: integer("head_of_department_id").references(() => users.id),
});

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year").notNull(),
});

export const subgroups = pgTable("subgroups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  groupId: integer("group_id").references(() => groups.id).notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  groupId: integer("group_id").references(() => groups.id).notNull(),
});

export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  subgroupId: integer("subgroup_id").references(() => subgroups.id).notNull(),
  location: text("location").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  maxPoints: integer("max_points").notNull(),
  status: text("status", { enum: ['UPCOMING', 'IN_PROGRESS', 'FINISHED', 'CANCELED'] }).notNull(),
  type: text("type", { enum: ['MIDTERM', 'GENERAL', 'REPEAT'] }).notNull(),
});

export const examResults = pgTable("exam_results", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => users.id).notNull(),
  examId: integer("exam_id").references(() => exams.id).notNull(),
  points: integer("points").notNull(),
});

export const teacherSubgroups = pgTable("teacher_subgroups", {
  teacherId: integer("teacher_id").references(() => users.id).notNull(),
  subgroupId: integer("subgroup_id").references(() => subgroups.id).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  username: true,
  password: true,
  email: true,
  phone: true,
  role: true,
  subgroupId: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Department = typeof departments.$inferSelect;
export type Group = typeof groups.$inferSelect;
export type Subgroup = typeof subgroups.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Exam = typeof exams.$inferSelect;
export type ExamResult = typeof examResults.$inferSelect;