import styles from './Post.module.css';

function Post({ post, onEdit, onDelete }) {
  const handleDelete = () => {
    if (window.confirm(`"${post.title}" 글을 삭제할까요?`)) {
      onDelete(post.id);
    }
  };

  return (
    <li className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{post.title}</h3>
        <div className={styles.actionGroup}>
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => onEdit && onEdit(post)}
          >
            수정
          </button>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleDelete}
          >
            삭제
          </button>
        </div>
      </div>

      <p className={styles.content}>{post.content}</p>

      <div className={styles.footer}>
        <span>
          ✍️ <strong>{post.author || '익명'}</strong>
        </span>
        {post.createdAt && <span>📅 {post.createdAt}</span>}
      </div>
    </li>
  );
}

export default Post;
