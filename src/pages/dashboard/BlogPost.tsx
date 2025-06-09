import { BlogPostHero, BlogPostTags } from '@/sections/@dashboard/blog';
import { Box, Button, Card, Container, Divider, Typography } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { kebabCase, sentenceCase } from 'change-case';

import ApiPostRepository from '@/apis/apiService/post.api';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Markdown from '@/components/MarkDown';
import { PATH_DASHBOARD } from '@/routes/paths';
import Page from '../../components/Page';
import { Post } from '@/@types/post';
import { SkeletonPost } from '../../components/skeleton';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function BlogPost() {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();

  const { id } = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useQuery({
    queryKey: ['fetchPost', id],
    queryFn: async () => {
      try {
        const data = await ApiPostRepository.fetchPost({ id: id as string });
        if (!data.error) {
          setPost(data.data.post);
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
          setError(data.message ? data.message : null);
        }
      } catch (e) {
        enqueueSnackbar('Không thể lấy bài viết!', {
          variant: 'error',
        });
      }
    },
    refetchOnWindowFocus: false,
  });

  return (
    <Page title="Blog: Post Details">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Post Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Blog', href: PATH_DASHBOARD.blog.posts },
            { name: sentenceCase(id as string) },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.blog.edit(kebabCase(id as string))}
            >
              Edit
            </Button>
          }
        />

        {post && (
          <Card>
            <BlogPostHero post={post} />

            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Typography variant="h6" sx={{ mb: 5 }}>
                {post.description}
              </Typography>

              <Markdown children={post.body} />

              <Box sx={{ my: 5 }}>
                <Divider />
                <BlogPostTags post={post} />
                <Divider />
              </Box>
            </Box>
          </Card>
        )}

        {!post && !error && <SkeletonPost />}

        {error && <Typography variant="h6">404 {error}!</Typography>}
      </Container>
    </Page>
  );
}
