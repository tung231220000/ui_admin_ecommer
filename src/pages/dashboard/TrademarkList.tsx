import {
  Box,
  Button,
  Card,
  Container,
  FormControlLabel,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tooltip,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
} from '../../components/table';
import { TrademarkTableRow, TrademarkTableToolbar } from '@/sections/@dashboard/trademark/list';
import { useMutation, useQuery } from '@tanstack/react-query';
import useTable, { emptyRows, getComparator } from '../../hooks/useTable';

import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import { PATH_DASHBOARD } from '@/routes/paths';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import { Trademark } from '@/@types/trademark';
import { kebabCase } from 'change-case';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import ApiTrademarkRepository, {
  DeleteManyTrademarksPayload,
  DeleteTrademarkPayload
} from "@/apis/apiService/trademark.api";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'logo', label: 'Logo', align: 'center' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function TrademarkList() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { themeStretch } = useSettings();
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    setPage,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const [tableData, setTableData] = useState<Trademark[]>([]);
  const [filterName, setFilterName] = useState('');

  useQuery({
    queryKey: ['fetchTrademarks'],
    queryFn : async () => {
      try {
        const data = await ApiTrademarkRepository.fetchTrademarks();
        if (!data.error) {
          setTableData(data);
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      } catch (error) {
        enqueueSnackbar('Không thể lấy danh sách thương hiệu!', {
          variant: 'error',
        });
      }
    },
    refetchOnWindowFocus: false,
  });

  const {mutateAsync: mutateAsyncDeleteTrademark} = useMutation({
    mutationFn: (payload: DeleteTrademarkPayload) => ApiTrademarkRepository.deleteTrademark(payload),
    onError: () => {
      enqueueSnackbar('Không thể xóa thương hiệu!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        setTableData(
          tableData.filter((trademark) => trademark.id !== data.deleteTrademark.id)
        );
        enqueueSnackbar('Xóa thương hiệu thành công!', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    }
  });

  const {mutateAsync: mutateAsyncDeleteManyTrademarks} = useMutation({
    mutationFn: (payload: DeleteManyTrademarksPayload) =>
      ApiTrademarkRepository.deleteManyTrademarks(payload),
    onError: () => {
      enqueueSnackbar('Không thể xóa nhiều thương hiệu!', {
        variant: 'error',
      });
    },
  });


  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id: string) => {
    setSelected([]);
    mutateAsyncDeleteTrademark({
      id,
    });
  };

  const handleDeleteRows = async (ids: string[]) => {
    setSelected([]);
    const response = await mutateAsyncDeleteManyTrademarks({
      ids,
    });
    setTableData(tableData.filter((trademark) => trademark.id !== undefined && !ids.includes(trademark.id)));
    enqueueSnackbar(response.deleteManyTrademarks, {
      variant: 'success',
    });
  };

  const handleEditRow = (id: string) => {
    navigate(PATH_DASHBOARD.trademark.edit(kebabCase(id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = (!dataFiltered.length && !!filterName) || !tableData.length;

  return (
    <Page title="Trademark: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Trademark List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Trademark', href: PATH_DASHBOARD.trademark.list },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.trademark.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Trademark
            </Button>
          }
        />

        <Card>
          <TrademarkTableToolbar filterName={filterName} onFilterName={handleFilterName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                          .filter((id): id is string => id !== undefined)
                    )
                  }
                  actions={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id) .filter((id): id is string => id !== undefined)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TrademarkTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id!)}
                        onSelectRow={() => onSelectRow(row.id!)}
                        onDeleteRow={() => handleDeleteRow(row.id!)}
                        onEditRow={() => handleEditRow(row.id!)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
}: {
  tableData: Trademark[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item: Record<string, any>) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return tableData;
}
