"use client"

import { FaExclamationTriangle } from "react-icons/fa"
import React from "react"
import { useRouter } from "next/navigation"

interface ErrorCardProps {
  message: string
  route: string
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ message, route }) => {
  const router = useRouter()
  return (
    <div className="w-full max-w-sm mx-auto p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-4">
      <FaExclamationTriangle className="text-red-500 text-2xl" />
      <div className="flex-1">
        <p className="font-semibold">Login Error</p>
        <p>{message}</p>
      </div>
      <button
        onClick={() => router.push(route)}
        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
      >
        Retry
      </button>
    </div>
  )
}
