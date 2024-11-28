import React from "react";
import "./style.css";
const Table = ({ data = [] }) => {
  if (!Array.isArray(data)) {
    console.error("Dữ liệu không phải là mảng");
    return <div>Error: Invalid data format</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {data.map((user) => (
          <tr key={user.id}>
            <td>{user.email}</td>
            <td>{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
