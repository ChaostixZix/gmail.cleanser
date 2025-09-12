"use client"

import { HelpCircle, Search, Mail, FileText, Calendar } from "lucide-react"
import { Button } from "./button"
import { Badge } from "./badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { useState } from "react"

const searchCategories = {
  common: {
    title: "Common Searches",
    examples: [
      { query: "is:unread", description: "Show only unread emails" },
      { query: "is:starred", description: "Show starred emails" },
      { query: "has:attachment", description: "Emails with attachments" },
      { query: "is:important", description: "Important emails" },
      { query: "in:spam", description: "Check spam folder" },
      { query: "in:trash", description: "Check deleted emails" },
    ]
  },
  sender: {
    title: "By Sender/Recipient",
    examples: [
      { query: "from:example@gmail.com", description: "From specific sender" },
      { query: "to:example@gmail.com", description: "To specific recipient" },
      { query: "from:(@company.com)", description: "From any address at company.com" },
      { query: "from:me", description: "Emails you sent" },
      { query: "to:me", description: "Emails sent to you" },
      { query: "cc:example@gmail.com", description: "CC'd to specific person" },
    ]
  },
  content: {
    title: "By Content",
    examples: [
      { query: "subject:meeting", description: "Subject contains 'meeting'" },
      { query: '"exact phrase"', description: "Search for exact phrase" },
      { query: "password OR login", description: "Contains 'password' OR 'login'" },
      { query: "invoice -receipt", description: "Contains 'invoice' but not 'receipt'" },
      { query: "filename:pdf", description: "Has PDF attachment" },
      { query: "filename:report.xlsx", description: "Specific filename attachment" },
    ]
  },
  date: {
    title: "By Date & Time",
    examples: [
      { query: "newer_than:7d", description: "Last 7 days" },
      { query: "older_than:1m", description: "Older than 1 month" },
      { query: "newer_than:1y", description: "Last year" },
      { query: "after:2024/01/01", description: "After specific date" },
      { query: "before:2024/12/31", description: "Before specific date" },
      { query: "after:2024/01/01 before:2024/01/31", description: "Date range (January 2024)" },
    ]
  },
  advanced: {
    title: "Advanced Queries",
    examples: [
      { query: "size:larger_than:10M", description: "Emails larger than 10MB" },
      { query: "size:smaller_than:1M", description: "Emails smaller than 1MB" },
      { query: "label:work is:unread", description: "Unread work emails" },
      { query: "from:noreply has:attachment", description: "Automated emails with attachments" },
      { query: "(from:boss OR from:manager) is:important", description: "Important emails from boss or manager" },
      { query: "deliveredto:alias@gmail.com", description: "Emails sent to specific alias" },
    ]
  }
}

interface SearchHelpProps {
  onExampleClick?: (query: string) => void
}

const quickSearches = [
  { query: "is:unread", label: "Unread", variant: "default" as const },
  { query: "is:starred", label: "Starred", variant: "secondary" as const },
  { query: "has:attachment", label: "With Files", variant: "outline" as const },
  { query: "newer_than:7d", label: "Last Week", variant: "outline" as const },
]

const categoryIcons = {
  common: Search,
  sender: Mail,
  content: FileText,
  date: Calendar,
  advanced: HelpCircle,
}

export function SearchHelp({ onExampleClick }: SearchHelpProps) {
  const [open, setOpen] = useState(false)

  const handleExampleClick = (query: string) => {
    onExampleClick?.(query)
    setOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      {/* Quick Search Buttons */}
      <div className="hidden md:flex items-center gap-2">
        {quickSearches.map((search, index) => (
          <Button
            key={index}
            variant={search.variant}
            size="sm"
            onClick={() => handleExampleClick(search.query)}
            className="h-8 text-xs"
          >
            {search.label}
          </Button>
        ))}
      </div>

      {/* Advanced Search Help */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Search help</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px]" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Gmail Search Guide</h4>
              <Badge variant="secondary" className="text-xs">
                Advanced
              </Badge>
            </div>
            
            <Tabs defaultValue="common" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                {Object.entries(searchCategories).map(([key, category]) => {
                  const Icon = categoryIcons[key as keyof typeof categoryIcons]
                  return (
                    <TabsTrigger key={key} value={key} className="text-xs">
                      <Icon className="h-3 w-3 mr-1" />
                      {category.title.split(' ')[0]}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
              
              {Object.entries(searchCategories).map(([key, category]) => (
                <TabsContent key={key} value={key} className="space-y-3">
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {category.examples.map((example, index) => (
                      <div key={index} className="space-y-1">
                        <button
                          onClick={() => handleExampleClick(example.query)}
                          className="block w-full text-left group"
                        >
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-primary group-hover:bg-muted/80 transition-colors break-all">
                            {example.query}
                          </code>
                        </button>
                        <p className="text-xs text-muted-foreground pl-2">
                          {example.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            
            <div className="pt-3 border-t space-y-2">
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Tips:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Combine terms with spaces (AND logic)</li>
                  <li>Use OR for alternatives: <code className="bg-muted px-1 rounded">work OR personal</code></li>
                  <li>Exclude with minus: <code className="bg-muted px-1 rounded">meeting -canceled</code></li>
                  <li>Use parentheses for grouping: <code className="bg-muted px-1 rounded">(urgent OR important) is:unread</code></li>
                </ul>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}