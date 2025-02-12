import { users, type User, type InsertUser, UserRole } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Initialize with default users
    const defaultUsers: InsertUser[] = [
      {
        username: "admin",
        password: "c9a0182c00d8c0c35dd95c2c60b1f4a1788e24d61ef4873496c4ddb2ee90ec39c8228e5ce3f338e94c4aa557058e4ad6e0966dcd19da2d6c84f834127203f2aa.c1c224b03cd9bc7b6a86d77f5dace40b", // admin123
        name: "Admin User",
        email: "admin@exam.com",
        phone: "1234567890",
        role: UserRole.ADMIN,
        subgroupId: null,
      },
      {
        username: "teacher",
        password: "9f41dae3619d19f6fb550e3ae175e8ea9cc9e4bec8cd761446fe6cee0690eb8462ab78ec1f4f77937ddb3599394c812b5b1d52ea30c982d67d96f7dd8fc3f5c6.3c5df1c17150b506", // teacher123
        name: "Teacher User",
        email: "teacher@exam.com",
        phone: "1234567891",
        role: UserRole.TEACHER,
        subgroupId: null,
      },
      {
        username: "student",
        password: "7e9b52200c35985245a1c8d9e608834d9909fb047e3b4d3376b92a3385e75b4c1e1e7f289e0f59aa51bf47f8d5db429512ffb1aebf2951c26e6f9f7b3f2910c9.d70aa97f3076adb3", // student123
        name: "Student User",
        email: "student@exam.com",
        phone: "1234567892",
        role: UserRole.STUDENT,
        subgroupId: null,
      },
    ];

    // Add default users
    defaultUsers.forEach(user => {
      const id = this.currentId++;
      this.users.set(id, { ...user, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      subgroupId: insertUser.subgroupId || null 
    };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();