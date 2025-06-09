import React from 'react';
import * as Yup from 'yup';

import {Box, Button, Card, Grid, Stack, Typography} from '@mui/material';
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import { useCallback, useEffect, useMemo } from 'react';
import { CustomFile } from '@/components/upload';
import { API_DOMAIN } from '@/utils/constant';
// import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from '@/routes/paths';
import { Partner } from '@/@types/partner';
import { fData } from '@/utils/formatNumber';
import {  useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import ApiPartnerRepository, {
  CreatePartnerPayload,
  UpdatePartnerPayload,
  UploadLogoPayload,
} from '@/apis/apiService/partner.api';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<Partner, 'logo'> {
  logo: CustomFile | string;
}

type Props = {
  isEdit: boolean;
  currentPartner?: Partner;
};

export default function PartnerNewEditForm({ isEdit, currentPartner }: Props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewPartnerSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string().required('Name is required'),
    logo: Yup.mixed<CustomFile | string>().required('Logo is required').defined(),
  });
  const defaultValues = useMemo(
    () => ({
      id: currentPartner?.id || '',
      name: currentPartner?.name || '',
      logo: currentPartner?.logo || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPartner],
  );
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewPartnerSchema),
    defaultValues,
  });
  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutateAsync: mutateAsyncUploadLogo } = useMutation({
    mutationFn: (payload: UploadLogoPayload) => ApiPartnerRepository.uploadLogo(payload),
    onError: () => {
      enqueueSnackbar('Không thể upload logo!', {
        variant: 'error',
      });
    },
  });
  const { mutateAsync: mutateAsyncCreatePartner } = useMutation({
    mutationFn: (payload: CreatePartnerPayload) => ApiPartnerRepository.createPartner(payload),
    onError: () => {
      enqueueSnackbar('Không thể tạo đối tác!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Tạo đối tác thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.partner.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });
  const { mutateAsync: mutateAsyncUpdatePartner } = useMutation({
    mutationFn: (payload: UpdatePartnerPayload) => ApiPartnerRepository.updatePartner(payload),
    onError: () => {
      enqueueSnackbar('Không thể cập nhật đối tác!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Cập nhật đối tác thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.partner.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });

  useEffect(() => {
    if (isEdit && currentPartner) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentPartner]);

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
        partnerInput: {
          name,
          logo,
        },
      };
    } else {
      const response = await mutateAsyncUploadLogo({ file: logo });

      payload = {
        partnerInput: {
          name,
          logo: `${API_DOMAIN}/${response.path}`,
        },
      };
    }

    if (!isEdit) {
      mutateAsyncCreatePartner(payload);
    } else {
      mutateAsyncUpdatePartner({
        partnerInput: {
          ...payload.partnerInput,
          id: currentPartner?.id as string,
        },
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid size={8}>
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

        <Grid size={8}>
          <Card sx={{ p: 3 }}>
            <RHFTextField name="name" label="Name" />

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Partner' : 'Save Changes'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
