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
import {OfficeTableRow, OfficeTableToolbar} from '@/sections/@dashboard/office/list';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
} from '../../components/table';
import {useMutation, useQuery} from '@tanstack/react-query';
import useTable, {emptyRows, getComparator} from '../../hooks/useTable';

import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import {Office} from '@/@types/office';
import {PATH_DASHBOARD} from '@/routes/paths';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import {kebabCase} from 'change-case';
import useSettings from '../../hooks/useSettings';
import {useSnackbar} from 'notistack';
import {useState} from 'react';
import ApiOfficeRepository, {DeleteManyOfficesPayload, DeleteOfficePayload} from "@/apis/apiService/office.api";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  {id: 'name', label: 'Name', align: 'left'},
  {id: 'hotline', label: 'Hotline', align: 'left'},
  {id: 'fax', label: 'Fax', align: 'left'},
  {id: 'address', label: 'Address', align: 'left'},
  {id: 'email', label: 'Email', align: 'left'},
  {id: ''},
];

// ----------------------------------------------------------------------

export default function OfficeList() {
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();

  const {themeStretch} = useSettings();
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

  const [tableData, setTableData] = useState<Office[]>([]);
  const [filterName, setFilterName] = useState('');

  useQuery({
    queryKey: ['fetchOffices'],
    queryFn: async () => {
      try {
        const data = await ApiOfficeRepository.fetchOffices();
        if (!data.error) {
          setTableData(data.offices);
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      } catch (error) {
        enqueueSnackbar('Không thể lấy danh sách văn phòng!', {
          variant: 'error',
        });
      }
    }
  })


  const {mutateAsync: mutateAsyncDeleteOffice} = useMutation({
    mutationFn: (payload: DeleteOfficePayload) => ApiOfficeRepository.deleteOffice(payload),
    onError: () => {
      enqueueSnackbar('Không thể xóa văn phòng!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        setTableData(tableData.filter((office) => office.id !== data.deleteOffice.id));
        enqueueSnackbar('Xóa văn phòng thành công!', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    }
  });

  const {mutateAsync: mutateAsyncDeleteManyOffices} = useMutation({
    mutationFn: (payload: DeleteManyOfficesPayload) => ApiOfficeRepository.deleteManyOffices(payload),
    onError: () => {
      enqueueSnackbar('Không thể xóa nhiều văn phòng!', {
        variant: 'error',
      });
    }
  })

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id: string) => {
    setSelected([]);
    mutateAsyncDeleteOffice({
      id
    });
  };

  const handleDeleteRows = async (ids: string[]) => {
    setSelected([]);
    const response = await mutateAsyncDeleteManyOffices({
      ids,
    });
    setTableData(tableData.filter((office) => !ids.includes(office.id)));
    enqueueSnackbar(response.deleteManyOffices, {
      variant: 'success',
    });
  };

  const handleEditRow = (id: string) => {
    navigate(PATH_DASHBOARD.office.edit(kebabCase(id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = (!dataFiltered.length && !!filterName) || !tableData.length;

  return (
    <Page title="Office: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Office List"
          links={[
            {name: 'Dashboard', href: PATH_DASHBOARD.root},
            {name: 'Office', href: PATH_DASHBOARD.office.list},
            {name: 'List'},
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.office.new}
              startIcon={<Iconify icon={'eva:plus-fill'}/>}
            >
              New Office
            </Button>
          }
        />

        <Card>
          <OfficeTableToolbar filterName={filterName} onFilterName={handleFilterName}/>

          <Scrollbar>
            <TableContainer sx={{minWidth: 800, position: 'relative'}}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'}/>
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
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <OfficeTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound}/>
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{position: 'relative'}}>
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
              control={<Switch checked={dense} onChange={onChangeDense}/>}
              label="Dense"
              sx={{px: 3, py: 1.5, top: 0, position: {md: 'absolute'}}}
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
  tableData: Office[];
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
