'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FormError } from '../form-error';
import { useSearchParams } from 'next/navigation';
import { FaGithub, FaSpinner } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [githubLoading, setGithubLoading] = React.useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();
  const urlError = searchParams?.get('error') === 'OAuthAccountNotLinked' ? 'Email already in use with a different provider' : '';

  async function onSubmit(provider: string) {
    if (provider === 'github') {
      setGithubLoading(true);
    } else if (provider === 'google') {
      setGoogleLoading(true);
    }

    try {
      await signIn(provider, { callbackUrl: '/' });
    } catch (error) {
      // Handle error
    } finally {
      if (provider === 'github') {
        setGithubLoading(false);
      } else if (provider === 'google') {
        setGoogleLoading(false);
      }
    }
  }

  return (
    <div className={cn('space-y-6 bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg', className)} {...props}>
      {urlError && <FormError message={urlError} />}
      <Button
        variant="outline"
        type="button"
        disabled={githubLoading}
        onClick={() => onSubmit('github')}
        className="flex items-center justify-center w-full space-x-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
      >
        {githubLoading ? <FaSpinner className="animate-spin" /> : <FaGithub />}
        <span>Sign in with GitHub</span>
      </Button>
      <Button
        variant="outline"
        type="button"
        disabled={googleLoading}
        onClick={() => onSubmit('google')}
        className="flex items-center justify-center w-full space-x-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
      >
        {googleLoading ? <FaSpinner className="animate-spin" /> : <FcGoogle />}
        <span>Sign in with Google</span>
      </Button>
    </div>
  );
}
