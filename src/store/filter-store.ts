"use client"
import { createStore } from "zustand";

type FilterState = {
  phrase: string;
  subject: string;
  from: string;
  to: string;
  label: string;
  has: string;
  before: string;
  after: string;
  is: "read" | "unread" | "starred";
  in:
    | "inbox"
    | "spam"
    | "trash"
    | "sent"
    | "drafts"
    | "chat"
    | "category_personal"
    | "category_social"
    | "category_promotions"
    | "category_updates"
    | "category_forums";
  category: "primary" | "social" | "promotions" | "updates" | "forums";
  larger: string;
};

type FilterAction = {
  setFilter: (filter: Partial<FilterState>) => void;
};

export const defaultFilterState: FilterState = {
  phrase: "",
  subject: "",
  from: "",
  to: "",
  label: "",
  has: "",
  before: "",
  after: "",
  is: "read",
  in: "inbox",
  category: "primary",
  larger: "",
};

type FilterStore = FilterState & FilterAction;

export const createCounterStore = (
  initState: FilterState = defaultFilterState
) => {
  return createStore<FilterStore>()((set) => ({
    ...initState,
    setFilter: (filter) =>
      set((state) => ({
        ...state,
        ...filter,
      })),
  }));
};
