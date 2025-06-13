import Header from '@/components/Header'
import Head from 'next/head'
import { ReactNode } from 'react'


const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='root-container'>
      <div className='mx-auto max-w-7xl'>
        <Header />
        <div className='mt-20 pb-20'>
          {children}
        </div>
      </div>


      <script
        type="module"
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
      />
      <script
        noModule
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
      />

      <script src="/assets/js/script.js" />
    </main>
  )
}

export default Layout