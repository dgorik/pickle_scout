"use client";

import { useEffect, useState } from "react";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type Comment = {
  id: number;
  email: string;
  body: string;
};

const post_url = "https://jsonplaceholder.typicode.com/posts?_limit=5";

export default function Test() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState<boolean>(true);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(post_url);
        const data = await res.json();
        setPosts(data);
      } finally {
        setPostsLoading(false);
      }
    };
    setTimeout(() => {
      fetchPosts();
    }, 2000);
  }, []);

  useEffect(() => {
    if (!selectedPostId) return;
    setCommentsLoading(true);
    setComments([]);
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${selectedPostId}/comments`,
        );
        const data = await res.json();
        setComments(data);
      } finally {
        setCommentsLoading(false);
      }
    };
    setTimeout(() => {
      fetchComments();
    }, 2000);
  }, [selectedPostId]);

  if (postsLoading) return " Posts are Loading please wait";

  if (commentsLoading) return " Comments are Loading please wait";

  return (
    <div className="flex flex-col">
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <button
              className="bg-blue-200"
              onClick={() => setSelectedPostId(post.id)}
            >
              {post.title}
            </button>
          </li>
        ))}
      </ul>
      {selectedPostId && (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p> {comment.email}</p>
              <p> {comment.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

///make a flashcaro on why you need to name components with a capital letter and why you need use default
