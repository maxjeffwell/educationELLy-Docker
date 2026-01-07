const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React app build directory with cache control
app.use(express.static(path.join(__dirname, 'build'), {
  maxAge: 0, // Don't cache in production during active development
  etag: false,
  setHeaders: (res, filePath) => {
    // Aggressive cache busting for JS and CSS files
    if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// API routes would go here
// app.use('/api', require('./routes/api'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// The "catchall" handler: send back React's index.html file for any non-static routes
// Set headers to prevent Cloudflare from caching the HTML
app.use((req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
