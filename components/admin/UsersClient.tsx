import Link from "next/link";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "USER" | null;
};

const UsersClient = async ({ userList }: { userList: User[] }) => {


  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">All Users</h1>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Role</th>
            {/* <th className="text-left p-3">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-3">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="text-lg font-bold"
                >
                  {user.fullName}
                </Link>
              </td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersClient;
