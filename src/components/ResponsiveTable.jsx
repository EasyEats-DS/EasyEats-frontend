import React from "react";

/**
 * A table on wide screens, a stack of labelled cards on a phone.
 *
 * A six-column table cannot be read on a 360px screen: either the columns are
 * crushed to a few characters each or the row scrolls sideways and every column
 * past the second goes unseen. Below `md` each row is re-laid as a card with the
 * headers repeated as labels, which is what makes the data legible; from `md` up
 * the real table returns, since comparing rows is the reason a table exists.
 *
 * Columns are described once and rendered both ways, so the two presentations
 * cannot drift apart.
 *
 * @param {Object[]} columns
 *   `{ key, header, cell?, className?, headerClassName?, primary?, hideOnMobile? }`
 *   `cell(row)` renders the value; without it `row[key]` is shown. Mark one
 *   column `primary` to make it each card's heading. `hideOnMobile` drops a
 *   column from the card view only -- for filler that earns its place in a wide
 *   table but not on a small screen.
 * @param {Object[]} rows
 * @param {Function} rowKey  Stable React key for a row.
 * @param {React.ReactNode} [empty]  Shown when there are no rows.
 */
export default function ResponsiveTable({
  columns = [],
  rows = [],
  rowKey = (_row, index) => index,
  empty = "Nothing to show yet",
  className = "",
}) {
  const valueOf = (column, row) => (column.cell ? column.cell(row) : row?.[column.key]);

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-gray-500">
        {empty}
      </div>
    );
  }

  const primary = columns.find((column) => column.primary);
  const cardColumns = columns.filter((column) => column !== primary && !column.hideOnMobile);

  return (
    <div className={className}>
      {/* Cards: phones and small tablets */}
      <ul className="space-y-3 md:hidden">
        {rows.map((row, index) => (
          <li
            key={rowKey(row, index)}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            {primary && (
              <div className="mb-3 border-b border-gray-100 pb-2 font-semibold break-words text-gray-900">
                {valueOf(primary, row)}
              </div>
            )}

            <dl className="space-y-2">
              {cardColumns.map((column) => (
                <div key={column.key} className="flex items-start justify-between gap-3">
                  <dt className="shrink-0 text-xs uppercase tracking-wide text-gray-400">
                    {column.header}
                  </dt>
                  <dd className="min-w-0 break-words text-right text-sm text-gray-800">
                    {valueOf(column, row)}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      {/* Table: md and up. The overflow wrapper is a safety net for a table that
          still outgrows a narrow laptop -- it scrolls the table, never the page. */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[40rem] border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`whitespace-nowrap pb-3 pr-4 font-medium text-gray-500 ${
                    column.headerClassName || ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={rowKey(row, index)} className="border-b border-gray-100 hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className={`py-4 pr-4 align-middle ${column.className || ""}`}>
                    {valueOf(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
