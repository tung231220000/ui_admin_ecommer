import React from 'react';
import * as Yup from 'yup';

import { CURRENCIES, TIME_UNITS } from '@/utils/constant';
import { Card, Grid, InputAdornment, Stack } from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import { useEffect, useMemo } from 'react';

import { LoadingButton } from '@mui/lab';
import { Currency, Price, TimeUnit } from '@/@types/price';
import { Resolver, useForm } from 'react-hook-form';
import usePrice from '@/hooks/usePrice';
import { yupResolver } from '@hookform/resolvers/yup';
import { BonusService } from '@/@types/bonus-service';

// ----------------------------------------------------------------------

type FormValuesProps = Price;

type Props = {
  isEdit: boolean;
  currentPrice?: Price;
};

export default function PriceNewEditForm({ isEdit, currentPrice }: Props) {
  const { createPrice, updatePrice } = usePrice();

  const NewPriceSchema = Yup.object().shape({
    _id: Yup.string(),
    name: Yup.string().required('Name is required'),
    defaultPrice: Yup.number()
      .integer()
      .moreThan(0, 'Price must be greater than 0')
      .required('defaultPrice is required'),
    salePrice: Yup.number().nullable().required('Sale price is required'),
    currency: Yup.mixed<Currency>()
      .oneOf(Object.values(Currency) as Currency[])
      .required('Currency is required'),
    unit: Yup.mixed<TimeUnit>()
      .oneOf(Object.values(TimeUnit) as TimeUnit[])
      .required('Unit is required'),
  });

  const defaultValues = useMemo(
    () => ({
      _id: currentPrice?._id || '',
      name: currentPrice?.name || '',
      defaultPrice: currentPrice?.defaultPrice || 0,
      salePrice: currentPrice?.salePrice ?? null,
      currency: currentPrice?.currency || CURRENCIES[0],
      unit: currentPrice?.unit || TIME_UNITS[0],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPrice],
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewPriceSchema) as unknown as Resolver<FormValuesProps>,
    defaultValues,
  });

  const {
    reset,
    watch,
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  watch();

  useEffect(() => {
    if (isEdit && currentPrice) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentPrice]);

  const onSubmit = async (data: FormValuesProps) => {
    if (!isEdit) {
      createPrice({
        priceInput: data,
      });
    } else {
      updatePrice({
        priceInput: {
          _id: currentPrice?._id as string,
          name: data.name,
          defaultPrice: data.defaultPrice,
          salePrice: data.salePrice,
          currency: data.currency,
          unit: data.unit,
        },
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <RHFTextField name="name" label="Price Name" />
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField
                  name="defaultPrice"
                  label="Default Price"
                  placeholder="0"
                  value={getValues('defaultPrice') === 0 ? '' : getValues('defaultPrice')}
                  onChange={(event) => setValue('defaultPrice', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: 'number',
                    endAdornment: (
                      <InputAdornment position="start">{getValues('currency')}</InputAdornment>
                    ),
                  }}
                />

                <RHFTextField
                  name="salePrice"
                  label="Sale Price"
                  placeholder="0"
                  value={getValues('salePrice') === 0 ? '' : getValues('salePrice')}
                  onChange={(event) => setValue('salePrice', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: 'number',
                    endAdornment: (
                      <InputAdornment position="start">{getValues('currency')}</InputAdornment>
                    ),
                  }}
                />
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
                    <option key={timeUnit} value={timeUnit}>
                      {timeUnit}
                    </option>
                  ))}
                </RHFSelect>
              </Stack>
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Price' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
