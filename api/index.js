// Vercel Serverless Function entry point
// Vercel strips the /api prefix when routing to functions in the api/ directory.
// Express expects /api/patients but Vercel sends just /patients.
// This wrapper fixes the path before handing off to Express.

const app = require('../server/index');

module.exports = (req, res) => {
  // Re-add /api prefix if Vercel stripped it
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  return app(req, res);
};
