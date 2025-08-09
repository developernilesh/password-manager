"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FiCopy, FiEdit, FiGlobe, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";

export interface PasswordRow {
  id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  category: string;
  createdAt: string;
}

interface PasswordsTableProps {
  data: PasswordRow[];
  onCopy: (text: string) => void;
  onEdit: (row: PasswordRow) => void;
  onDelete: (id: string) => void;
}

export function PasswordsTable({ data, onCopy, onEdit, onDelete }: PasswordsTableProps) {
  const [visiblePasswordsById, setVisiblePasswordsById] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswordsById((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getCategoryBadgeClasses = (category: string) => {
    const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border";
    switch (category) {
      case "social":
        return `${base} bg-blue-500/10 text-blue-400 border-blue-500/30`;
      case "work":
        return `${base} bg-purple-500/10 text-purple-400 border-purple-500/30`;
      case "finance":
        return `${base} bg-emerald-500/10 text-emerald-400 border-emerald-500/30`;
      case "shopping":
        return `${base} bg-amber-500/10 text-amber-400 border-amber-500/30`;
      default:
        return `${base} bg-slate-500/10 text-slate-300 border-slate-500/30`;
    }
  };

  const columns = useMemo<ColumnDef<PasswordRow>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <FiGlobe className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-medium text-white">{row.original.title}</div>
              <div className="text-sm text-gray-400">{row.original.url}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="text-white">{row.original.username}</span>
            <button onClick={() => onCopy(row.original.username)} className="p-1 hover:bg-gray-600 rounded transition-colors">
              <FiCopy className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        ),
      },
      {
        accessorKey: "password",
        header: "Password",
        cell: ({ row }) => {
          const isVisible = !!visiblePasswordsById[row.original.id];
          return (
            <div className="flex items-center gap-2">
              <span className="text-white">{isVisible ? row.original.password : "••••••••"}</span>
              <button
                onClick={() => togglePasswordVisibility(row.original.id)}
                className="p-1 hover:bg-gray-600 rounded transition-colors"
                aria-label={isVisible ? "Hide password" : "Show password"}
              >
                {isVisible ? (
                  <FiEyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <FiEye className="h-4 w-4 text-gray-400" />
                )}
              </button>
              <button onClick={() => onCopy(row.original.password)} className="p-1 hover:bg-gray-600 rounded transition-colors" aria-label="Copy password">
                <FiCopy className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const category = row.original.category;
          const label = category.charAt(0).toUpperCase() + category.slice(1);
          return (
            <span className={getCategoryBadgeClasses(category)}>
              {label}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-600 rounded transition-colors" onClick={() => onEdit(row.original)} aria-label="Edit password">
              <FiEdit className="h-4 w-4 text-blue-400" />
            </button>
            <button className="p-2 hover:bg-gray-600 rounded transition-colors" onClick={() => onDelete(row.original.id)} aria-label="Delete password">
              <FiTrash2 className="h-4 w-4 text-red-400" />
            </button>
          </div>
        ),
      },
    ],
    [onCopy, onDelete, onEdit, visiblePasswordsById]
  );

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHeader className="bg-gray-700/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="divide-y divide-gray-700">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}


