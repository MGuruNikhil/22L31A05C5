import React, { useState } from 'react'
import { Box, TextField, Button, Grid, Paper, Typography } from '@mui/material'
import axios from 'axios'
import { Log } from '../log'
import { addCreatedShortlink } from '../utils/storage'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

function EntryRow({ value, onChange, index }) {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={6}>
        <TextField fullWidth label={`Original URL #${index + 1}`} value={value.url} onChange={e => onChange(index, 'url', e.target.value)} />
      </Grid>
      <Grid item xs={3}>
        <TextField fullWidth label="Validity (minutes)" value={value.validity ?? ''} onChange={e => onChange(index, 'validity', e.target.value)} />
      </Grid>
      <Grid item xs={3}>
        <TextField fullWidth label="Preferred shortcode" value={value.shortcode ?? ''} onChange={e => onChange(index, 'shortcode', e.target.value)} />
      </Grid>
    </Grid>
  )
}

export default function ShortenPage() {
  const [entries, setEntries] = useState(() => Array.from({ length: 5 }, () => ({ url: '', validity: '', shortcode: '' })))
  const [results, setResults] = useState([])
  const [errors, setErrors] = useState([])

  function handleChange(i, field, val) {
    const next = entries.slice()
    next[i] = { ...next[i], [field]: val }
    setEntries(next)
  }

  function validateEntry(e) {
    const errs = []
    if (!e.url || typeof e.url !== 'string') return ['url missing']
    try { new URL(e.url) } catch (x) { errs.push('invalid url') }
    if (e.validity && !/^[0-9]+$/.test(String(e.validity))) errs.push('validity must be integer minutes')
    if (e.shortcode && !/^[a-zA-Z0-9_-]{3,16}$/.test(e.shortcode)) errs.push('shortcode format invalid')
    return errs
  }

  async function submitAll() {
    const toSubmit = entries.filter(e => e.url && e.url.trim() !== '')
    if (toSubmit.length === 0) return

    const resArr = []
    const errArr = []

    await Log('frontend', 'info', 'page', `Submitting ${toSubmit.length} urls`)

    for (const e of toSubmit) {
      const ve = validateEntry(e)
      if (ve.length) {
        errArr.push({ input: e, errors: ve })
        continue
      }
      try {
        const payload = { url: e.url, validity: e.validity ? Number(e.validity) : undefined, shortcode: e.shortcode || undefined }
  const resp = await axios.post(`${API_BASE}/shorturls`, payload)
  resArr.push({ original: e.url, shortLink: resp.data.shortLink, expiry: resp.data.expiry })
  try { addCreatedShortlink(resp.data.shortLink.split('/').pop(), resp.data.shortLink) } catch (x) {}
        await Log('frontend', 'info', 'page', `Created short link for ${e.url}`)
      } catch (err) {
        const msg = err && err.response && err.response.data && err.response.data.error ? err.response.data.error : (err.message || 'unknown')
        errArr.push({ input: e, errors: [msg] })
        await Log('frontend', 'warn', 'page', `Create failed for ${e.url}: ${msg}`)
      }
    }

    setResults(resArr)
    setErrors(errArr)
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Shorten up to 5 URLs</Typography>
      <Box component="form" noValidate>
        <Grid container spacing={2}>
          {entries.map((e, i) => (
            <Grid item xs={12} key={i}><EntryRow value={e} onChange={handleChange} index={i} /></Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={submitAll}>Create Shortlinks</Button>
        </Box>

        {results.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">Results</Typography>
            {results.map((r, idx) => (
              <Box key={idx} sx={{ my: 1, p: 1, border: '1px solid #eee' }}>
                <div><strong>Original:</strong> {r.original}</div>
                <div><strong>Short:</strong> <a href={r.shortLink}>{r.shortLink}</a></div>
                <div><strong>Expiry:</strong> {r.expiry}</div>
              </Box>
            ))}
          </Box>
        )}

        {errors.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">Errors</Typography>
            {errors.map((er, idx) => (
              <Box key={idx} sx={{ my: 1, p: 1, border: '1px solid #fee' }}>
                <div><strong>Input:</strong> {er.input.url}</div>
                <div><strong>Errors:</strong> {er.errors.join(', ')}</div>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  )
}
