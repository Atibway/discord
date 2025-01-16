"use client"

import { Hash } from 'lucide-react';

interface ChatWelcomeProps {
  type: "channel" | "conversation";
  name: string;
}

export const ChatWelcome = ({
  type,
  name
}: ChatWelcomeProps) => {
  return (
    <div className="space-y-6 px-4 mb-4 py-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md transition-colors duration-200">
      {type === "channel" && (
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto">
          <Hash className="h-10 w-10 text-white" />
        </div>
      )}

      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-100">
          {type === "channel" ? `Welcome to #${name}` : `Chat with ${name}`}
        </h2>
        <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-300">
          {type === "channel"
            ? `This is the beginning of the #${name} channel. Start the conversation!`
            : `This is the start of your conversation with ${name}. Say hello!`
          }
        </p>
      </div>

      {type === "channel" && (
        <div className="flex justify-center">
          <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800">
            Invite Others
          </button>
        </div>
      )}
    </div>
  )
}

