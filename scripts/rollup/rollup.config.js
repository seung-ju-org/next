import pkg from '../../package.json';

import { createRollupConfig } from './createRollupConfig';

const options = [
  {
    name: 'client',
    format: 'cjs',
    input: pkg['source:client'],
  },
  {
    name: 'client',
    format: 'esm',
    input: pkg['source:client'],
  },
  {
    name: 'client',
    format: 'umd',
    input: pkg['source:client'],
  },
  {
    name: 'server',
    format: 'cjs',
    input: pkg['source:server'],
  },
  {
    name: 'server',
    format: 'esm',
    input: pkg['source:server'],
  },
  {
    name: 'server',
    format: 'umd',
    input: pkg['source:server'],
  },
];

export default options.map((option) => createRollupConfig(option));
