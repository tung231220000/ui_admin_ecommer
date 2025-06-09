import React from "react";
import * as Yup from 'yup';

import {
  Autocomplete,
  Button,
  Card,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { FC, useCallback, useEffect, useState } from 'react';
import {
  FormProvider,
  RHFEditor,
  RHFTextField,
  RHFUploadSingleFile,
} from '../../../components/hook-form';

import BlogNewPostPreview from './BlogNewPostPreview';
import { CustomFile } from '@/components/upload';
import { API_DOMAIN } from "@/utils/constant";
import { PATH_DASHBOARD } from '@/routes/paths';
import { Post } from '@/@types/post';
import { styled } from '@mui/material/styles';
import useAuth from '@/hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import ApiPostRepository, {
  CreatePostPayload,
  UpdatePostPayload,
  UploadCoverImagePayload
} from "@/apis/apiService/post.api";
// import {UserMock} from "@/@types/user";

// ----------------------------------------------------------------------

const TAGS = [
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots',
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

export interface FormValuesProps extends Omit<Post, 'cover'> {
  cover: CustomFile | string;
}

type Props = {
  isEdit: boolean;
  currentPost?: Post;
};

const BlogNewPostForm: FC<Props> = ({ isEdit, currentPost }) => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);

  const { mutateAsync: mutateAsyncUploadCoverImage } = useMutation({
    mutationFn: (payload: UploadCoverImagePayload) => ApiPostRepository.uploadCoverImage(payload),
    onError: () => {
      enqueueSnackbar('Không thể upload ảnh cover!', {
        variant: 'error',
      });
    }
  });

  const {mutateAsync: mutateAsyncCreatePost} = useMutation({
      mutationFn: (payload: CreatePostPayload) => ApiPostRepository.createPost(payload),
      onError: () => {
        enqueueSnackbar('Không thể tạo bài viết!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.error) {
          reset();
          handleClosePreview();
          enqueueSnackbar('Tạo bài viết thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.blog.posts);
        } else {
          enqueueSnackbar(data.error, {
            variant: 'error',
          });
        }
      },
    }
  );

  const {mutateAsync: mutateAsyncUpdatePost} = useMutation({
    mutationFn: (payload: UpdatePostPayload) => ApiPostRepository.updatePost(payload),
    onError: () => {
      enqueueSnackbar('Không thể cập nhật bài viết!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Cập nhật bài viết thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.blog.posts);
      } else {
        enqueueSnackbar(data.error, {
          variant: 'error',
        });
      }
    },
  });

  const NewBlogSchema = Yup.object().shape({
    id: Yup.string().default(''),
    cover: Yup.mixed<CustomFile | string>().defined().required('Cover is required'),
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    createdAt: Yup.mixed<Date | string | number>().defined(),
    views: Yup.number().default(0),
    favorite:  Yup.number().default(0),
    body: Yup.string().min(1000).required('Content is required'),
    tags: Yup.array().min(1, 'Tag is required').defined(),
  });
  const defaultValues = {
    id: currentPost?.id || '',
    cover: currentPost?.cover || '',
    title: currentPost?.title || '',
    description: currentPost?.description || '',
    createdAt: currentPost?.createdAt || '',
    body: currentPost?.body || '',
    views: currentPost?.views ?? 0,
    favorite: currentPost?.favorite ?? 0,
    tags: currentPost?.tags ?? [],
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });
  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;
  const values = watch();

  useEffect(() => {
    if (isEdit && currentPost) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentPost]);

  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'cover',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        const filesData = new FormData();
        filesData.append(`file`, file);
        const response = await mutateAsyncUploadCoverImage(filesData);
        setValue(`cover`, `${API_DOMAIN}/${response.path}`);
      }
    },
    [mutateAsyncUploadCoverImage, setValue]
  );

  const onSubmit = async (data: FormValuesProps) => {
    if (!isEdit) {
      mutateAsyncCreatePost({
        postInput: {
          ...data,
          author: user?.id,
          createdAt: new Date(),
        },
      });
    } else {
      mutateAsyncUpdatePost({
        postInput: {
          ...data,
          author: user?.id,
          createdAt: currentPost?.createdAt as Date,
          id: currentPost?.id as string,
        },
      });
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <div>
                  <LabelStyle>Cover</LabelStyle>
                  <RHFUploadSingleFile name="cover" maxSize={3145728} onDrop={handleDrop} />
                </div>

                <div>
                  <LabelStyle>Content</LabelStyle>
                  <RHFEditor name="body" />
                </div>
              </Stack>
            </Card>
          </Grid>

          <Grid size={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="title" label="Post Title" />

                <RHFTextField name="description" label="Description" multiline rows={3} />

                <Controller
                  name="tags"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      freeSolo
                      options={TAGS}
                      onChange={(_event, newValue) => field.onChange(newValue)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option}
                            size="small"
                            label={option}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          inputRef={ref}
                          error={invalid}
                          label="Tags"
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />
              </Stack>
            </Card>

            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
              <Button
                fullWidth
                color="inherit"
                variant="outlined"
                size="large"
                onClick={handleOpenPreview}
              >
                Preview
              </Button>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
              >
                {isEdit ? 'Save Changes' : 'Post'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>

      <BlogNewPostPreview
        values={values}
        isOpen={open}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onClose={handleClosePreview}
        onSubmit={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default BlogNewPostForm;
