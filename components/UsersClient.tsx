'use client';

import { useTransition } from 'react';
// import { updateUserRole } from '@/actions/admin-actions';
import { toast } from 'sonner'; // Shadcn toast
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { updateUserRole } from '@/lib/actions/auth';

type User = {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'USER'| null ;
};

const UsersClient = async ({ userList }: {userList:User[]}) => {
  const [isPending, startTransition] = useTransition();


  const allUsers: User[] = await db.select().from(users);



  const handleRoleChange = (userId: string, newRole: 'ADMIN' | 'USER') => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('newRole', newRole);

    startTransition(async () => {
      try {
        await updateUserRole(formData);
        toast.success(`User is now ${newRole}`);
      } catch {
        toast.error('Failed to update user role');
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">All Users</h1>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Role</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.map(user => (
            <tr key={user.id} className="border-t">
              <td className="p-3">{user.fullName}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3 space-x-2">
                {user.role !== 'ADMIN' ? (
                  <button
                    onClick={() => handleRoleChange(user.id, 'ADMIN')}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    disabled={isPending}
                  >
                    Make Admin
                  </button>
                ) : (
                  <button
                    onClick={() => handleRoleChange(user.id, 'USER')}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    disabled={isPending}
                  >
                    Demote to User
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default UsersClient;