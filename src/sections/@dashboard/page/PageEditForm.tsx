import React from 'react';
import * as Yup from 'yup';

import { Box, Button, Card, Divider, Grid, Stack, Typography } from '@mui/material';
import { FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';
import ApiPageRepository, {
  UpdatePagePayload,
  UploadBannerImagePayload,
  UploadCarouselImagePayload,
} from '@/apis/apiService/page.api';
import { useCallback, useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { CustomFile } from '@/components/upload';
import Iconify from '@/components/Iconify';
import { PATH_DASHBOARD } from '@/routes/paths';
import { Carousel, Page } from '@/@types/page';
import { styled } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<Page, 'banner' | 'carousels'> {
  banner: CustomFile | string;
  carousels: {
    pageId?: number;
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
    pageId: Yup.number(),
    name: Yup.string().required('Name is required'),
    title: Yup.string().required('Title is required'),
    banner: Yup.mixed<CustomFile | string>().defined(),
    carousels: Yup.array()
      .of(
        Yup.object().shape({
          pageId: Yup.number(),
          title: Yup.string(),
          description: Yup.string(),
          image: Yup.mixed<CustomFile | string>().required('Image is required').defined(),
        }),
      )
      .default([])
      .defined(),
    updatedDatetime: Yup.date(),
    createdDatetime: Yup.date(),
  });

  const defaultValues: {
    pageId: number | undefined;
    name: string;
    banner: string;
    createdDatetime: Date;
    title: string;
    carousels: Carousel[] | { image: string; description: string; pageId: number | undefined; title: string }[];
    updatedDatetime: Date
  } = useMemo(
    () => ({
      pageId: currentPage?.pageId,
      name: currentPage?.name || '',
      title: currentPage?.title || '',
      banner: currentPage?.banner || '',
      carousels: currentPage?.carousels || [
        {
          pageId: currentPage?.pageId || -1,
          title: '',
          description: '',
          image: '',
        },
      ],
      updatedDatetime: currentPage?.updatedDatetime || new Date(),
      createdDatetime: currentPage?.createdDatetime || new Date(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPage],
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

  const { mutateAsync: mutateAsyncUploadBannerImage } = useMutation({
    mutationFn: (payload: UploadBannerImagePayload) => ApiPageRepository.uploadBannerImage(payload),
    onError: () => {
      enqueueSnackbar('Không thể upload ảnh banner!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });
  const { mutateAsync: mutateAsyncUploadCarouselImage } = useMutation({
    mutationFn: (payload: UploadCarouselImagePayload) =>
      ApiPageRepository.uploadCarouselImage(payload),
    onError: () => {
      enqueueSnackbar('Không thể upload ảnh carousel!', {
        variant: 'error',
      });
    },
  });
  const { mutateAsync: mutateAsyncUpdatePage } = useMutation({
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
    },
  });

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
          }),
        );

        const filesData = new FormData();
        filesData.append(`file`, file);
        const response = await mutateAsyncUploadBannerImage(filesData);
        setValue(`banner`, `${response.url}`);
      }
    },
    [mutateAsyncUploadBannerImage, setValue],
  );

  const handleDropCarousel = useCallback(
    async (acceptedFiles: File[], index: number) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          `carousels.${index}.image`,
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        );

        const filesData = new FormData();
        filesData.append(`file`, file);
        const response = await mutateAsyncUploadCarouselImage(filesData);

        setValue(`carousels.${index}.image`, `${response.url}`);
      }
    },
    [mutateAsyncUploadCarouselImage, setValue],
  );

  const handleAdd = () => {
    append({
      pageId: -1,
      title: '',
      description: '',
      image: '',
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const onSubmit = async (data: FormValuesProps) => {
    await mutateAsyncUpdatePage({
      ...data,
      banner: (data.banner as string).length > 0 ? data.banner : null,
    });
  };

  return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={8}>
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
                            name={`carousels.${index}.title`}
                            size="small"
                            type="text"
                            label="Title"
                        />
                        <RHFTextField
                            name={`carousels.${index}.description`}
                            size="small"
                            type="text"
                            label="Description"
                        />
                      </Stack>

                      <Box sx={{ width: '100%' }}>
                        <LabelStyle>Image</LabelStyle>
                        <RHFUploadSingleFile
                            name={`carousels.${index}.image`}
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



          <Grid size={4}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <RHFTextField name="name" label="Name" disabled />
                  <RHFTextField name="title" label="Title" />
                </Stack>
              </Card>

              <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
                Save Changes
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>

  );
}
