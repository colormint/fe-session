import { useState, useEffect } from 'react';
import { getPosts, createPost, deletePost } from '../api';
import Post from './Post';
import styles from './Board.module.css';

function Board() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form input state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  // Fetch posts on mount
  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      try {
        setError(null);
        const data = await getPosts();
        if (isMounted) {
          setPosts(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setError('글 로딩 실패. json-server 상태를 확인하세요.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle post creation (POST /posts)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !content.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newPost = {
        title: title.trim(),
        author: author.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString().slice(0, 10),
      };

      const created = await createPost(newPost);
      setPosts((prev) => [...prev, created]);

      // Reset form
      setTitle('');
      setAuthor('');
      setContent('');
    } catch (err) {
      console.error(err);
      alert('Failed to publish post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle post deletion (DELETE /posts/:id)
  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete post.');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>📝 게시판</h1>
      </header>

      {error && <div className={styles.errorBanner}>⚠️ {error}</div>}

      {/* Write form */}
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <h3 className={styles.formTitle}>✏️ 글 쓰기</h3>

        <div className={styles.inputGroup}>
          <input
            type="text"
            className={styles.titleInput}
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
          <input
            type="text"
            className={styles.authorInput}
            placeholder="작성자"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <textarea
          className={styles.contentInput}
          placeholder="내용을 입력하세요."
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? '게시중...' : '게시'}
          </button>
        </div>
      </form>

      {/* Post list section */}
      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>📋 게시물</h2>
        <span className={styles.countBadge}>전체 글: {posts.length}</span>
      </div>

      {loading ? (
        <ul className={styles.postList}>
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className={styles.skeletonCard}>
              <div className="skeleton" style={{ width: '45%', height: '24px', marginBottom: '12px' }} />
              <div className="skeleton" style={{ width: '90%', height: '16px', marginBottom: '8px' }} />
              <div className="skeleton" style={{ width: '30%', height: '14px' }} />
            </li>
          ))}
        </ul>
      ) : posts.length === 0 ? (
        <div className={styles.emptyState}>
          <p style={{ fontSize: '1.1rem', margin: '0 0 8px 0' }}>📭 No posts found.</p>
          <span>첫 번째 게시글을 작성해보세요!</span>
        </div>
      ) : (
        <ul className={styles.postList}>
          {[...posts].reverse().map((post) => (
            <Post key={post.id} post={post} onDelete={handleDelete} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default Board;
