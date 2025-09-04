import React, { useEffect, useState } from 'react'
import { Paper, Typography, Box, Button } from '@mui/material'
import axios from 'axios'
import { Log } from '../log'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export default function StatsPage() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  // Since backend stores links in-memory and doesn't expose a list endpoint,
  // infer shortcodes by querying a small set of candidates from recently generated results stored in LocalStorage.

  useEffect(() => {
    async function load() {
      setLoading(true)
      await Log('frontend', 'info', 'page', 'Loading stats page')
      try {
        const stored = JSON.parse(localStorage.getItem('created_shortlinks') || '[]')
        const res = []
        for (const s of stored) {
          try {
            const r = await axios.get(`${API_BASE}/shorturls/${s.shortcode}`)
            res.push(r.data)
          } catch (e) {
            // ignore missing
          }
        }
        setList(res)
        await Log('frontend', 'info', 'page', `Loaded ${res.length} stats`)
      } catch (e) {
        await Log('frontend', 'warn', 'page', 'Failed to load stats')
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Shortlink Statistics</Typography>
      {loading && <div>Loading...</div>}
      {!loading && list.length === 0 && <div>No shortlinks found in this session.</div>}
      {!loading && list.map((s, idx) => (
        <Box key={idx} sx={{ my: 2, p: 2, border: '1px solid #eee' }}>
          <div><strong>Shortcode:</strong> {s.shortcode}</div>
          <div><strong>Original:</strong> {s.originalUrl}</div>
          <div><strong>Created:</strong> {s.createdAt}</div>
          <div><strong>Expiry:</strong> {s.expiry}</div>
          <div><strong>Clicks:</strong> {s.clickCount}</div>
          {s.clicks && s.clicks.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2">Click details</Typography>
              {s.clicks.map((c, i) => (
                <Box key={i} sx={{ p: 1, borderTop: '1px solid #f0f0f0' }}>
                  <div><strong>Time:</strong> {c.timestamp}</div>
                  <div><strong>Referrer:</strong> {c.referrer || '—'}</div>
                  <div><strong>IP:</strong> {c.ip || '—'}</div>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Paper>
  )
}
