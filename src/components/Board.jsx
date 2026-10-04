import { useState, useEffect } from 'react';
import { getPosts, deletePost } from '../api';
import Post from './Post';
import styles from './Board.module.css';

const POSTS_PER_PAGE = 10;

function Board({ refreshTrigger, onEditPost }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch posts from API
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
  }, [refreshTrigger]);

  // Handle post deletion
  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('글 삭제에 실패했습니다.');
    }
  };

  // Sort posts by newest (createdAt or id descending)
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.createdAt && b.createdAt && a.createdAt !== b.createdAt) {
      return b.createdAt.localeCompare(a.createdAt);
    }
    return String(b.id).localeCompare(String(a.id), undefined, { numeric: true });
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = sortedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  if (loading) {
    return (
      <ul className={styles.postList}>
        {Array.from({ length: 3 }).map((_, index) => (
          <li key={index} className={styles.skeletonCard}>
            <div className="skeleton" style={{ width: '45%', height: '24px', marginBottom: '12px' }} />
            <div className="skeleton" style={{ width: '90%', height: '16px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ width: '30%', height: '14px' }} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section>
      {error && <div className={styles.errorBanner}>⚠️ {error}</div>}

      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>📋 게시물</h2>
        <span className={styles.countBadge}>전체 글: {posts.length}</span>
      </div>

      {sortedPosts.length === 0 ? (
        <div className={styles.emptyState}>
          <p style={{ fontSize: '1.1rem', margin: '0 0 8px 0' }}>📭 작성된 글이 없습니다.</p>
          <span>첫 번째 게시글을 작성해보세요!</span>
        </div>
      ) : (
        <>
          <ul className={styles.postList}>
            {currentPosts.map((post) => (
              <Post
                key={post.id}
                post={post}
                onEdit={onEditPost}
                onDelete={handleDelete}
              />
            ))}
          </ul>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Page navigation">
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={safeCurrentPage === 1}
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  className={pageNum === safeCurrentPage ? styles.activePageBtn : styles.pageBtn}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={safeCurrentPage === totalPages}
              >
                &gt;
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}

export default Board;
