import React from 'react';
import * as Yup from 'yup';

import {Button, Card, Stack} from '@mui/material';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { useEffect, useMemo } from 'react';

import { Advantage } from '@/@types/advantage';
import useAdvantage from '@/hooks/useAdvantage';
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// ----------------------------------------------------------------------

type FormValuesProps = Advantage;

type Props = {
  isEdit: boolean;
  currentAdvantage?: Advantage;
};

export default function AdvantageNewEditForm({ isEdit, currentAdvantage }: Props) {
  const { createAdvantage, updateAdvantage } = useAdvantage();

  const NewAdvantageSchema = Yup.object().shape({
    _id: Yup.string(),
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
  });

  const defaultValues = useMemo(
    () => ({
      _id: currentAdvantage?._id || '',
      title: currentAdvantage?.title || '',
      content: currentAdvantage?.content || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentAdvantage],
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewAdvantageSchema) as Resolver<FormValuesProps>,
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentAdvantage) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentAdvantage]);

  const onSubmit = async (data: FormValuesProps) => {
    if (!isEdit) {
      createAdvantage({
        advantageInput: data,
      });
    } else {
      updateAdvantage({
        advantageInput: {
          _id: currentAdvantage?._id as string,
          title: data.title,
          content: data.content,
        },
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <RHFTextField name="title" label="Title" />

          <RHFTextField name="content" label="Content" />
        </Stack>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? 'Create Advantage' : 'Save Changes'}
          </Button>
        </Stack>
      </Card>
    </FormProvider>
  );
}
