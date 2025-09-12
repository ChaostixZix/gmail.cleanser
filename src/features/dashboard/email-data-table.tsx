"use client";

import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { getEmailTableColumns } from "./email-table-columns";
import {
  getCoreRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { EmailResponse } from "@/schemas/emails";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "@/env.mjs";

type EmailDataTableProps = {
  emails: EmailResponse;
};

export const EmailDataTable: React.FC<EmailDataTableProps> = ({ emails }) => {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const queryClient = useQueryClient();

  const columns = React.useMemo(() => getEmailTableColumns(), []);

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    data: emails?.data || [],
    columns,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const getSelectedRows = () => {
    return table.getSelectedRowModel().flatRows.map((row) => row.original);
  };

  const selectedRows = getSelectedRows();
  const selectedCount = selectedRows.length;

  const bulkDeleteMutation = useMutation({
    mutationFn: async (emailIds: string[]) => {
      console.log("BulkDelete - Starting bulk deletion for emails:", emailIds);
      
      const deletePromises = emailIds.map(async (emailId) => {
        const url = env.NEXT_PUBLIC_URL + `/api/gmail/messages/${emailId}`;
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
          console.error("BulkDelete - Delete request failed for email:", {
            emailId,
            status: response.status,
            statusText: response.statusText,
            errorData
          });
          throw new Error(`Failed to delete email ${emailId}: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("BulkDelete - Delete successful for email:", emailId);
        return data;
      });

      const results = await Promise.allSettled(deletePromises);
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      console.log("BulkDelete - Bulk deletion completed:", {
        total: emailIds.length,
        successful,
        failed,
        timestamp: new Date().toISOString()
      });

      if (failed > 0) {
        const failedResults = results.filter(result => result.status === 'rejected') as PromiseRejectedResult[];
        throw new Error(`Failed to delete ${failed} out of ${emailIds.length} emails. First error: ${failedResults[0]?.reason?.message || 'Unknown error'}`);
      }

      return { successful, failed };
    },
    onSuccess: (data) => {
      console.log("BulkDelete - Bulk deletion successful, refreshing data and clearing selection");
      
      // Clear selection
      setRowSelection({});
      
      // Invalidate and refetch the emails query to refresh the table
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
    onError: (error) => {
      console.error("BulkDelete - Bulk deletion failed:", {
        error: error instanceof Error ? error.message : String(error),
        selectedCount,
        timestamp: new Date().toISOString()
      });
    }
  });

  const handleBulkDelete = () => {
    if (selectedCount === 0) return;
    
    console.log("BulkDelete - Selected rows structure:", selectedRows);
    
    // The selected rows structure shows: {config, data, headers, status, statusText}
    // So the email ID is at row.data.id (not row.original.data.id)
    const emailIds = selectedRows.map(row => {
      console.log("BulkDelete - Processing row:", row);
      console.log("BulkDelete - Row data:", row.data);
      return row.data?.id;
    }).filter(Boolean);
    
    console.log("BulkDelete - Extracted email IDs:", emailIds);
    
    if (emailIds.length === 0) {
      console.error("BulkDelete - No valid email IDs found in selected rows");
      console.error("BulkDelete - First selected row structure:", selectedRows[0]);
      return;
    }

    bulkDeleteMutation.mutate(emailIds);
  };

  if (!emails?.data) {
    return <div>Loading emails...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
          <span className="text-sm text-muted-foreground">
            {selectedCount} email{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={bulkDeleteMutation.isPending}
            className="flex items-center gap-2"
          >
            <TrashIcon className="h-4 w-4" />
            {bulkDeleteMutation.isPending 
              ? `Deleting ${selectedCount} email${selectedCount !== 1 ? 's' : ''}...` 
              : `Delete ${selectedCount} email${selectedCount !== 1 ? 's' : ''}`
            }
          </Button>
        </div>
      )}
      
      <DataTable table={table} data={emails.data} columns={columns} />
    </div>
  );
};
