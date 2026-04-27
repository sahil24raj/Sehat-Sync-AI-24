// Vercel Serverless Function entry point
const app = require('../server/index');

// Export the Express app directly. 
// Vercel handles the mapping of the function to the URL.
module.exports = app;
