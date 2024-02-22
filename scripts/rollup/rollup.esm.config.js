import pkg from '../../package.json';

import { createRollupConfig } from './createRollupConfig';

const options = [
  { name: 'client', format: 'esm', input: pkg['source:client'] },
  { name: 'server', format: 'esm', input: pkg['source:server'] },
];

export default options.map((option) => createRollupConfig(option));
