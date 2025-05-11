import PropTypes from 'prop-types';
import { useMemo, useState, Fragment } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

// third-party
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';
// project-import
import MainCard from '../../../../ui-component/MainCard';
import ScrollX from '../../../../ui-component/ScrollX';
import CModal from '../../../../components/quote/QuoteModal';
import AlertQuotesDelete from '../../../../components/quote/AlertQuoteDelete';
import EmptyReactTable from '../../tables/empty';

import {
  CSVExport,
  // CSVExport,
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from '../../../../ui-component/third-party/react-table';

// assets
import { useGetQuotes } from '../../../../api/quote';
import AnimateButton from '../../../../ui-component/extended/AnimateButton';
import { IconButton, Typography } from '@mui/material';
import { IconEye, IconRefresh, IconSettings, IconEdit, IconUserMinus, IconUserPlus, IconUserFilled, IconPlus } from '@tabler/icons-react';
import QuoteView from '../../../../components/quote/QuoteView';

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, modalToggler, QuotesLoading, refreshQuotes }) {
  const theme = useTheme();
  const [sorting, setSorting] = useState([{ id: 'quote_id', desc: false }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const tooltipStyles = {
    sx: {
      color: '#514E6A',
      backgroundColor: '#ffff'
    }
  };

  const TooltipIconButton = ({ title, color, icon, onClick }) => (
    <Tooltip slotProps={{ tooltip: tooltipStyles }} title={title}>
      <IconButton color={color} variant="dashed" shape="rounded" onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  );
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true
  });

  let headers = [];
  columns.map(
    (columns) =>
      // @ts-ignore
      columns.accessorKey &&
      headers.push({
        label: typeof columns.header === 'string' ? columns.header : '#',
        // @ts-ignore
        key: columns.accessorKey
      })
  );

  return (
    <MainCard content={false}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search records...`}
        />

        <Stack direction="row" alignItems="center" spacing={2}>
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />

          <a href={`${import.meta.env.VITE_APP_LANDING_URL}quote`}>
            <AnimateButton>
              <Button color="secondary" size="large" startIcon={<IconUserPlus />} variant="contained">
                Add New Quote
              </Button>
            </AnimateButton>
          </a>
          {QuotesLoading ? (
            <AnimateButton type="rotate">
              <TooltipIconButton title="Reloading Quote..." color="warning" icon={<IconSettings />} />
            </AnimateButton>
          ) : (
            <TooltipIconButton title="Reload Quote" color="success" icon={<IconRefresh color="blue" />} onClick={refreshQuotes} />
          )}
          <CSVExport {...{ data: table.getSelectedRowModel().flatRows.map((row) => row.original), headers, filename: 'Quote-list.csv' }} />
        </Stack>
      </Stack>
      <ScrollX>
        <Stack>
          <RowSelection selected={Object.keys(rowSelection).length} />
          <TableContainer>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                        Object.assign(header.column.columnDef.meta, {
                          className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                        });
                      }

                      return (
                        <TableCell
                          key={header.id}
                          {...header.column.columnDef.meta}
                          onClick={header.column.getToggleSortingHandler()}
                          {...(header.column.getCanSort() &&
                            header.column.columnDef.meta === undefined && {
                              className: 'cursor-pointer prevent-select'
                            })}
                        >
                          {header.isPlaceholder ? null : (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                              {header.column.getCanSort() && <HeaderSort column={header.column} />}
                            </Stack>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow sx={{ bgcolor: '#E3F2FD', '&:hover': { bgcolor: '#E3F2FD' }, overflow: 'hidden' }}>
                        <TableCell colSpan={row.getVisibleCells().length} sx={{ p: 2.5, overflow: 'hidden' }}>
                          <QuoteView data={row.original} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <TablePagination
                {...{
                  setPageSize: table.setPageSize,
                  setPageIndex: table.setPageIndex,
                  getState: table.getState,
                  getPageCount: table.getPageCount
                }}
              />
            </Box>
          </>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}
// ==============================|| CUSTOMER LIST ||============================== //

export default function QuotesListPage() {
  const theme = useTheme();
  const { QuotesLoading: loading, quotes: lists, QuotesLoading, refreshQuotes } = useGetQuotes();
  const [open, setOpen] = useState(false);
  const [QuotesModal, setQuotesModal] = useState(false);
  const [selectedQuotes, setSelectedQuotes] = useState(null);
  const [QuotesDeleteId, setQuotesDeleteId] = useState('');

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(
    () => [
      {
        id: 'Row Selection',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      {
        header: '#',
        accessorKey: 'quote_id',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Quote',
        cell: ({ row, getValue }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box alt="Avatar 1" size="xl">
              <IconUserFilled />
            </Box>
            <Stack spacing={0}>
              <Typography sx={{ mb: 1 }}>
                {row.original.first_name} {row.original.last_name}
              </Typography>
              <Typography color="">{row.original.email}</Typography>
            </Stack>
          </Stack>
        )
      },

      {
        header: 'Phone',
        accessorKey: 'phone_number'
      },
      {
        header: 'Origin Address',
        accessorKey: 'origin_address'
      },
      // {
      //   header: 'Destination Address',
      //   accessorKey: 'destination_address'
      // },
      {
        header: 'Submitted At',
        accessorKey: 'submitted_at',
        cell: ({ getValue }) => {
          const dateValue = getValue();
          const formattedDate = dateValue
            ? new Date(dateValue).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })
            : 'N/A';

          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Stack spacing={0}>
                <Typography>{formattedDate}</Typography>
              </Stack>
            </Stack>
          );
        }
      },

      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          const collapseIcon =
            row.getCanExpand() && row.getIsExpanded() ? (
              <IconPlus style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} />
            ) : (
              <IconEye />
            );
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <Tooltip title="View">
                <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
                  {collapseIcon}
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedQuotes(row.original);
                    setQuotesModal(true);
                  }}
                >
                  <IconEdit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                    setQuotesDeleteId(row.original.quote_id);
                  }}
                >
                  <IconUserMinus />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    [theme]
  );

  if (loading) return <EmptyReactTable />;

  return (
    <>
      <ReactTable
        {...{
          data: lists,
          columns,
          modalToggler: () => {
            setQuotesModal(true);
            setSelectedQuotes(null);
          },
          QuotesLoading,
          refreshQuotes
        }}
      />
      <AlertQuotesDelete id={Number(QuotesDeleteId)} title={QuotesDeleteId} open={open} handleClose={handleClose} />
      <CModal open={QuotesModal} modalToggler={setQuotesModal} Quote={selectedQuotes} />
    </>
  );
}

ReactTable.propTypes = { data: PropTypes.array, columns: PropTypes.array, modalToggler: PropTypes.func };
