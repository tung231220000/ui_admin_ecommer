import React from "react";
import * as Yup from 'yup';

import { Box, Button, Card, Divider, Grid, Stack, Typography } from '@mui/material';
import { FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';
import ApiPageRepository, {
  UpdatePagePayload,
  UploadBannerImagePayload,
  UploadCarouselImagePayload
} from '@/apis/apiService/page.api';
import { useCallback, useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { CustomFile } from 'src/components/upload';
import { API_DOMAIN } from 'src/utils/constant';
import Iconify from 'src/components/Iconify';
import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from 'src/routes/paths';
import {Carousel, Page} from 'src/@types/page';
import { styled } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
// import {Simulate} from "react-dom/test-utils";
// import mouseUp = Simulate.mouseUp;
// import {AxiosError} from "axios";
// import {RESTErrorResponse} from "@/@types/api";

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<Page, 'banner' | 'carousels'> {
  banner: CustomFile | string;
  carousels: {
    title?: string;
    description?: string;
    image: CustomFile | string;
  }[];
}

type Props = {
  currentPage: Page;
};

export default function PageEditForm({ currentPage }: Props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewPageSchema = Yup.object().shape({
    id: Yup.string().default(''),
    name: Yup.string().required('Name is required'),
    title: Yup.string().required('Title is required'),
    banner: Yup.mixed<CustomFile | string>().defined(),
    carousels: Yup.array().of(
      Yup.object().shape({
        title: Yup.string(),
        description: Yup.string(),
        image: Yup.mixed<CustomFile | string>().required("Image is required").defined(),
      })
    )
    .default([])
    .defined(),
    updatedDatetime: Yup.date(),
    createDatetime: Yup.date(),
  });

  const defaultValues: {
    createDatetime: Date;
    name: string;
    banner: string;
    title: string;
    carousels: Carousel[];
    updatedDatetime: Date
  } = useMemo(
    () => ({
      name: currentPage?.name || '',
      title: currentPage?.title || '',
      banner: currentPage?.banner || '',
      carousels: currentPage?.carousels || [
        {
          title: '',
          description: '',
          image: '',
        },
      ],
      updatedDatetime: currentPage?.updatedDatetime || new Date(),
      createDatetime: currentPage?.createDatetime || new Date(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPage]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewPageSchema),
    defaultValues,
  });

  const {
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'carousels',
  });
  watch();

  const {mutateAsync: mutateAsyncUploadBannerImage} = useMutation({
      mutationFn: (payload: UploadBannerImagePayload) => ApiPageRepository.uploadBannerImage(payload),
      onError: () => {
        enqueueSnackbar('Không thể upload ảnh banner!', {
          variant: 'error',
        });
      },
    }
  );
  const {mutateAsync: mutateAsyncUploadCarouselImage} = useMutation({
      mutationFn: (payload: UploadCarouselImagePayload) => ApiPageRepository.uploadCarouselImage(payload),
      onError: () => {
        enqueueSnackbar('Không thể upload ảnh carousel!', {
          variant: 'error',
        });
      }
    }
  );
  const {mutateAsync: mutateAsyncUpdatePage} = useMutation({
    mutationFn: (payload: UpdatePagePayload) => ApiPageRepository.updatePage(payload),
    onError: () => {
      enqueueSnackbar('Không thể cập nhật trang!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Cập nhật trang thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.page.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    }
  })


  useEffect(() => {
    if (currentPage) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'banner',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        const filesData = new FormData();
        filesData.append(`file`, file);
        const response = await mutateAsyncUploadBannerImage(filesData);
        setValue(`banner`, `${API_DOMAIN}/${response.path}`);
      }
    },
    [mutateAsyncUploadBannerImage, setValue]
  );

  const handleDropCarousel = useCallback(
    async (acceptedFiles: File[], index: number) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          `carousels.${index}.image`,
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        const filesData = new FormData();
        filesData.append(`file`, file);
        const response = await mutateAsyncUploadCarouselImage(filesData);
        setValue(`carousels.${index}.image`, `${API_DOMAIN}/${response.path}`);
      }
    },
    [mutateAsyncUploadCarouselImage, setValue]
  );

  const handleAdd = () => {
    append({
      title: '',
      description: '',
      image: '',
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const onSubmit = async (data: FormValuesProps) => {
    mutateAsyncUpdatePage({
        ...data,
        banner: (data.banner as string).length > 0 ? data.banner : null,
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <div>
              <LabelStyle>Banner</LabelStyle>
              <RHFUploadSingleFile name="banner" maxSize={3145728} onDrop={handleDrop} />
            </div>

            <Typography variant="h6" sx={{ color: 'text.disabled', my: 3 }}>
              Carousel:
            </Typography>

            <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
              {fields.map((item, index) => (
                <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                    <RHFTextField
                      name={`carousel[${index}].title`}
                      size="small"
                      type="text"
                      label="Title"
                    />

                    <RHFTextField
                      name={`carousel[${index}].description`}
                      size="small"
                      type="text"
                      label="Description"
                    />
                  </Stack>

                  <Box sx={{ width: '100%' }}>
                    <LabelStyle>Image</LabelStyle>
                    <RHFUploadSingleFile
                      name={`carousel[${index}].image`}
                      maxSize={3145728}
                      onDrop={(acceptedFiles) => handleDropCarousel(acceptedFiles, index)}
                    />
                  </Box>

                  <Button
                    size="small"
                    color="error"
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </Button>
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

            <Button
              size="small"
              startIcon={<Iconify icon="eva:plus-fill" />}
              sx={{ flexShrink: 0 }}
              onClick={handleAdd}
            >
              Add new carousel
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="name" label="Name" disabled />

                <RHFTextField name="title" label="Title" />
              </Stack>
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              Save Changes
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
