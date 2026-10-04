import { useState } from 'react';
import { createPost, updatePost } from '../api';
import styles from './PostAction.module.css';

function PostAction({ editingPost, onSuccess, onCancelEdit }) {
  const [title, setTitle] = useState(editingPost ? editingPost.title : '');
  const [author, setAuthor] = useState(editingPost ? editingPost.author : '');
  const [content, setContent] = useState(editingPost ? editingPost.content : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle post submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const submitAuthor = author.trim() || '익명';

    try {
      setIsSubmitting(true);

      if (editingPost) {
        // Update existing post (PATCH)
        await updatePost(editingPost.id, {
          title: title.trim(),
          author: submitAuthor,
          content: content.trim(),
        });
      } else {
        // Create new post (POST)
        const newPost = {
          title: title.trim(),
          author: submitAuthor,
          content: content.trim(),
          createdAt: new Date().toISOString().slice(0, 10),
        };
        await createPost(newPost);
      }

      // Clear input fields
      setTitle('');
      setAuthor('');
      setContent('');

      if (onSuccess) {
        onSuccess();
        alert(editingPost ? '글 수정에 성공했어요.' : '글 게시에 성공했어요.');
      }
    } catch (err) {
      console.error(err);
      alert(editingPost ? '글 수정에 실패했어요.' : '글 게시에 실패했어요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = Boolean(editingPost);

  return (
    <form onSubmit={handleSubmit} className={styles.formCard}>
      <div className={styles.formHeader}>
        <h3 className={styles.formTitle}>
          {isEditing ? '✏️ 글 수정' : '✏️ 글 쓰기'}
        </h3>
        {isEditing && <span className={styles.editBadge}>수정 모드</span>}
      </div>

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

      <div className={styles.buttonGroup}>
        {isEditing && (
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancelEdit}
            disabled={isSubmitting}
          >
            취소
          </button>
        )}
        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? '수정중...'
              : '게시중...'
            : isEditing
              ? '수정 완료'
              : '게시'}
        </button>
      </div>
    </form>
  );
}

export default PostAction;
