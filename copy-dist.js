const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'client', 'dist');
const dest = __dirname;

try {
  fs.cpSync(src, dest, { recursive: true });
  console.log('Successfully copied client/dist contents to root.');
} catch (err) {
  console.error('Error copying files:', err);
  process.exit(1);
}
