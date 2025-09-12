"use client"
import { createStore } from 'zustand/vanilla'

export type emailState = {
  pageIds: Array<string>
  currentPageId: string | null
  previousPageId: string | null
  nextPageId: string | null
}

export type emailActions = {
    addPageId: (pageId: string) => void
    removePageId: (pageId: string) => void
    clearPageIds: () => void
    setCurrentPageId: (pageId: string | null) => void
}

export type EmailStore = emailState & emailActions

export const defaultInitState: emailState = {
  pageIds: [],
  currentPageId: null,
  previousPageId: null,
  nextPageId: null,
}

export const createEmailStore = (
  initState: emailState = defaultInitState,
) => {
  return createStore<EmailStore>()((set) => ({
    ...initState,
    addPageId: (pageId: string) => set((state) => {
      const newPageIds = [...state.pageIds, pageId];
      const currentIndex = newPageIds.length - 1;
      const previousPageId = currentIndex > 0 ? newPageIds[currentIndex - 1] : null;
      const nextPageId = null; // Since this is the last page added, there is no next page
      return {
        pageIds: newPageIds,
        currentPageId: pageId,
        previousPageId,
        nextPageId,
      };
    }),
    removePageId: (pageId: string) => set((state) => {
      const newPageIds = state.pageIds.filter((id) => id !== pageId);
      return { pageIds: newPageIds };
    }),
    clearPageIds: () => set(() => ({
      pageIds: [],
      currentPageId: null,
      previousPageId: null,
      nextPageId: null,
    })),
    setCurrentPageId: (pageId: string | null) => set((state) => {
      if (pageId === null) {
        return {
          currentPageId: null,
          previousPageId: null,
          nextPageId: null,
        };
      }
      const currentIndex = state.pageIds.indexOf(pageId);
      const previousPageId = currentIndex > 0 ? state.pageIds[currentIndex - 1] : null;
      const nextPageId = currentIndex < state.pageIds.length - 1 ? state.pageIds[currentIndex + 1] : null;
      return {
        currentPageId: pageId,
        previousPageId,
        nextPageId,
      };
    }),
  }))
}