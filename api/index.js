const app = require('../server/index');

// Vercel serverless functions handle the path mapping.
// We ensure the app is exported properly.
module.exports = (req, res) => {
  // If request is OPTIONS, handle preflight immediately
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }
  return app(req, res);
};
