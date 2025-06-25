export type InformationVariant = {
  id?: number;
  idInformation?: number;
  title?: string | null;
  url?: string | null;
  content?: string | null;
  image?: string | null;
};

export type Information = {
  idInformation?: number;
  page: string;
  title: string;
  subtitle: string;
  description?: string | null;
  variants: InformationVariant[];
  assets?: string[] | null;
};
