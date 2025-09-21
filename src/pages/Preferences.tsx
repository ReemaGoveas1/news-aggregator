import React, { useEffect, useState } from 'react';

const sources = ['guardian', 'nytimes'];
const categories = ['general', 'business', 'technology', 'sports'];
const authors = ['Author A', 'Author B', 'Author C'];

export default function Preferences() {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [status, setStatus] = useState('');

  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    if (user.preferences) {
      setSelectedSources(user.preferences.sources || []);
      setSelectedCategories(user.preferences.categories || []);
      setSelectedAuthors(user.preferences.authors || []);
    }
  }, [user.preferences]);

  const handleToggle = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = async () => {
    if (!user.id) {
      setStatus('User not logged in');
      return;
    }

    const updatedUser = {
      ...user,
      preferences: {
        sources: selectedSources,
        categories: selectedCategories,
        authors: selectedAuthors,
      },
    };

    try {
      const res = await fetch(`http://localhost:8000/users/${encodeURIComponent(user.id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) {
        throw new Error('Failed to save preferences');
      }

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setStatus('Preferences saved!');
    } catch (err) {
      console.error(err);
      setStatus('Failed to save.');
    }
  };

  return (
    <div className="container">
      <h2>Set Preferences</h2>

      <h3>Sources</h3>
      {sources.map((source) => (
        <label key={source} style={{ marginRight: '10px' }}>
          <input
            type="checkbox"
            checked={selectedSources.includes(source)}
            onChange={() => handleToggle(source, selectedSources, setSelectedSources)}
          />
          {source}
        </label>
      ))}

      <h3>Categories</h3>
      {categories.map((cat) => (
        <label key={cat} style={{ marginRight: '10px' }}>
          <input
            type="checkbox"
            checked={selectedCategories.includes(cat)}
            onChange={() => handleToggle(cat, selectedCategories, setSelectedCategories)}
          />
          {cat}
        </label>
      ))}

      <h3>Authors</h3>
      {authors.map((author) => (
        <label key={author} style={{ marginRight: '10px' }}>
          <input
            type="checkbox"
            checked={selectedAuthors.includes(author)}
            onChange={() => handleToggle(author, selectedAuthors, setSelectedAuthors)}
          />
          {author}
        </label>
      ))}

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSave}>Save Preferences</button>
        <p>{status}</p>
      </div>
    </div>
  );
};

