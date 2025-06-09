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
import { ProductTableRow, ProductTableToolbar } from '@/sections/@dashboard/product/list';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
} from '../../components/table';
import { useMutation, useQuery } from '@tanstack/react-query';
import useTable, { emptyRows, getComparator } from '../../hooks/useTable';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import { PATH_DASHBOARD } from '@/routes/paths';
import Page from '../../components/Page';
import { Product } from '@/@types/product';
import Scrollbar from '../../components/Scrollbar';
import { kebabCase } from 'change-case';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import ApiProductRepository, {
  DeleteManyProductsPayload,
  DeleteProductPayload,
} from '@/apis/apiService/product.api';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'key', label: 'Key', align: 'left' },
  { id: 'category', label: 'Category', align: 'left' },
  { id: 'title', label: 'Title', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function ProductList() {
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

  const [tableData, setTableData] = useState<Product[]>([]);
  const [filterTitle, setFilterTitle] = useState('');

  useQuery({
    queryKey: ['fetchProducts'],
    queryFn: async () => {
      try {
        const data = await ApiProductRepository.fetchProducts();
        if (!data.error) {
          setTableData(data.data.products);
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      } catch (e) {
        enqueueSnackbar('Không thể lấy danh sách sản phẩm!', {
          variant: 'error',
        });
      }
    },
    refetchOnWindowFocus: false,
  });
  const { mutateAsync: mutateAsyncDeleteProduct } = useMutation({
    mutationFn: (payload: DeleteProductPayload) => ApiProductRepository.deleteProduct(payload),
    onError: () => {
      enqueueSnackbar('Không thể xóa sản phẩm!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        setTableData(tableData.filter((product) => product._id !== data.data.deleteProduct._id));
        enqueueSnackbar('Xóa sản phẩm thành công!', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });
  const { mutateAsync: mutateAsyncDeleteManyProducts } = useMutation({
    mutationFn: (payload: DeleteManyProductsPayload) =>
      ApiProductRepository.deleteManyProducts(payload),
    onError: () => {
      enqueueSnackbar('Không thể xóa nhiều sản phẩm!', {
        variant: 'error',
      });
    },
  });

  const handleFilterTitle = (filterTitle: string) => {
    setFilterTitle(filterTitle);
    setPage(0);
  };

  const handleDeleteRow = (_id: string) => {
    mutateAsyncDeleteProduct({
      productInput: {
        _id,
      },
    });
    setSelected([]);
  };

  const handleDeleteRows = async (_ids: string[]) => {
    const response = await mutateAsyncDeleteManyProducts({
      productInput: {
        _ids,
      },
    });
    setTableData(tableData.filter((product) => !_ids.includes(product._id)));
    enqueueSnackbar(response.data.deleteManyProducts, {
      variant: 'success',
    });
    setSelected([]);
  };

  const handleEditRow = (key: string) => {
    navigate(PATH_DASHBOARD.product.edit(kebabCase(key)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterTitle,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = (!dataFiltered.length && !!filterTitle) || !tableData.length;

  return (
    <Page title="Product: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Product List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Product', href: PATH_DASHBOARD.product.list },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.product.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Product
            </Button>
          }
        />

        <Card>
          <ProductTableToolbar filterTitle={filterTitle} onFilterTitle={handleFilterTitle} />

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
                      tableData.map((row) => row._id),
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
                      tableData.map((row) => row._id),
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <ProductTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row.key)}
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
  tableData: Product[];
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
        item.title.toLowerCase().indexOf(filterTitle.toLowerCase()) !== -1,
    );
  }

  return tableData;
}
