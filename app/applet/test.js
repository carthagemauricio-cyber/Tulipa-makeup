const { execSync } = require('child_process');
try {
  console.log(execSync('git status').toString());
} catch (e) {
  console.log('error', e.message);
}
