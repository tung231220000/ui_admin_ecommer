import * as Yup from 'yup';

import { Box, Card, Grid, Typography, styled } from '@mui/material';
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFUploadSingleFile,
} from '../../../components/hook-form';
import { useCallback, useEffect, useMemo } from 'react';

import { CustomFile } from '@/components/upload';
import { API_DOMAIN } from '@/utils/constant';
import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from '@/routes/paths';
import { Service } from '@/@types/service';
import { Trademark } from '@/@types/trademark';
import { Resolver, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import ApiServiceRepository, {
  CreateServicePayload,
  UpdateServicePayload,
  UploadThumbnailPayload,
} from '@/apis/apiService/service.api';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<Service, 'thumbnail' | 'trademark'> {
  thumbnail: CustomFile | string;
  trademark: string;
}

type Props = {
  isEdit: boolean;
  trademarks: Trademark[];
  currentService?: Service;
};

export default function ServiceNewEditForm({ isEdit, trademarks, currentService }: Props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewServiceSchema = Yup.object().shape({
    _id: Yup.string(),
    key: Yup.string().required('Key is required'),
    thumbnail: Yup.string(),
    trademark: Yup.string().required('Trademark is required'),
  });
  const defaultValues = useMemo(
    () => ({
      _id: currentService?._id || '',
      key: currentService?.key || '',
      thumbnail: currentService?.thumbnail || '',
      trademark: currentService?.trademark.id || trademarks[0].id,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentService],
  );
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewServiceSchema) as Resolver<FormValuesProps>,
    defaultValues,
  });
  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutateAsync: mutateAsyncUploadThumbnail } = useMutation({
    mutationFn: (payload: UploadThumbnailPayload) => ApiServiceRepository.uploadThumbnail(payload),
    onError: () => {
      enqueueSnackbar('Không thể upload ảnh banner!', {
        variant: 'error',
      });
    },
  });
  const { mutateAsync: mutateAsyncCreateService } = useMutation({
    mutationFn: (payload: CreateServicePayload) => ApiServiceRepository.createService(payload),
    onError: () => {
      enqueueSnackbar('Không thể tạo linh kiện!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Tạo linh kiện thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.service.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });
  const { mutateAsync: mutateAsyncUpdateService } = useMutation({
    mutationFn: (payload: UpdateServicePayload) => ApiServiceRepository.updateService(payload),
    onError: () => {
      enqueueSnackbar('Không thể cập nhật linh kiện!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Cập nhật linh kiện thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.service.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });

  useEffect(() => {
    if (isEdit && currentService) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentService]);

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'thumbnail',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        );

        const filesData = new FormData();
        filesData.append(`file`, file);
        const response = await mutateAsyncUploadThumbnail(filesData);
        setValue(`thumbnail`, `${API_DOMAIN}/${response.path}`);
      }
    },
    [mutateAsyncUploadThumbnail, setValue],
  );

  const onSubmit = async (data: FormValuesProps) => {
    if (!isEdit) {
      mutateAsyncCreateService({
        serviceInput: data,
      });
    } else {
      mutateAsyncUpdateService({
        serviceInput: {
          ...data,
          _id: currentService?._id as string,
        },
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <div>
              <LabelStyle>Thumbnail</LabelStyle>
              <RHFUploadSingleFile name="thumbnail" maxSize={3145728} onDrop={handleDrop} />
            </div>

            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                },
                mt: 3,
              }}
            >
              <RHFTextField name="key" label="Key" />

              <RHFSelect name="trademark" label="Trademark">
                {trademarks.map((trademark) => (
                  <option key={trademark.id} value={trademark.id}>
                    {trademark.name}
                  </option>
                ))}
              </RHFSelect>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
            {!isEdit ? 'Create Service' : 'Save Changes'}
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
