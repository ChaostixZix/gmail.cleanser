'use client'

import { createEmailStore, EmailStore } from '@/store/email-store'
import { type ReactNode, createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

export type EmailStoreAPI = ReturnType<typeof createEmailStore>

export const EmailStoreContext = createContext<EmailStoreAPI | undefined>(
  undefined,
)

export interface EmailStoreProviderProps {
  children: ReactNode
}

export const EmailStoreProvider = ({
  children,
}: EmailStoreProviderProps) => {
  const storeRef = useRef<EmailStoreAPI>()
  if (!storeRef.current) {
    storeRef.current = createEmailStore({
        pageIds: [],
        currentPageId: null,
        previousPageId: null,
        nextPageId: null,
    })
  }

  return (
    <EmailStoreContext.Provider value={storeRef.current}>
      {children}
    </EmailStoreContext.Provider>
  )
}

export const useEmailStore = <T,>(
  selector: (store: EmailStore) => T,
): T => {
  const counterStoreContext = useContext(EmailStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
