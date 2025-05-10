import * as Yup from 'yup';

import { Box, Button, Card, Divider, Stack,Grid, Typography } from '@mui/material';
import {
  FormProvider,
  RHFEditor,
  RHFTextField,
  RHFUploadMultiFile,
  RHFUploadSingleFile,
} from '../../../components/hook-form';
import { useCallback, useEffect, useMemo } from 'react';
import { Resolver, useFieldArray, useForm } from 'react-hook-form';
import { CustomFile } from '@/components/upload';
import { API_DOMAIN } from '@/utils/constant';
import Iconify from '@/components/Iconify';
import { Information } from '@/@types/information';
// import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from '@/routes/paths';
import { styled } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import ApiInformationRepository, {
  UpdateInformationPayload,
  UploadAssetsPayload,
  UploadVariantImagePayload,
} from '@/apis/apiService/information.api';


// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<Information, 'variants' | 'assets'> {
  variants: {
    title?: string | null;
    url?: string | null;
    content?: string | null;
    image?: CustomFile | string | null;
  }[];
  assets: (CustomFile | string)[];
}

type Props = {
  isEdit: boolean;
  currentInformation?: Information;
};

export default function InformationNewEditForm({ isEdit, currentInformation }: Props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewAdvantageSchema = Yup.object().shape({
    id: Yup.string(),
    page: Yup.string().required('Page is required'),
    title: Yup.string().required('Title is required'),
    subtitle: Yup.string().required('Subtitle is required'),
    variants: Yup.array(
      Yup.object().shape({
        title: Yup.string().nullable(),
        url: Yup.string().nullable(),
        content: Yup.string().nullable(),
        image: Yup.mixed<string | CustomFile>().nullable(),
      }),
    ).min(1, 'at least 1 variant'),
    assets: Yup.array().of(Yup.mixed<string | CustomFile>()),
  });
  const defaultValues = useMemo(
    () => ({
      id: currentInformation?.id || '',
      page: currentInformation?.page || '',
      title: currentInformation?.title || '',
      subtitle: currentInformation?.subtitle || '',
      description: currentInformation?.description || '',
      variants:(currentInformation?.variants ?? []).map((variant) => ({
        title: variant.title ?? '',
        url: variant.url ?? '',
        content: variant.content ?? '',
        image: variant.image ?? '',
      })) || [
        {
          title: '',
          url: '',
          content: '',
          image: '',
        },
      ],
      assets: currentInformation?.assets || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentInformation],
  );
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewAdvantageSchema) as Resolver<FormValuesProps>,
    defaultValues,
  });
  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });
  const values = watch();

  const { mutateAsync: mutateAsyncUploadAssets } = useMutation({
    mutationFn: (payload: UploadAssetsPayload) => ApiInformationRepository.uploadAssets(payload),
    onError: () => {
      enqueueSnackbar('Không thể upload ảnh tài nguyên!', {
        variant: 'error',
      });
    },
  });
  const { mutateAsync: mutateAsyncUploadVariantImage } = useMutation({
    mutationFn: (payload: UploadVariantImagePayload) =>
      ApiInformationRepository.uploadVariantImage(payload),
    onError: () => {
      enqueueSnackbar('Không thể upload các ảnh biến thể!', {
        variant: 'error',
      });
    },
  });
  // const { mutateAsync: mutateAsyncCreateInformation } = useMutation({
  //   mutationFn: (payload: CreateInformationPayload) => ApiInformationRepository.createInformation(payload),
  //
  //     onError:() => {
  //       enqueueSnackbar('Không thể tạo thông tin!', {
  //         variant: 'error',
  //       });
  //     },
  //     onSuccess:(data)=> {
  //       if (!data.error) {
  //         enqueueSnackbar('Tạo thông tin thành công!', {
  //           variant: 'success',
  //         });
  //         navigate(PATH_DASHBOARD.information.list);
  //       } else {
  //         enqueueSnackbar(data.message, {
  //           variant: 'error',
  //         });
  //       }
  //     },
  //   },
  // );
  const { mutateAsync: mutateAsyncUpdateInformation } = useMutation({
    mutationFn: (payload: UpdateInformationPayload) =>
      ApiInformationRepository.updateInformation(payload),
    onError: () => {
      enqueueSnackbar('Không thể cập nhật thông tin!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Cập nhật thông tin thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.information.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });

  useEffect(() => {
    if (isEdit && currentInformation) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentInformation]);

  const handleAdd = () => {
    append({
      title: '',
      url: '',
      content: '',
      image: '',
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const assets = values.assets || [];

      const filesData = new FormData();
      for (let i = 0; i < acceptedFiles.length; i++) {
        filesData.append(`files`, acceptedFiles[i]);
      }
      const response = await mutateAsyncUploadAssets(filesData);

      setValue(`assets`, [...assets, ...response.map((r) => `${API_DOMAIN}/${r.path}`)]);
    },
    [mutateAsyncUploadAssets, setValue, values.assets],
  );

  const handleDropVariantImage = useCallback(
    async (acceptedFiles: File[], index: number) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          `variants.${index}.image`,
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        );

        const filesData = new FormData();
        filesData.append(`file`, file);
        const response = await mutateAsyncUploadVariantImage(filesData);
        setValue(`variants.${index}.image`, `${API_DOMAIN}/${response.path}`);
      }
    },
    [mutateAsyncUploadVariantImage, setValue],
  );

  const handleRemoveAllAssets = () => {
    setValue('assets', []);
  };

  const handleRemoveAsset = (file: File | string) => {
    const filteredItems = values.assets && values.assets?.filter((_file) => _file !== file);

    setValue('assets', filteredItems);
  };

  const onSubmit = async (data: FormValuesProps) => {
    await mutateAsyncUpdateInformation({
      ...data,
      id: currentInformation?.id as string,
    });

    // if (!isEdit) {
    //   mutateAsyncCreateInformation({
    //     informationInput: payload as {
    //       _id: string;
    //       page: string;
    //       title: string;
    //       subtitle: string;
    //       description?: string | undefined;
    //       variants: InformationVariant[];
    //       assets?: string[] | null | undefined;
    //     },
    //   });
    // } else {
    //   mutateAsyncUpdateInformation({
    //     informationInput: {
    //       ...payload,
    //       _id: currentInformation?._id as string,
    //     },
    //   });
    // }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid size={8}>
          <Card sx={{ p: 3 }}>
            <div>
              <LabelStyle>Description</LabelStyle>
              <RHFEditor simple name="description" />
            </div>

            <div>
              <LabelStyle>Images</LabelStyle>

              <RHFUploadMultiFile
                showPreview
                name="assets"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveAsset}
                onRemoveAll={handleRemoveAllAssets}
              />
            </div>

            <Typography variant="h6" sx={{ color: 'text.disabled', my: 3 }}>
              Variants:
            </Typography>

            <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
              {fields.map((item, index) => (
                <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                    <RHFTextField
                      name={`variants[${index}].title`}
                      size="small"
                      type="text"
                      label="Title"
                    />

                    <RHFTextField
                      name={`variants[${index}].url`}
                      size="small"
                      type="text"
                      label="Url"
                    />

                    <RHFTextField
                      name={`variants[${index}].content`}
                      size="small"
                      type="text"
                      label="Content"
                    />
                  </Stack>

                  <Box sx={{ width: '100%' }}>
                    <LabelStyle>Image</LabelStyle>
                    <RHFUploadSingleFile
                      name={`variants[${index}].image`}
                      maxSize={3145728}
                      onDrop={(acceptedFiles) => handleDropVariantImage(acceptedFiles, index)}
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
              Add new variant
            </Button>
          </Card>
        </Grid>

        <Grid size={8}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="page" label="Page" />

                <RHFTextField name="title" label="Title" />

                <RHFTextField name="subtitle" label="Subtitle" />
              </Stack>
            </Card>

            <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Information' : 'Save Changes'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
