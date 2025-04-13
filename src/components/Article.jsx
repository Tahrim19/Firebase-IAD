import { deleteArticle, updateArticle } from '../services/articleService';
import { useState, useEffect } from 'react';

export default function Article({ article, onUpdate, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  // Sync editing fields with the selected article
  useEffect(() => {
    if (article) {
      setEditTitle(article.title || '');
      setEditBody(article.body || '');
    }
  }, [article]);

  const handleUpdate = async () => {
    if (!article) return;

    // Validation: Ensure both title and body are provided
    if (!editTitle.trim() || !editBody.trim()) {
      alert("Both title and body are required to save the article.");
      return;
    }

    setLoading(true);

    try {
      const updated = {
        ...article,
        title: editTitle,
        body: editBody,
      };

      const result = await updateArticle(article.id, updated);
      onUpdate && onUpdate(result); // Notify parent about the update
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating article:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!article) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this article?");
    if (!confirmDelete) return;

    setLoading(true);

    try {
      await deleteArticle(article.id);
      onDelete && onDelete(article.id); // Notify parent about the deletion
    } catch (error) {
      console.error("Error deleting article:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!article) {
    return <p>No article selected</p>;
  }

  const formattedDate = article.updatedAt
    ? `Updated: ${article.updatedAt.toDate().toLocaleString()}`
    : `Posted: ${article.date.toDate().toLocaleString()}`;

  return (
    <article>
      <section>
        {isEditing ? (
          <>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Edit title"
            />
            <textarea
              rows={8}
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              placeholder="Edit body"
            />
            <button onClick={handleUpdate} disabled={loading}>Save</button>
            <button onClick={() => setIsEditing(false)} disabled={loading}>Cancel</button>
          </>
        ) : (
          <>
            <h2>{article.title}</h2>
            <p className="date">{formattedDate}</p>
            <p className="body">{article.body}</p>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete} disabled={loading}>Delete</button>
          </>
        )}
      </section>
    </article>
  );
}