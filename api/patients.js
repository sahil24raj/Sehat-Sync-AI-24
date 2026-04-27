const app = require('../server/index');
module.exports = (req, res) => {
  // This ensures that the Express app handles the request correctly in a serverless environment
  return app(req, res);
};
