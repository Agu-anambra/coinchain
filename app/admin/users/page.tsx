// app/admin/users/page.tsx (Server Component)
import UsersClient from '@/components/UsersClient';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';

export default async function AdminUsersPage() {
  const allUsers = await db.select().from(users); // <-- This is an array of user rows

  return <UsersClient userList={allUsers} />;
}
