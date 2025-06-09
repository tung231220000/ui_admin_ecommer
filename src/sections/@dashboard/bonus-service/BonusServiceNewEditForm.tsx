import React from 'react';
import * as Yup from 'yup';

import { ATTRIBUTE_KEYS, CURRENCIES, TIME_UNITS } from '@/utils/constant';
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import { useEffect, useMemo } from 'react';
import { Resolver, useFieldArray, useForm } from 'react-hook-form';

import { BonusService } from '@/@types/bonus-service';
import Iconify from '@/components/Iconify';
import { LoadingButton } from '@mui/lab';
import useBonusService from '@/hooks/useBonusService';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { Currency } from '@/@types/price';
import { AttributeKey } from '@/@types/product';

// ----------------------------------------------------------------------

type FormValuesProps = BonusService;

type Props = {
  isEdit: boolean;
  currentBonusService?: BonusService;
};

export default function BonusServiceNewEditForm({ isEdit, currentBonusService }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const { createBonusService, updateBonusService } = useBonusService();
  const defaultValues = useMemo(
    () => ({
      key: currentBonusService?.key || ATTRIBUTE_KEYS[0],
      minValue: currentBonusService?.minValue ?? '', // Ensure default is compatible with schema
      maxValue: currentBonusService?.maxValue ?? '', // Same for maxValue
      name: currentBonusService?.name || '',
      unitPrices: currentBonusService?.unitPrices || [
        {
          minValue: '',
          price: 0,
        },
      ],
      currency: currentBonusService?.currency || CURRENCIES[0],
      unit: currentBonusService?.unit || TIME_UNITS[0],
      isNumber: typeof currentBonusService?.minValue === 'number',
    }),
    [currentBonusService],
  );

  const NewBonusServiceSchema = Yup.object().shape({
    _id: Yup.string(),
    key: Yup.mixed<AttributeKey>()
      .oneOf(Object.values(AttributeKey) as AttributeKey[])
      .required('Key is required'),
    isNumber: Yup.boolean().required(),
    minValue: Yup.lazy((_, context) => {
      const isNumber = context?.parent?.isNumber;
      return isNumber
        ? Yup.number().required('Min value is required')
        : Yup.string().required('Min value is required');
    }),
    maxValue: Yup.mixed().when('isNumber', {
      is: true,
      then: () =>
        Yup.number()
          .nullable()
          .required('Max value is required')
          .test('minValue', 'Max value must be greater than min value', function (value) {
            const { minValue } = this.parent;
            if (minValue === undefined || value === undefined) return true;
            return Number(value) > Number(minValue);
          }),
      otherwise: () => Yup.string().nullable().required('Max value is required'),
    }),
    name: Yup.string().required('Name is required'),
    unitPrices: Yup.array()
      .of(
        Yup.object({
          minValue: Yup.mixed<string | number>().required('Min value is required'),
          price: Yup.number().required('Price is required'),
        }),
      )
      .optional(),

    currency: Yup.mixed<Currency>()
      .oneOf(Object.values(Currency) as Currency[])
      .required('Currency is required'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewBonusServiceSchema) as unknown as Resolver<BonusService>,
    defaultValues,
  });

  const {
    reset,
    control,
    watch,
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'unitPrices',
  });
  watch();

  useEffect(() => {
    if (isEdit && currentBonusService) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentBonusService]);

  const handleAdd = () => {
    append({
      minValue: '',
      price: 0,
    });
  };

  const handleRemove = (index: number) => {
    if (fields.length === 1) {
      enqueueSnackbar('At least one unit price is required', {
        variant: 'error',
      });
      return;
    }
    remove(index);
  };

  const onSubmit = async (data: FormValuesProps) => {
    if (!isEdit) {
      createBonusService({
        bonusServiceInput: data,
      });
    } else {
      updateBonusService({
        bonusServiceInput: {
          ...data,
          _id: currentBonusService?._id as string,
        },
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                },
              }}
            >
              <RHFSelect
                name={'key'}
                label="Key"
                InputLabelProps={{ shrink: true }}
                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
              >
                {ATTRIBUTE_KEYS.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    sx={{
                      mx: 1,
                      my: 0.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      textTransform: 'capitalize',
                    }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField name="name" label="Name" />
            </Box>

            <Typography variant="h6" sx={{ color: 'text.disabled', my: 3 }}>
              Unit Prices:
            </Typography>

            <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
              {fields.map((item, index) => (
                <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                    <RHFTextField
                      name={`unitPrices[${index}].minValue`}
                      size="small"
                      type="text"
                      label="Min value"
                    />

                    <RHFTextField
                      name={`unitPrices[${index}].price`}
                      size="small"
                      label="Price"
                      placeholder="0"
                      value={getValues(`unitPrices.${index}.price`)}
                      onChange={(event) =>
                        setValue(`unitPrices.${index}.price`, Number(event.target.value))
                      }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        type: 'number',
                        endAdornment: (
                          <InputAdornment position="start">{getValues('currency')}</InputAdornment>
                        ),
                      }}
                    />
                  </Stack>

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
              Add new unit price
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="minValue" label="Min Value" />

                <RHFTextField name="maxValue" label="Max Value" />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFSelect name="currency" label="Currency">
                  {CURRENCIES.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </RHFSelect>

                <RHFSelect name="unit" label="Unit">
                  {TIME_UNITS.map((timeUnit) => (
                    <option key={String(timeUnit)} value={timeUnit}>
                      {timeUnit}
                    </option>
                  ))}
                </RHFSelect>
              </Stack>
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Bonus Service' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
