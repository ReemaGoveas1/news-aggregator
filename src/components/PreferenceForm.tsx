import React, { useEffect, useState } from 'react';
import { UserPreferences } from '../types';

const sources = ['guardian', 'nytimes'];
const categories = ['general', 'business', 'technology', 'sports'];
const authors = ['Author A', 'Author B', 'Author C'];

interface Props {
  onSave: (prefs: UserPreferences) => void;
}

export default function PreferenceForm ({ onSave }: Props) {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const prefs = user.preferences || {};
      setSelectedSources(prefs.sources || []);
      setSelectedCategories(prefs.categories || []);
      setSelectedAuthors(prefs.authors || []);
    }
  }, []);

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
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setStatus('User not logged in');
      return;
    }

    const user = JSON.parse(userStr);
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
    <div className="container" style={{ marginBottom: '20px' }}>
      <h3>Preferences</h3>

      <div>
        <strong>Sources:</strong>
        {sources.map((src) => (
          <label key={src} style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              checked={selectedSources.includes(src)}
              onChange={() => handleToggle(src, selectedSources, setSelectedSources)}
            />
            {src}
          </label>
        ))}
      </div>

      <div style={{ marginTop: '10px' }}>
        <strong>Categories:</strong>
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
      </div>

      <div style={{ marginTop: '10px' }}>
        <strong>Authors:</strong>
        {authors.map((auth) => (
          <label key={auth} style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              checked={selectedAuthors.includes(auth)}
              onChange={() => handleToggle(auth, selectedAuthors, setSelectedAuthors)}
            />
            {auth}
          </label>
        ))}
      </div>

      <div style={{ marginTop: '10px' }}>
        <button onClick={handleSave}>Save Preferences</button>
        <p>{status}</p>
      </div>
    </div>
  );
};
