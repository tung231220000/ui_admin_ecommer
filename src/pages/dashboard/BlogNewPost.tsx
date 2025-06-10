import { useLocation, useParams } from 'react-router-dom';

import { BlogNewPostForm } from '../../sections/@dashboard/blog';
import { Container } from '@mui/material';
import ApiPostRepository from '@/apis/apiService/post.api';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '@/routes/paths';
import Page from '../../components/Page';
import { Post } from '@/@types/post';
import { capitalCase } from 'change-case';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function BlogNewPost() {
  const { pathname } = useLocation();
  const { id = '' } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();

  const [currentPost, setCurrentPost] = useState<Post>();

  useQuery({
    queryKey: ['fetchPost', id],
    queryFn: async () => {
      try {
        const data = await ApiPostRepository.fetchPost({ id: id as string });
        if (!data.error) {
          setCurrentPost(data.data.post);
        } else {
          enqueueSnackbar('Không thể lấy danh sách thông tin!', {
            variant: 'error',
          });
        }
      } catch (error) {
        enqueueSnackbar('Không thể lấy bài viết!', {
          variant: 'error',
        });
      }
    },
    refetchOnWindowFocus: false,
  });

  const isEdit = pathname.includes('edit');

  return (
    <Page title={!isEdit ? 'Blog: Create a new post' : 'Blog: Edit a post'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new post' : 'Edit Post'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Blog', href: PATH_DASHBOARD.blog.root },
            { name: !isEdit ? 'New Post' : capitalCase(id) },
          ]}
        />

        <BlogNewPostForm isEdit={isEdit} currentPost={currentPost} />
      </Container>
    </Page>
  );
}
