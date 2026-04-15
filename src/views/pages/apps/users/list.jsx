import PropTypes from 'prop-types';
import { useMemo, useState, Fragment } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
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
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { PatternFormat } from 'react-number-format';
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
import UModal from '../../../../components/user/UserModal';
import AlertUserDelete from '../../../../components/user/AlertUserDelete';
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
// import { Add as IconAdd', Edit, Eye, Refresh, Setting2, Trash } from 'iconsax-react';
import { useGetUsers } from '../../../../api/user';
import AnimateButton from '../../../../ui-component/extended/AnimateButton';
import { IconButton } from '@mui/material';
import { IconEye, IconRefresh, IconSettings, IconUserEdit, IconUserMinus, IconUserPlus } from '@tabler/icons-react';

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, modalToggler, UsersLoading, refreshUsers }) {
  const theme = useTheme();
  const [sorting, setSorting] = useState([{ id: 'full_name', desc: false }]);
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

          <AnimateButton>
            <Button color="secondary" size="large" startIcon={<IconUserPlus />} onClick={modalToggler} variant="contained">
              Add New User
            </Button>
          </AnimateButton>
          {UsersLoading ? (
            <AnimateButton type="rotate">
              <TooltipIconButton title="Reloading User..." color="warning" icon={<IconSettings />} />
            </AnimateButton>
          ) : (
            <TooltipIconButton title="Reload User" color="success" icon={<IconRefresh color="blue" />} onClick={refreshUsers} />
          )}
          <CSVExport {...{ data: table.getSelectedRowModel().flatRows.map((row) => row.original), headers, filename: 'User-list.csv' }} />
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
                    {/* {row.getIsExpanded() && (
                      <TableRow sx={{ bgcolor: backColor, '&:hover': { bgcolor: `${backColor} !important` }, overflow: 'hidden' }}>
                        <TableCell colSpan={row.getVisibleCells().length} sx={{ p: 2.5, overflow: 'hidden' }}>
                          <UserView data={row.original} />
                        </TableCell>
                      </TableRow>
                    )} */}
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

export default function UserListPage() {
  const theme = useTheme();
  const { UsersLoading: loading, users: lists, UsersLoading, refreshUsers } = useGetUsers();
  const [open, setOpen] = useState(false);
  const [UserModal, setUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [UserDeleteId, setUserDeleteId] = useState('');

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
        accessorKey: 'user_id',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'User Name',
        accessorKey: 'full_name',
        cell: ({ row, getValue }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box alt="Avatar 1" size="xl">
              <Typography variant="h3" color="primary">
                {row.original.user_first_name.charAt(0)}
              </Typography>
            </Box>
            <Stack spacing={0}>
              <Typography variant="subtitle1">{getValue()}</Typography>
              <Typography color="text.secondary">{row.original.user_email}</Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Phone Number',
        accessorKey: 'user_phone',
        cell: ({ getValue }) => <PatternFormat displayType="text" format="### ###-####" mask="_" defaultValue={getValue()} />
      },
      {
        header: 'Role',
        accessorKey: 'user_role',
        meta: {
          className: 'cell-right'
        }
      },
      {
        header: 'Status',
        accessorKey: 'is_active',
        cell: (cell) => {
          switch (cell.getValue()) {
            case 0:
              return <Chip color="error" label="Inactive" size="small" />;
            case 1:
              return <Chip color="success" label="Active" size="small" />;
          }
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
              <Add style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} />
            ) : (
              <IconEye />
            );
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedUser(row.original);
                    setUserModal(true);
                  }}
                >
                  <IconUserEdit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                    setUserDeleteId(row.original.user_id);
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
            setUserModal(true);
            setSelectedUser(null);
          },
          UsersLoading,
          refreshUsers
        }}
      />
      <AlertUserDelete id={Number(UserDeleteId)} title={UserDeleteId} open={open} handleClose={handleClose} />
      <UModal open={UserModal} modalToggler={setUserModal} User={selectedUser} />
    </>
  );
}

ReactTable.propTypes = { data: PropTypes.array, columns: PropTypes.array, modalToggler: PropTypes.func };
