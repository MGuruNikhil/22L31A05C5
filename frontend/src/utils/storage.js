export function addCreatedShortlink(shortcode, shortLink) {
  try {
    const cur = JSON.parse(localStorage.getItem('created_shortlinks') || '[]')
    cur.unshift({ shortcode, shortLink, createdAt: new Date().toISOString() })
    localStorage.setItem('created_shortlinks', JSON.stringify(cur.slice(0, 50)))
  } catch (e) {}
}
