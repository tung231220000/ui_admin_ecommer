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
import {
  InformationTableRow,
  InformationTableToolbar,
} from '@/sections/@dashboard/information/list';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
} from '../../components/table';
import useTable, { emptyRows, getComparator } from '../../hooks/useTable';
import ApiInformationRepository from '@/apis/apiService/information.api'
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { Information } from '@/@types/information';
import {PATH_DASHBOARD} from '@/routes/paths';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import { kebabCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'page', label: 'Page', align: 'left' },
  { id: 'title', label: 'Title', align: 'left' },
  { id: 'subtitle', label: 'Subtitle', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function InformationList() {
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
    // setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const [tableData, setTableData] = useState<Information[]>([]);
  const [filterTitle, setFilterTitle] = useState('');

  useQuery({
    queryKey: ['fetchInformation'],
    queryFn: async () => {
      try {
        const data = await ApiInformationRepository.fetchInformation();
        if (!data.error && data.result) {
          console.log("data fetch: ", data.result);
          setTableData(data.result);
        } else {
          enqueueSnackbar(data.error, {
            variant: 'error',
          });
        }
      } catch (error) {
        enqueueSnackbar('Không thể lấy danh sách thông tin!', {
          variant: 'error',
        });
      }
    },
    refetchOnWindowFocus: false,
  });

  // const {mutateAsync: mutateAsyncDeleteInformation} = useMutation<DeleteInformationResponse, AxiosError, DeleteInformationPayload>({
  //   mutationFn: (payload: DeleteInformationPayload) =>
  //     ApiInformationRepository.deleteInformation(payload) as unknown as Promise<DeleteInformationResponse>,
  //   onSuccess: (data) => {
  //     if (!data.error) {
  //       setTableData(tableData.filter((info) => info.id !== data.result.id))
  //       enqueueSnackbar('Xóa thông tin thành công!', {
  //         variant: 'success',
  //       });
  //     } else {
  //       enqueueSnackbar('Không thể xóa Information' + data.error, {
  //         variant: 'error',
  //       });
  //     }
  //   },
  // });

  // const {mutateAsync: mutateAsyncDeleteManyInformation} = useMutation<DeleteManyInformationResponse, AxiosError, DeleteManyInformationPayload>({
  //   mutationFn: (payload: DeleteManyInformationPayload) =>
  //     ApiInformationRepository.deleteManyInformation(payload) as unknown as Promise<DeleteManyInformationResponse>,
  //   onSuccess: (data) => {
  //     // if (!data.error) {
  //     //   setTableData(tableData.filter((info) => info.id !== data.result.id))
  //     //   enqueueSnackbar('Xóa thông tin thành công!', {
  //     //     variant: 'success',
  //     //   });
  //     // } else {
  //     if (data.error)
  //       enqueueSnackbar('Không thể xóa Information' + data.error, {
  //         variant: 'error',
  //       });
  //   },
  // });


  const handleFilterTitle = (filterTitle: string) => {
    setFilterTitle(filterTitle);
    setPage(0);
  };

  // const handleDeleteRow = (id: string) => {
  //   setSelected([]);
  //   mutateAsyncDeleteInformation({
  //     informationInput: {
  //       id,
  //     },
  //   });
  // };

  // const handleDeleteRows = async (ids: string[]) => {
  //   setSelected([]);
  //   const response = await mutateAsyncDeleteManyInformation({
  //     informationInput: {
  //       ids,
  //     },
  //   });
  //   setTableData(tableData.filter((info) => !ids.includes(info.id)));
  //   enqueueSnackbar(response.data.deleteManyInformation, {
  //     variant: 'success',
  //   });
  // };

  const handleEditRow = (id: string) => {
    navigate(PATH_DASHBOARD.information.edit(kebabCase(id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterTitle,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = (!dataFiltered.length && !!filterTitle) || !tableData.length;

  return (
    <Page title="Information: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Information List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Information', href: PATH_DASHBOARD.information.list },
            { name: 'List' },
          ]}
        />

        <Card>
          <InformationTableToolbar filterTitle={filterTitle} onFilterTitle={handleFilterTitle} />

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
                    )
                  }
                  // actions={
                  //   <Tooltip title="Delete">
                  //     <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                  //       <Iconify icon={'eva:trash-2-outline'} />
                  //     </IconButton>
                  //   </Tooltip>
                  // }
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
                      <InformationTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        // onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
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
  filterTitle,
}: {
  tableData: Information[];
  comparator: (a: any, b: any) => number;
  filterTitle: string;
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterTitle) {
    tableData = tableData.filter(
      (item: Record<string, any>) =>
        item.title.toLowerCase().indexOf(filterTitle.toLowerCase()) !== -1
    );
  }

  return tableData;
}
