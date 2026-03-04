import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, TableContainer } from '@mui/material';
import { ReactNode } from 'react';

export interface Column<T> { key: keyof T | string; header: string; render?: (row: T) => ReactNode }

export const DataTable = <T extends { id: string | number }>({ columns, rows, emptyMessage = 'Tidak ada data' }: { columns: Column<T>[]; rows: T[]; emptyMessage?: string; }) => (
  <Paper>
    <TableContainer sx={{ overflowX: 'auto' }}>
    <Table size="small">
      <TableHead>
        <TableRow>{columns.map((c) => <TableCell key={String(c.key)}>{c.header}</TableCell>)}</TableRow>
      </TableHead>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow><TableCell colSpan={columns.length}><Typography>{emptyMessage}</Typography></TableCell></TableRow>
        ) : rows.map((row) => (
          <TableRow key={row.id}>
            {columns.map((c) => <TableCell key={String(c.key)}>{c.render ? c.render(row) : String((row as Record<string, unknown>)[String(c.key)] ?? '')}</TableCell>)}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </TableContainer>
  </Paper>
);
