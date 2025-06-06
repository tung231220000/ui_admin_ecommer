import React from "react";
import { Box, Button, Container, DialogActions, Typography } from '@mui/material';

import { DialogAnimate } from '../../../components/animate';
import EmptyContent from '../../../components/EmptyContent';
import { FormValuesProps } from './BlogNewPostForm';
import Image from '../../../components/Image';
import Markdown from '@/components/MarkDown';
import Scrollbar from '../../../components/Scrollbar';
import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

type Props = {
  values: FormValuesProps;
  isOpen: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  onClose: VoidFunction;
  onSubmit: VoidFunction;
};

export default function BlogNewPostPreview({
  values,
  isValid,
  isSubmitting,
  isOpen,
  onClose,
  onSubmit,
}: Props) {
  const { title, body, description } = values;

  const cover = typeof values.cover === 'string' ? values.cover : undefined;

  const hasContent = title || description || body || cover;

  const hasHero = title || cover;

  return (
    <DialogAnimate fullScreen open={isOpen} onClose={onClose}>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          Preview Post
        </Typography>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!isValid}
          loading={isSubmitting}
          onClick={onSubmit}
        >
          Post
        </Button>
      </DialogActions>

      {hasContent ? (
        <Scrollbar>
          {hasHero && <PreviewHero title={title || ''} cover={cover} />}
          <Container>
            <Box sx={{ mt: 5, mb: 10 }}>
              <Typography variant="h6" sx={{ mb: 5 }}>
                {description}
              </Typography>
              <Markdown children={body || ''} />
            </Box>
          </Container>
        </Scrollbar>
      ) : (
        <EmptyContent title="Empty content" />
      )}
    </DialogAnimate>
  );
}

// ----------------------------------------------------------------------

type PreviewHeroProps = {
  title: string;
  cover?: string;
};

function PreviewHero({ title, cover }: PreviewHeroProps) {
  return (
    <Box sx={{ position: 'relative' }}>
      <Container
        sx={{
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9,
          position: 'absolute',
          color: 'common.white',
          pt: { xs: 3, lg: 10 },
        }}
      >
        <Typography variant="h2" component="h1">
          {title}
        </Typography>
      </Container>

      <Box
        sx={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 8,
          position: 'absolute',
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
        }}
      />
      <Image alt="cover" src={cover} ratio="16/9" />
    </Box>
  );
}
