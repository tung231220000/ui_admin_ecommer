export type InformationVariant = {
  title?: string | null;
  url?: string | null;
  content?: string | null;
  image?: string | null;
};

export type Information = {
  id: number | string;
  page: string;
  title: string;
  subtitle: string;
  description?: string | null;
  variants: InformationVariant[];
  assets?: string[] | null;
};
