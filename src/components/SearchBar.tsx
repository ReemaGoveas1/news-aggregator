import React from 'react';
import { Filters } from '../types';

interface SearchBarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onFilter: () => void;
}

export default function SearchBar({ filters, setFilters, onFilter }: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <input
        type="text"
        name="keyword"
        value={filters.keyword}
        onChange={handleChange}
        placeholder="Search keyword"
      />

      <select name="category" value={filters.category} onChange={handleChange}>
        <option value="all">All Categories</option>
        <option value="general">General</option>
        <option value="business">Business</option>
        <option value="technology">Technology</option>
        <option value="sports">Sports</option>
      </select>

      <select name="source" value={filters.source} onChange={handleChange}>
        <option value="all">All Sources</option>
        <option value="newsapi">NewsAPI</option>
        <option value="guardian">Guardian</option>
        <option value="nytimes">NYTimes</option>
      </select>

      <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />

      <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />

      <button type="submit">Filter</button>
    </form>
  );
};

