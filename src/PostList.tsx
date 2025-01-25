import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from './redux/posts/postSlice';
import { RootState, AppDispatch } from './redux/store';

const PostList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const status = useSelector((state: RootState) => state.posts.status);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (status === 'loading') {
    return <p>Loading posts...</p>;
  }

  if (status === 'failed') {
    return <p>Error loading posts.</p>;
  }

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
