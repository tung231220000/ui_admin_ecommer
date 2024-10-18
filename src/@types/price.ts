export enum Currency {
  VND = 'VNĐ',
}

export enum TimeUnit {
  MONTH = 'Tháng',
}
export type Price = {
  _id: string;
  name: string;
  defaultPrice: number;
  salePrice: number | null;
  currency: Currency;
  unit: TimeUnit;
};