import React, { ReactNode, forwardRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';


interface Props {
  children: ReactNode;
  meta?: ReactNode;
  title?: string;
}

const Page = forwardRef<HTMLDivElement, Props>(({ children, meta, title = '', ...other }, ref) => (
  <>
    <Helmet>
      <title>{`${title} | TuKun`}</title>
      {meta}
    </Helmet>
    <Box ref={ref} {...other}>
      {children}
    </Box>
  </>
));

export default Page;