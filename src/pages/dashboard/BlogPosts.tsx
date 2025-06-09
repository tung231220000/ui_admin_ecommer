import { BlogPostCard, BlogPostsSearch, BlogPostsSort } from '@/sections/@dashboard/blog';
import { Button, Container, Grid, Stack } from '@mui/material';

// import GraphqlPostRepository from 'src/apis/graphql/post';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import { PATH_DASHBOARD } from '@/routes/paths';
import Page from '../../components/Page';
import { Link as RouterLink } from 'react-router-dom';
import { SkeletonPostItem } from '@/components/skeleton';
import orderBy from 'lodash/orderBy';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import {Post} from "@/@types/post";
import ApiPostRepository from "@/apis/apiService/post.api";

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

const applySort = (posts: Post[], sortBy: string) => {
  if (sortBy === 'latest') {
    return orderBy(posts, ['createdAt'], ['desc']);
  }
  if (sortBy === 'oldest') {
    return orderBy(posts, ['createdAt'], ['asc']);
  }
  if (sortBy === 'popular') {
    return orderBy(posts, ['view'], ['desc']);
  }
  return posts;
};

export default function BlogPosts() {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();

  const [posts, setPosts] = useState<Post[]>([]);
  const [filters, setFilters] = useState('latest');

  const sortedPosts = applySort(posts, filters);


  useQuery({
    queryKey: ['fetchPosts'],
    queryFn: async () => {
      try {
        const data = await ApiPostRepository.fetchPosts();
        if (!data.error) {
          setPosts(data.data.posts);
        } else {
          enqueueSnackbar('Không thể lấy danh sách thông tin!', {
            variant: 'error',
          });
        }
      } catch (error) {
        enqueueSnackbar('Không thể lấy danh sách thông tin!', {
          variant: 'error',
        });
      }
    },
    refetchOnWindowFocus: false,
  });

  const handleChangeSort = (value: string) => {
    if (value) {
      setFilters(value);
    }
  };

  return (
    <Page title="Blog: Posts">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Blog"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Blog', href: PATH_DASHBOARD.blog.posts },
            { name: 'Posts' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.blog.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Post
            </Button>
          }
        />

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch />
          <BlogPostsSort query={filters} options={SORT_OPTIONS} onSort={handleChangeSort} />
        </Stack>

        <Grid container spacing={3}>
          {(!posts.length ? [...Array(12)] : sortedPosts).map((post, index) =>
            post ? (
              <Grid key={post._id} item xs={12} sm={6} md={(index === 0 && 6) || 3}>
                <BlogPostCard post={post} index={index} />
              </Grid>
            ) : (
              <SkeletonPostItem key={index} />
            )
          )}
        </Grid>
      </Container>
    </Page>
  );
}
