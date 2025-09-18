import api from "../context/apiSetup";
import type { User, CreateUser, ApiResponse } from "../types/user.types";

export class UserService {
  private static readonly BASE_PATH = "/users";

  static async getAllUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await api.get<User[]>(this.BASE_PATH);
      return { data: response.data, success: true };
    } catch (error: unknown) {
      let message = "Failed to fetch users";
      if (error instanceof Error) {
        message = error.message;
      }
      return {
        data: [],
        success: false,
        message,
      };
    }
  }

  static async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await api.get<User>(`${this.BASE_PATH}/${id}`);
      return { data: response.data, success: true };
    } catch (error: unknown) {
      let message = "Failed to fetch user";
      if (error instanceof Error) {
        message = error.message;
      }
      return {
        data: {} as User,
        success: false,
        message,
      };
    }
  }

  static async createUser(user: CreateUser): Promise<ApiResponse<User>> {
    try {
      const response = await api.post<User>(this.BASE_PATH, user);
      return { data: response.data, success: true };
    } catch (error: unknown) {
      let message = "Failed to create user";
      if (error instanceof Error) {
        message = error.message;
      }
      return {
        data: {} as User,
        success: false,
        message,
      };
    }
  }

  static async updateUser(
    id: string,
    user: CreateUser
  ): Promise<ApiResponse<User>> {
    try {
      const response = await api.put<User>(`${this.BASE_PATH}/${id}`, user);
      return { data: response.data, success: true };
    } catch (error: unknown) {
      let message = "Failed to update user";
      if (error instanceof Error) {
        message = error.message;
      }
      return {
        data: {} as User,
        success: false,
        message,
      };
    }
  }

  static async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    try {
      await api.delete(`${this.BASE_PATH}/${id}`);
      return { data: true, success: true };
    } catch (error: unknown) {
      let message = "Failed to delete user";
      if (error instanceof Error) {
        message = error.message;
      }
      return {
        data: false,
        success: false,
        message,
      };
    }
  }
}
