import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Star, ExternalLink, Sparkles, TrendingUp, Clock, Users } from 'lucide-react';
import './App.css';

function App() {
  const [interests, setInterests] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:8000/api/recommendations/', {
        interests: interests
      });
      setRecommendations(response.data.recommendations);
      setShowResults(true);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      alert('Error getting recommendations. Make sure the backend is running.');
    }
    
    setLoading(false);
  };

  const suggestedInterests = [
    'Machine Learning', 'Web Development', 'Data Science', 'Python Programming',
    'React', 'AI & Deep Learning', 'Cybersecurity', 'Cloud Computing'
  ];

  return (
    <div className="App">
      <div className="background-gradient"></div>
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <motion.header 
        className="App-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div className="header-icon">
          <Sparkles size={48} />
        </motion.div>
        <h1>Smart Course Recommender</h1>
        <p>Discover your perfect learning path with AI-powered recommendations</p>
      </motion.header>

      <main className="main-content">
        <motion.div 
          className="search-section"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="interest-form">
            <div className="form-group">
              <div className="input-wrapper">
                <Search className="input-icon" size={20} />
                <textarea
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="Tell us what you're passionate about..."
                  rows="3"
                  required
                />
              </div>
              
              <div className="suggestions">
                <span className="suggestions-label">Popular interests:</span>
                <div className="suggestion-tags">
                  {suggestedInterests.map((tag, index) => (
                    <motion.button
                      key={tag}
                      type="button"
                      className="suggestion-tag"
                      onClick={() => setInterests(prev => prev ? `${prev}, ${tag}` : tag)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
            
            <motion.button 
              type="submit" 
              disabled={loading}
              className="submit-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Finding Perfect Matches...
                </>
              ) : (
                <>
                  <TrendingUp size={20} />
                  Get My Recommendations
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <AnimatePresence>
          {showResults && recommendations.length > 0 && (
            <motion.div 
              className="recommendations"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
            >
              <div className="results-header">
                <BookOpen size={32} />
                <h2>Your Personalized Course Recommendations</h2>
                <p>{recommendations.length} courses tailored just for you</p>
              </div>
              
              <div className="course-grid">
                {recommendations.map((course, index) => (
                  <motion.div 
                    key={course.id} 
                    className="course-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  >
                    <div className="card-header">
                      <div className="match-score">
                        <div className="score-circle">
                          <span>{Math.round(course.similarity_score * 100)}%</span>
                        </div>
                        <span className="match-label">Match</span>
                      </div>
                      <div className="category-badge">{course.category}</div>
                    </div>
                    
                    <div className="card-content">
                      <h3>{course.title}</h3>
                      <p className="intro">{course.short_intro}</p>
                      
                      <div className="course-stats">
                        {course.rating && (
                          <div className="stat">
                            <Star size={16} fill="currentColor" />
                            <span>{course.rating}</span>
                          </div>
                        )}
                        <div className="stat">
                          <Users size={16} />
                          <span>Popular</span>
                        </div>
                        <div className="stat">
                          <Clock size={16} />
                          <span>Self-paced</span>
                        </div>
                      </div>
                    </div>
                    
                    <motion.a 
                      href={course.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="course-link"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Explore Course</span>
                      <ExternalLink size={16} />
                    </motion.a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;