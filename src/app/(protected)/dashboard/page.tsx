"use client";

import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { SearchHelp } from "@/components/ui/search-help";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { env } from "@/env.mjs";
import { EmailDataTable } from "@/features/dashboard/email-data-table";
import { useEmailStore } from "@/providers/email-store-provider";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

export default function Dashboard() {
  const [currentPageIdQuery, setCurrentPageIdQuery] = useQueryState("pageId");
  const [searchQuery, setSearchQuery] = useQueryState("q");
  const [maxResults, setMaxResults] = useQueryState("maxResults", { defaultValue: "10" });
  const { addPageId, previousPageId, nextPageId, setCurrentPageId, clearPageIds } =
    useEmailStore((state) => state);

  const {
    data: emails,
    isPending,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["emails", currentPageIdQuery, searchQuery, maxResults],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (maxResults) params.set('maxResults', maxResults);
        
        const url = env.NEXT_PUBLIC_URL + `/api/gmail/${currentPageIdQuery ?? "0"}?${params.toString()}`;
        
        console.log("Dashboard - Fetching emails:", {
          url,
          currentPageId: currentPageIdQuery,
          searchQuery,
          maxResults,
          timestamp: new Date().toISOString()
        });
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
          
          // Handle 404 "No emails found" as a normal case, not an error
          if (response.status === 404 && errorData.message === "No emails found") {
            console.log("Dashboard - No emails found for current query:", {
              url,
              searchQuery,
              maxResults,
              timestamp: new Date().toISOString()
            });
            
            // Return empty result instead of throwing error
            return {
              meta: {
                messages: [],
                nextPageToken: null,
                resultSizeEstimate: 0
              },
              data: []
            };
          }
          
          console.error("Dashboard - API request failed:", {
            status: response.status,
            statusText: response.statusText,
            url,
            errorData,
            timestamp: new Date().toISOString()
          });
          throw new Error(`API request failed: ${response.status} ${response.statusText}${errorData.message ? ` - ${errorData.message}` : ''}`);
        }
        
        const data = await response.json();
        
        console.log("Dashboard - API request successful:", {
          url,
          dataReceived: !!data,
          messageCount: data?.data?.length || 0,
          hasNextPageToken: !!data?.meta?.nextPageToken,
          timestamp: new Date().toISOString()
        });
        
        return data;
      } catch (error) {
        console.error("Dashboard - Error in queryFn:", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          currentPageId: currentPageIdQuery,
          searchQuery,
          maxResults,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    },
    placeholderData: (prev) => prev,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query || null);
    setCurrentPageIdQuery(null);
    clearPageIds();
  };

  const handleClearSearch = () => {
    setSearchQuery(null);
    setCurrentPageIdQuery(null);
    clearPageIds();
  };

  const handleMaxResultsChange = (value: string) => {
    setMaxResults(value);
    setCurrentPageIdQuery(null);
    clearPageIds();
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Dashboard - Rendering error state:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded-md">
        <h3 className="font-semibold">Error loading emails</h3>
        <p className="text-sm mt-1">{error instanceof Error ? error.message : String(error)}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  console.log(previousPageId, nextPageId);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="Search emails... (e.g., from:example@gmail.com, subject:meeting, is:unread)"
            className="flex-1"
            defaultValue={searchQuery || ""}
            onSearch={handleSearch}
            onClear={handleClearSearch}
          />
          <SearchHelp onExampleClick={handleSearch} />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="maxResults" className="text-sm text-muted-foreground">
              Emails per page:
            </Label>
            <Select value={maxResults || "10"} onValueChange={handleMaxResultsChange}>
              <SelectTrigger id="maxResults" className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="250">250</SelectItem>
                <SelectItem value="500">500</SelectItem>
                <SelectItem value="1000">1000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            Searching for: <span className="font-medium">"{searchQuery}"</span>
            <Button 
              variant="link" 
              size="sm" 
              onClick={handleClearSearch}
              className="ml-2 h-auto p-0 text-sm"
            >
              Clear
            </Button>
          </div>
        )}
      </div>
      
      {emails?.data?.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <div className="text-muted-foreground">
            {searchQuery ? (
              <>
                <p className="text-lg">No emails found for your search</p>
                <p className="text-sm">
                  Try adjusting your search query: <span className="font-mono bg-muted px-2 py-1 rounded">"{searchQuery}"</span>
                </p>
              </>
            ) : (
              <p className="text-lg">No emails found</p>
            )}
          </div>
          {searchQuery && (
            <Button 
              variant="outline" 
              onClick={handleClearSearch}
              className="mt-4"
            >
              Clear Search & Show All Emails
            </Button>
          )}
        </div>
      ) : (
        <EmailDataTable emails={emails} />
      )}
     
      <div className="flex justify-end items-center gap-2">
        <Button
          variant="outline"
          disabled={!previousPageId || isFetching}
          onClick={() => {
            console.log("previousPageId", previousPageId);
            if (previousPageId) {
              setCurrentPageIdQuery(previousPageId);
              setCurrentPageId(previousPageId);
            }
          }}
        >
          {isFetching ? "Loading" : "Previous"}
        </Button>
        <Button
          variant="outline"
          disabled={isFetching || !emails?.meta?.nextPageToken}
          onClick={() => {
            if (!nextPageId) {
              setCurrentPageIdQuery(emails?.meta?.nextPageToken);
              addPageId(emails?.meta?.nextPageToken);
              console.log(emails?.meta?.nextPageToken)
            } else {
              setCurrentPageIdQuery(nextPageId);
              setCurrentPageId(emails?.meta?.nextPageToken);
            }
          }}
        >
          {isFetching ? "Loading" : "Next"}
        </Button>
      </div>
    </section>
  );
}
