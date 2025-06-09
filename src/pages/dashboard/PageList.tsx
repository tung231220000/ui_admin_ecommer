import {
  Box,
  Card,
  Container,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { PageTableRow, PageTableToolbar } from '@/sections/@dashboard/page/list';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../components/table';
import useTable, { emptyRows, getComparator } from '../../hooks/useTable';
import ApiPageRepository from '@/apis/apiService/page.api';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '@/routes/paths';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import { Page as TPage } from '@/@types/page';
import { kebabCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'title', label: 'Title', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function PageList() {
  const navigate = useNavigate();

  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const [tableData, setTableData] = useState<TPage[]>([]);
  const [filterName, setFilterName] = useState('');
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ['fetchPages'],
    queryFn: () => ApiPageRepository.fetchPages(),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isLoading || isFetching) {
      return;
    }
    if (error) {
      enqueueSnackbar(error?.message || 'Không thể lấy danh sách các trang!', {
        variant: 'error',
      });
    }
  }, [error]);

  useEffect(() => {
    if (isLoading || isFetching) {
      return;
    }
    if (data) {
      setTableData(data);
    } else {
      enqueueSnackbar(error?.message, {
        variant: 'error',
      });
    }
  }, [data]);

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleEditRow = (name: string) => {
    navigate(PATH_DASHBOARD.page.edit(kebabCase(name)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = (!dataFiltered.length && !!filterName) || !tableData.length;

  return (
    <Page title="Page: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Page List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Page', href: PATH_DASHBOARD.page.list },
            { name: 'List' },
          ]}
        />

        <Card>
          <PageTableToolbar filterName={filterName} onFilterName={handleFilterName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <PageTableRow
                        key={row.id}
                        row={row}
                        onEditRow={() => handleEditRow(row.name)}
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
  tableData: TPage[];
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
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1,
    );
  }

  return tableData;
}
