import React, { useState } from 'react'
import { signIn, signUp, confirmSignUp } from '../services/auth'
import './AuthScreen.css'

export default function AuthScreen() {
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await signIn(email, password)
      window.location.href = '/'
    } catch (err) {
      setMessage(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await signUp(email, password)
      setMode('verify')
      setMessage('Verification code sent to your email.')
    } catch (err) {
      setMessage(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await confirmSignUp(email, code)
      setMode('login')
      setMessage('Verified! You can login now.')
    } catch (err) {
      setMessage(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>BeautyApp</h1>
          <p>Personalized beauty experience</p>
        </div>

        <div className="auth-tabs">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
          <button
            className={mode === 'verify' ? 'active' : ''}
            onClick={() => setMode('verify')}
          >
            Verify
          </button>
        </div>

        {message && <div className="auth-message">{message}</div>}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button disabled={loading}>{loading ? '...' : 'Login'}</button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="auth-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button disabled={loading}>{loading ? '...' : 'Create Account'}</button>
          </form>
        )}

        {mode === 'verify' && (
          <form onSubmit={handleVerify} className="auth-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button disabled={loading}>{loading ? '...' : 'Verify'}</button>
          </form>
        )}
      </div>
    </div>
  )
}
