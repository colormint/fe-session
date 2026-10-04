import { useState } from 'react';
import PostAction from './components/PostAction';
import Board from './components/Board';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingPost, setEditingPost] = useState(null);

  const handleSuccess = () => {
    setEditingPost(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main style={{ maxWidth: '640px', margin: '0 auto', padding: '36px 20px' }}>
      <header style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1864ab' }}>
          📝 게시판
        </h1>
      </header>

      {/* Unified post creation and edit form */}
      <PostAction
        key={editingPost ? editingPost.id : 'create'}
        editingPost={editingPost}
        onSuccess={handleSuccess}
        onCancelEdit={handleCancelEdit}
      />

      {/* Post list board with pagination and sorting */}
      <Board
        refreshTrigger={refreshTrigger}
        onEditPost={handleEditPost}
      />
    </main>
  );
}

export default App;