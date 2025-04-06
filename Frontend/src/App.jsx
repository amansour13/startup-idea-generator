import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './index.css';

function App() {
  const [industry, setIndustry] = useState('');
  const [trend, setTrend] = useState('');
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateIdea = async () => {

    function extractIdeaAndPitch(startupIdeaString) {
      // Regex to match Idea and Pitch, allowing various formats
      const ideaMatch = startupIdeaString.match(/Idea:\s*(?:\*\*)?["']?([^"'\*]+)["']?(?:\*\*)?/);
      const pitchMatch = startupIdeaString.match(/Pitch:\s*(?:\*\*)?["']?([^"'\*]+)["']?(?:\*\*)?/);
  
      // Extract idea and pitch
      const idea = ideaMatch ? ideaMatch[1] : "Idea not found";
      const pitch = pitchMatch ? pitchMatch[1] : "Pitch not found";
  
      return { idea, pitch };
  }
  
  

    setLoading(true);
    setIdea(null);
    try {
      const response = await fetch('http://localhost:5000/generate-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, trend })
      });
      const data = await response.json();
      console.log(data);
      setIdea(extractIdeaAndPitch(data.startupIdea));
    } catch (err) {
      alert('Failed to generate idea.');
    }
    setLoading(false);
  };

  return (
    <div className=" bg-amber-950 min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex flex-col items-center justify-center px-4">
      {/* Title Animation */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl font-bold mb-6"
      >
        Startup Idea Generator
      </motion.h1>

      <div className="bg-white text-black rounded-3xl p-8 shadow-2xl w-full max-w-lg space-y-6">
        
        {/* Industry Input Animation */}
        <motion.input
          type="text"
          placeholder="Enter an industry (e.g., Food)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          initial={{ x: '-100vw' }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 25 }}
        />

        {/* Trend Input Animation */}
        <motion.input
          type="text"
          placeholder="Enter a trend (e.g., AI)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={trend}
          onChange={(e) => setTrend(e.target.value)}
          initial={{ x: '100vw' }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 25 }}
        />

        {/* Generate Button Animation */}
        <motion.button
          onClick={generateIdea}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition transform duration-300 cursor-pointer w-full"
          initial={{ y: '100vh' }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 30 }}
        >
          {loading ? 'Generating...' : 'Generate Idea'}
        </motion.button>

        {/* Loading Indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center mt-6"
          >
            <div className="w-8 h-8 border-4 border-t-4 border-indigo-600 border-solid rounded-full animate-spin"></div>
          </motion.div>
        )}

        {/* Idea and Pitch */}
        {idea && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="mt-6 p-6 rounded-xl bg-indigo-100 text-indigo-800 shadow-lg"
          >
            <div className="flex flex-col space-y-4">
              <div className="p-4 bg-indigo-300 rounded-lg shadow-xl">
                <h3 className="text-xl font-semibold">Idea</h3>
                <p className="text-lg">{idea.idea}</p>
              </div>
              <div className="p-4 bg-indigo-300 rounded-lg shadow-xl">
                <h3 className="text-xl font-semibold">Pitch</h3>
                <p className="text-lg">{idea.pitch}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;
