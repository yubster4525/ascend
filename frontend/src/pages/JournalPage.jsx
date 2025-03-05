import React, { useState, useEffect } from 'react';
import '../styles/JournalPage.css';

const JournalPage = () => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '2025-03-04',
      title: 'Morning Reflection',
      content: 'Today I woke up feeling energized after a good night\'s sleep. I completed my morning workout and meditation. I\'m looking forward to making progress on my project at work.',
      mood: 'positive',
      tags: ['morning', 'workout', 'goals']
    },
    {
      id: 2,
      date: '2025-03-03',
      title: 'Evening Thoughts',
      content: 'Today was quite productive. I managed to complete most of my planned tasks and had a good conversation with my team. I need to work on managing my time better tomorrow.',
      mood: 'neutral',
      tags: ['work', 'productivity', 'reflection']
    },
    {
      id: 3,
      date: '2025-03-01',
      title: 'Weekend Plans',
      content: 'Making plans for the weekend. I want to go hiking and possibly meet up with friends. I also need to finish reading that book I started last week.',
      mood: 'positive',
      tags: ['weekend', 'plans', 'social']
    }
  ]);

  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'neutral',
    tags: ''
  });

  const [journalPrompts, setJournalPrompts] = useState([
    "What are three things you're grateful for today?",
    "What's one challenge you faced today and how did you handle it?",
    "What's something you're looking forward to tomorrow?",
    "Describe one achievement, however small, from today.",
    "What's one thing you could have done better today?",
    "What did you learn today?",
    "How did you take care of yourself today?",
    "What made you smile today?"
  ]);

  const [activePrompt, setActivePrompt] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEntries, setFilteredEntries] = useState(entries);

  useEffect(() => {
    // Filter entries based on search term
    if (searchTerm.trim() === '') {
      setFilteredEntries(entries);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = entries.filter(entry => 
        entry.title.toLowerCase().includes(lowercasedSearch) || 
        entry.content.toLowerCase().includes(lowercasedSearch) ||
        entry.tags.some(tag => tag.toLowerCase().includes(lowercasedSearch))
      );
      setFilteredEntries(filtered);
    }
  }, [searchTerm, entries]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry({
      ...newEntry,
      [name]: value
    });
  };

  const handleRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * journalPrompts.length);
    setActivePrompt(journalPrompts[randomIndex]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;

    const tagsArray = newEntry.tags
      ? newEntry.tags.split(',').map(tag => tag.trim())
      : [];

    const entryToAdd = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      title: newEntry.title,
      content: newEntry.content,
      mood: newEntry.mood,
      tags: tagsArray
    };

    setEntries([entryToAdd, ...entries]);
    setNewEntry({
      title: '',
      content: '',
      mood: 'neutral',
      tags: ''
    });
    setActivePrompt('');
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getMoodEmoji = (mood) => {
    switch(mood) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      default: return '😐';
    }
  };

  return (
    <div className="journal-container">
      <h1>Personal Journal</h1>
      
      <div className="journal-grid">
        <div className="journal-entries">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="entries-list">
            {filteredEntries.length > 0 ? (
              filteredEntries.map(entry => (
                <div key={entry.id} className="entry-card card">
                  <div className="entry-header">
                    <h3>{entry.title}</h3>
                    <div className="entry-metadata">
                      <span className="entry-date">{formatDate(entry.date)}</span>
                      <span className="entry-mood">{getMoodEmoji(entry.mood)}</span>
                    </div>
                  </div>
                  <div className="entry-content">
                    {entry.content}
                  </div>
                  <div className="entry-tags">
                    {entry.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-entries">
                <p>No journal entries found. Start writing to see your entries here!</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="journal-form-container">
          <div className="journal-form card">
            <h3>New Entry</h3>
            
            <div className="prompt-section">
              <button onClick={handleRandomPrompt} className="prompt-btn">
                Get a Writing Prompt
              </button>
              {activePrompt && (
                <div className="prompt-display">
                  {activePrompt}
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={newEntry.title}
                  onChange={handleInputChange}
                  placeholder="Give your entry a title"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Content</label>
                <textarea
                  name="content"
                  value={newEntry.content}
                  onChange={handleInputChange}
                  placeholder="Write your thoughts..."
                  rows="8"
                  required
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Mood</label>
                  <select name="mood" value={newEntry.mood} onChange={handleInputChange}>
                    <option value="positive">Positive 😊</option>
                    <option value="neutral">Neutral 😐</option>
                    <option value="negative">Negative 😞</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={newEntry.tags}
                    onChange={handleInputChange}
                    placeholder="e.g. work, reflection, goals"
                  />
                </div>
              </div>
              
              <button type="submit" className="submit-btn">Save Entry</button>
            </form>
          </div>
          
          <div className="journal-insights card">
            <h3>Journal Insights</h3>
            <div className="insights-content">
              <p>You've written <strong>{entries.length}</strong> journal entries.</p>
              <p>Your most common mood is <strong>Positive</strong>.</p>
              <p>Most active journaling days: <strong>Monday</strong> and <strong>Thursday</strong>.</p>
              <p>Frequent themes: <strong>goals</strong>, <strong>productivity</strong>, and <strong>reflection</strong>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;