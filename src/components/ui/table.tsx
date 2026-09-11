import * as React from "react"

import { cn } from "../../lib/utils"

/*
 * These primitives render a real table from `md` up and a stack of cards below
 * it. Five admin screens share them, so the mobile treatment lives here rather
 * than being rewritten per page.
 *
 * Each cell shows its column name on mobile from a `label` prop -- without the
 * header row a bare value like "4" or a date means nothing. Cells given no
 * label still stack, they just carry no caption.
 */

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full md:overflow-auto">
    <table
      ref={ref}
      className={cn("block w-full caption-bottom text-sm md:table", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("hidden md:table-header-group [&_tr]:border-b", className)}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("block md:table-row-group [&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "mb-3 block rounded-lg border bg-white p-3 shadow-sm transition-colors",
      "md:mb-0 md:table-row md:rounded-none md:border-0 md:border-b md:p-0 md:shadow-none",
      "hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Column name, shown beside the value once the header row is hidden. */
  label?: string
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, label, ...props }, ref) => (
    <td
      ref={ref}
      data-label={label}
      className={cn(
        "flex items-start justify-between gap-3 break-words py-1.5 text-right",
        "before:shrink-0 before:text-xs before:uppercase before:tracking-wide before:text-gray-400 before:content-[attr(data-label)]",
        "md:table-cell md:p-4 md:text-left md:align-middle md:before:content-none",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
)
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
