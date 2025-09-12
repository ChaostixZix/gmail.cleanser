"use client"

import { Search, X } from "lucide-react"
import { Input } from "./input"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (query: string) => void
  onClear?: () => void
  showClearButton?: boolean
}

export function SearchInput({ 
  className, 
  onSearch, 
  onClear, 
  showClearButton = true,
  ...props 
}: SearchInputProps) {
  const [value, setValue] = useState(props.defaultValue?.toString() || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(value)
  }

  const handleClear = () => {
    setValue("")
    onClear?.()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    props.onChange?.(e)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        {...props}
        value={value}
        onChange={handleChange}
        className={cn("pl-10 pr-10", className)}
      />
      {showClearButton && value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </form>
  )
}