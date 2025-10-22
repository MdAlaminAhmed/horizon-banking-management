'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from './ui/button'
import { PlaidLinkOnSuccess, PlaidLinkOnExit, PlaidLinkOptions, PlaidLinkOnEvent, usePlaidLink } from 'react-plaid-link'
import { useRouter } from 'next/navigation';
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions';
import Image from 'next/image';

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter();

  const [token, setToken] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastEvent, setLastEvent] = useState<any>(null);

  useEffect(() => {
    const getLinkToken = async () => {
      try {
        const data = await createLinkToken(user);
        setToken(data?.linkToken);
      } catch (e: any) {
        setErrorMsg(e?.message || 'Failed to initialize Plaid');
      }
    }

    getLinkToken();
  }, [user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
    try {
      await exchangePublicToken({
        publicToken: public_token,
        user,
      })
      // Refresh current route so new bank appears without navigation
      router.refresh();
    } catch (e: any) {
      const serverMsg = e?.response?.data?.error_message || e?.response?.data?.message || e?.message;
      setErrorMsg(serverMsg || 'Bank linking failed');
    }
  }, [user, router])

  const onExit = useCallback<PlaidLinkOnExit>((error, metadata) => {
    if (error) {
      console.warn('Plaid Link exited with error:', error, metadata);
      setErrorMsg(error.display_message || error.error_message || (error as any)?.message || 'Plaid Link was closed');
    }
  }, [])

  const onEvent = useCallback<PlaidLinkOnEvent>((eventName, metadata) => {
    setLastEvent({ eventName, metadata });
    // Also log in dev
    if (process.env.NODE_ENV !== 'production') {
      console.log('Plaid Link event:', eventName, metadata);
    }
  }, [])

  const receivedRedirectUri = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const params = new URLSearchParams(window.location.search);
    return params.get('oauth_state_id') ? window.location.href : undefined;
  }, []);

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
    onExit,
    onEvent,
    // Only pass when returning from OAuth
    receivedRedirectUri,
  }

  const { open, ready } = usePlaidLink(config);

  const handleOpen = useCallback(() => {
    setErrorMsg(null);
    if (!ready || !token) return;
    open();
  }, [ready, token, open])

  return (
    <>
      {variant === 'primary' ? (
        <Button
          onClick={handleOpen}
          disabled={!ready}
          className="plaidlink-primary"
        >
          Add bank
        </Button>
      ) : variant === 'ghost' ? (
        <div onClick={handleOpen} className="flex gap-1 items-center cursor-pointer hover:opacity-80 transition-opacity">
          <span className='text-16 font-normal text-blue-600'>+</span>
          <span className='text-14 font-semibold text-blue-600'>Add bank</span>
        </div>
      ) : (
        <Button onClick={handleOpen} className="plaidlink-default">
          <Image
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
          />
          <p className='text-[16px] font-semibold text-black-2'>Add bank</p>
        </Button>
      )}
      {errorMsg && (
        <p className="mt-2 text-red-600 text-sm">{errorMsg}</p>
      )}
      {process.env.NEXT_PUBLIC_PLAID_DEBUG === 'true' && variant !== 'ghost' && (
        <div className="mt-3 rounded-md border border-gray-200 p-2 text-xs text-gray-700">
          <div>Debug: Plaid</div>
          <div>ready: {String(ready)} | hasToken: {String(!!token)}</div>
          {lastEvent && (
            <pre className="whitespace-pre-wrap break-all mt-1 bg-gray-50 p-2 rounded">{JSON.stringify(lastEvent, null, 2)}</pre>
          )}
          {errorMsg && (
            <pre className="whitespace-pre-wrap break-all mt-1 bg-red-50 p-2 rounded text-red-700">{errorMsg}</pre>
          )}
        </div>
      )}
    </>
  )
}

export default PlaidLink