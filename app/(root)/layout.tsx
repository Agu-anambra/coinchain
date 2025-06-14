import { auth } from '@/auth';
import Header from '@/components/Header'
import Head from 'next/head'
import { redirect } from 'next/navigation';
import { ReactNode } from 'react'


const Layout = async ({ children }: { children: ReactNode }) => {

  const session = await auth();
  
    if (!session) {
      // If the user is already authenticated, redirect them to the home page
      redirect("/sign-in");
    }
  return (
    <main className='root-container'>
      <div className='mx-auto max-w-7xl'>
        <Header session={session} />
        <div className='mt-20 pb-20'>
          {children}
        </div>
      </div>
    </main>
  )
}

export default Layout