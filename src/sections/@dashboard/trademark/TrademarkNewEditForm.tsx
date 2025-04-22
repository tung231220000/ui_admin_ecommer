import * as Yup from 'yup';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import { useCallback, useEffect, useMemo } from 'react';
import { CustomFile } from '@/components/upload';
import { API_DOMAIN } from '@/utils/constant';
import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from '@/routes/paths';
import { Trademark } from '@/@types/trademark';
import { fData } from '@/utils/formatNumber';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import ApiTrademarkRepository, {
  CreateTrademarkPayload,
  UpdateTrademarkPayload,
  UploadLogoPayload,
} from '@/apis/apiService/trademark.api';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<Trademark, 'logo'> {
  logo: CustomFile | string;
}

type Props = {
  isEdit: boolean;
  currentTrademark?: Trademark;
};

export default function TrademarkNewEditForm({ isEdit, currentTrademark }: Props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewTrademarkSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    logo: Yup.mixed<CustomFile | string>().required('Logo is required'),
  });
  const defaultValues = useMemo(
    () => ({
      name: currentTrademark?.name || '',
      logo: currentTrademark?.logo || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTrademark],
  );
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewTrademarkSchema),
    defaultValues,
  });
  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutateAsync: mutateAsyncUploadLogo } = useMutation({
    mutationFn: (payload: UploadLogoPayload) => ApiTrademarkRepository.uploadLogo(payload),
    onError: () => {
      enqueueSnackbar('Không thể upload logo!', {
        variant: 'error',
      });
    },
  });
  const { mutateAsync: mutateAsyncCreateTrademark } = useMutation({
    mutationFn: (payload: CreateTrademarkPayload) =>
      ApiTrademarkRepository.createTrademark(payload),
    onError: () => {
      enqueueSnackbar('Không thể tạo thương hiệu!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Tạo thương hiệu thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.trademark.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });
  const { mutateAsync: mutateAsyncUpdateTrademark } = useMutation({
    mutationFn: (payload: UpdateTrademarkPayload) =>
      ApiTrademarkRepository.updateTrademark(payload),
    onError: () => {
      enqueueSnackbar('Không thể cập nhật thương hiệu!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Cập nhật thương hiệu thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.trademark.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });

  useEffect(() => {
    if (isEdit && currentTrademark) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentTrademark]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'logo',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        );
      }
    },
    [setValue],
  );

  const onSubmit = async (data: FormValuesProps) => {
    const { name, logo } = data;
    let payload = undefined;

    if (typeof logo === 'string') {
      payload = {
        trademarkInput: {
          name,
          logo,
        },
      };
    } else {
      const response = await mutateAsyncUploadLogo({ file: logo });

      payload = {
        trademarkInput: {
          name,
          logo: `${API_DOMAIN}/${response.path}`,
        },
      };
    }

    if (!isEdit) {
      mutateAsyncCreateTrademark(payload);
    } else {
      mutateAsyncUpdateTrademark({
        trademarkInput: {
          ...payload.trademarkInput,
          id: currentTrademark?.id as string,
        },
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="logo"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Icon allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <RHFTextField name="name" label="Name" />

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Trademark' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
