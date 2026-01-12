import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PhotoUploadScreen from './screens/PhotoUploadScreen'
import AnalyzingScreen from './screens/AnalyzingScreen'
import ResultsScreen from './screens/ResultsScreen'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<PhotoUploadScreen />} />
          <Route path="/analyzing" element={<AnalyzingScreen />} />
          <Route path="/results" element={<ResultsScreen />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App


