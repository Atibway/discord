
import { currentProfile } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'

const AuthErrorPage = async () => {
  const isLoggedIn = await currentProfile()

  if (isLoggedIn) {
    redirect("/")
  } 

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-auto p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-4">
        <FaExclamationTriangle className="text-red-500 text-2xl" />
        <div className="flex-1">
          <p className="font-semibold">Login Error</p>
          <p>Please try logging in again.</p>
        </div>
        <Link href="/login">
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Retry
          </button>
        </Link>
      </div>
    </div>
  )
}

export default AuthErrorPage
