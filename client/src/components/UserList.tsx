import React from "react";
import type { User } from "../types/user.types";
interface UserListProps {
  users: User[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}
const UserList: React.FC<UserListProps> = ({
  users,
  loading,
  error,
  onRefresh,
}) => {
  return (
    <div>
      <h2>User List</h2>
      <button onClick={onRefresh} disabled={loading}>
        {loading ? "Loading..." : "Refresh"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email}) - Created At:{" "}
            {new Date(user.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default UserList;
