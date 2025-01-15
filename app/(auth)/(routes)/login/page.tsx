

import { UserAuthForm } from '@/components/auth/LoginForm'
// import { currentProfileInLogin } from '@/lib/auth'
import Link from 'next/link'
// import { redirect } from 'next/navigation'

import React from 'react'

const LoginPage =async () => {
  // const isLoggedIn = await currentProfileInLogin()
  
// if(isLoggedIn){
//   redirect("/")
// } 

return (
  <>
  <div className="container mx-auto h-screen flex flex-col items-center justify-center  lg:max-w-none lg:grid-cols-2 lg:px-0">
     
     <div className="flex flex-col items-center justify-center p-8 lg:p-12 bg-white shadow-lg rounded-lg">
       <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
         <div className="flex flex-col space-y-2 text-center">
           <h1 className="text-3xl font-semibold tracking-tight text-gray-800">
             Login to your account
           </h1>
           <p className="text-sm text-gray-600">
             Choose your preferred login method
           </p>
         </div>
         <UserAuthForm/>
         <p className="px-8 text-center text-sm text-gray-600">
           By clicking continue, you agree to our{' '}
           <Link href="#" className="underline underline-offset-4 hover:text-primary">
             Terms of Service
           </Link>{' '}
           and{' '}
           <Link href="#" className="underline underline-offset-4 hover:text-primary">
             Privacy Policy
           </Link>
           .
         </p>
       </div>
     </div>
   </div>
  
  </>
)
}

export default LoginPage;