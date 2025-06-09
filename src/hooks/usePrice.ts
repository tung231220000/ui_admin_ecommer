import { useMutation, useQuery } from '@tanstack/react-query';

import { PATH_DASHBOARD } from '@/routes/paths';
import { Price } from '@/@types/price';
import PriceContext from '@/contexts/Price';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ApiPriceRepository, {
  CreatePricePayload,
  DeleteManyPricesPayload,
  DeletePricePayload,
  UpdatePricePayload,
} from '@/apis/apiService/price.api';

export type UsePriceProps = {
  isLoading: boolean;
  prices: Price[];
  createPrice: (payload: CreatePricePayload) => Promise<void>;
  refetchPrices: VoidFunction;
  updatePrice: (payload: UpdatePricePayload) => Promise<void>;
  deletePrice: (payload: DeletePricePayload) => void;
  deleteManyAdvantages: (payload: DeleteManyPricesPayload) => Promise<void>;
};

export default function usePrice(): UsePriceProps {
  const { dispatch, state } = useContext(PriceContext);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: mutateAsyncCreatePrice, isPending: isCreatingPrice } = useMutation({
    mutationFn: (payload: CreatePricePayload) => ApiPriceRepository.createPrice(payload),
    onError: () => {
      enqueueSnackbar('Không thể tạo giá!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Tạo giá thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.price.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });
  const { refetch: refetchPrices, isLoading: isRefreshingPrices } = useQuery({
    queryKey: ['fetchPrices'],
    queryFn: async () => {
      try {
        const data = await ApiPriceRepository.fetchPrices();
        if (!data.error) {
          dispatch({
            type: 'SET_PRICES',
            payload: data.data.prices,
          });
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      } catch (e) {
        enqueueSnackbar('Không thể lấy danh sách giá!', {
          variant: 'error',
        });
      }
    },
    refetchOnWindowFocus: false,
  });
  const { mutateAsync: mutateAsyncUpdatePrice, isPending: isUpdatingPrice } = useMutation({
    mutationFn: (payload: UpdatePricePayload) => ApiPriceRepository.updatePrice(payload),

    onError: () => {
      enqueueSnackbar('Không thể cập nhật giá!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Cập nhật giá thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.price.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });
  const { mutateAsync: mutateAsyncDeletePrice, isPending: isDeletingPrice } = useMutation({
    mutationFn: (payload: DeletePricePayload) => ApiPriceRepository.deletePrice(payload),
    onError: () => {
      enqueueSnackbar('Không thể xóa giá!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        dispatch({
          type: 'SET_PRICES',
          payload: state.prices.filter((price) => price._id !== data.data.deletePrice._id),
        });
        enqueueSnackbar('Xóa giá thành công!', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });
  const { mutateAsync: mutateAsyncDeleteManyPrices, isPending: isDeletingManyPrices } = useMutation(
    {
      mutationFn: (payload: DeleteManyPricesPayload) =>
        ApiPriceRepository.deleteManyPrices(payload),
      onError: () => {
        enqueueSnackbar('Không thể xóa nhiều giá!', {
          variant: 'error',
        });
      },
    },
  );

  const createPrice = async (payload: CreatePricePayload) => {
    mutateAsyncCreatePrice(payload);
  };

  const updatePrice = async (payload: UpdatePricePayload) => {
    mutateAsyncUpdatePrice(payload);
  };

  const deletePrice = (payload: DeletePricePayload) => {
    mutateAsyncDeletePrice(payload);
  };

  const deleteManyAdvantages = async (payload: DeleteManyPricesPayload) => {
    const response = await mutateAsyncDeleteManyPrices(payload);

    dispatch({
      type: 'SET_PRICES',
      payload: state.prices.filter((price) => !payload.priceInput._ids.includes(<string>price._id)),
    });
    enqueueSnackbar(response.data.deleteManyPrices, {
      variant: 'success',
    });
  };

  return {
    isLoading:
      isCreatingPrice ||
      isRefreshingPrices ||
      isUpdatingPrice ||
      isDeletingPrice ||
      isDeletingManyPrices,
    prices: state.prices,
    createPrice,
    refetchPrices,
    updatePrice,
    deletePrice,
    deleteManyAdvantages,
  };
}
