'use client'
import AuthForm from '@/components/AuthForm'
import { signInWithCredentials } from '@/lib/actions/auth'
import { signInSchema } from '@/lib/validations'
import React from 'react'

const page = () => {
  return (
    <AuthForm 
    type="SIGN_IN"
    schema={signInSchema} // Replace with actual schema if needed
    defaultValues={{ email: '', password: '' }} // Adjust default values as necessary 

    onSubmit={signInWithCredentials} // Replace with actual submit handler
    />
  )
}

export default page