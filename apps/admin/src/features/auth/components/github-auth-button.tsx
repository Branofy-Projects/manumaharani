'use client';

import { useSearchParams } from 'next/navigation';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

export default function GithubSignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <Button
      className='w-full'
      onClick={() => console.log('continue with github clicked')}
      type='button'
      variant='outline'
    >
      <Icons.github className='mr-2 h-4 w-4' />
      Continue with Github
    </Button>
  );
}
