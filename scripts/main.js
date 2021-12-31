const Path = require('path');

require('ts-node').register({
  project: Path.join(__dirname, '..', 'tsconfig.main.json')
});
require('../src/main');
