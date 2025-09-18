import React, { useState, useEffect } from "react";
import UserList from "../components/UserList";
import { UserService } from "../services/userService";
import type { User } from "../types/user.types";
const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const response = await UserService.getAllUsers();
    if (response.success) {
      setUsers(response.data);
    } else {
      setError(response.message || "Failed to fetch users");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <UserList
      users={users}
      loading={loading}
      error={error}
      onRefresh={fetchUsers}
    />
  );
};

export default Users;
