import * as Yup from 'yup';

import {
  Autocomplete,
  Box,
  Card,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
  styled,
  Button,
} from '@mui/material';
import { Controller, Resolver, useForm } from 'react-hook-form';
import {
  FormProvider,
  RHFEditor,
  RHFSelect,
  RHFTextField,
  RHFUploadSingleFile,
} from '../../../components/hook-form';
import { useCallback, useEffect, useMemo } from 'react';

import { Advantage } from '@/@types/advantage';
import { CustomFile } from '@/components/upload';
import { API_DOMAIN } from '@/utils/constant';
import { PATH_DASHBOARD } from '@/routes/paths';
import { Service } from '@/@types/service';
import { Solution } from '@/@types/solution';
import { SolutionCategory } from '@/@types/solution-category';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import ApiSolutionRepository, {
  CreateSolutionPayload,
  UpdateSolutionPayload,
  UploadBannerImagePayload,
} from '@/apis/apiService/solution.api';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

interface FormValuesProps
  extends Omit<Solution, 'category' | 'banner' | 'advantages' | 'services'> {
  category: string;
  banner: CustomFile | string;
  advantages: string[];
  services: string[];
}

type Props = {
  categories: SolutionCategory[];
  advantages: Advantage[];
  services: Service[];
  isEdit: boolean;
  currentSolution?: Solution;
};

export default function SolutionNewEditForm({
  categories,
  advantages,
  services,
  isEdit,
  currentSolution,
}: Props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: mutateAsyncUploadBannerImage } = useMutation({
    mutationFn: (payload: UploadBannerImagePayload) =>
      ApiSolutionRepository.uploadBannerImage(payload),
    onError: () => {
      enqueueSnackbar('Không thể upload ảnh banner!', {
        variant: 'error',
      });
    },
  });
  const { mutateAsync: mutateAsyncCreateSolution } = useMutation({
    mutationFn: (payload: CreateSolutionPayload) => ApiSolutionRepository.createSolution(payload),
    onError: () => {
      enqueueSnackbar('Không thể tạo giải pháp!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Tạo giải pháp thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.solution.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });
  const { mutateAsync: mutateAsyncUpdateSolution } = useMutation({
    mutationFn: (payload: UpdateSolutionPayload) => ApiSolutionRepository.updateSolution(payload),
    onError: () => {
      enqueueSnackbar('Không thể cập nhật giải pháp!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Cập nhật giải pháp thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.solution.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });

  const defaultValues = useMemo(
    () => ({
      _id: currentSolution?._id || '',
      key: currentSolution?.key || '',
      category: currentSolution?.category._id || categories[0]._id,
      banner: currentSolution?.banner ?? '',
      intro: currentSolution?.intro || '',
      title: currentSolution?.title || '',
      description: currentSolution?.description || '',
      advantages: currentSolution?.advantages?.map((adv) => adv?._id ?? '') ?? [],
      services: currentSolution?.services?.map((svc) => svc?._id ?? '') ?? [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSolution, categories],
  );
  const NewSolutionSchema = Yup.object().shape({
    _id: Yup.string(),
    key: Yup.string().required('Key is required'),
    category: Yup.string().required('Category is required'),
    banner: Yup.mixed<string | CustomFile>().required('Banner is required'),
    intro: Yup.string().required('Intro is required'),
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    advantages: Yup.array()
      .of(Yup.string().required('Each advantage is required'))
      .required('Advantages are required'),

    services: Yup.array()
      .of(Yup.string().required('Each service is required'))
      .required('Services are required'),
  });
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewSolutionSchema) as Resolver<FormValuesProps>,
    defaultValues: defaultValues as FormValuesProps,
  });
  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentSolution) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentSolution]);

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
        setValue(`banner`, `${API_DOMAIN}/${response.path}`);
      }
    },
    [mutateAsyncUploadBannerImage, setValue],
  );

  const onSubmit = async (data: FormValuesProps) => {
    if (!isEdit) {
      mutateAsyncCreateSolution({
        solutionInput: data,
      });
    } else {
      mutateAsyncUpdateSolution({
        solutionInput: {
          ...data,
          _id: currentSolution?._id as string,
        },
      });
    }
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

              <RHFTextField name="title" label="Title" />

              <RHFTextField name="intro" label="Intro" />
            </Box>

            <Box sx={{ mt: 3 }}>
              <LabelStyle>Description</LabelStyle>
              <RHFEditor simple name="description" />
            </Box>
          </Card>
        </Grid>

        <Grid size={8}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFSelect name="category" label="Category">
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </RHFSelect>

                <Controller
                  name="advantages"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      freeSolo
                      onChange={(_event, newValue) => field.onChange(newValue)}
                      options={advantages.map((advantage) => advantage._id)}
                      renderOption={(props, advantageId) => {
                        const { title } = advantages.find(
                          (a) => a._id === advantageId,
                        ) as Advantage;

                        return <li {...props}>{title}</li>;
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          const foundAdvantage = advantages.find((a) => a._id === option);

                          return (
                            <Chip
                              {...getTagProps({ index })}
                              key={option}
                              size="small"
                              label={foundAdvantage?.title}
                            />
                          );
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          inputRef={ref}
                          error={invalid}
                          label="Advantages"
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="services"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      freeSolo
                      onChange={(_event, newValue) => field.onChange(newValue)}
                      options={services.map((service) => service._id)}
                      renderOption={(props, advantageId) => {
                        const { key } = services.find((a) => a._id === advantageId) as Service;

                        return <li {...props}>{key}</li>;
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          const foundService = services.find((s) => s._id === option);

                          return (
                            <Chip
                              {...getTagProps({ index })}
                              key={option}
                              size="small"
                              label={foundService?.key}
                            />
                          );
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          inputRef={ref}
                          error={invalid}
                          label="Services"
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />
              </Stack>
            </Card>

            <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Solution' : 'Save Changes'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
