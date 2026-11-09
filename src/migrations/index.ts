import * as migration_20261106_062420_initial from './20261106_062420_initial';

export const migrations = [
  {
    up: migration_20261106_062420_initial.up,
    down: migration_20261106_062420_initial.down,
    name: '20261106_062420_initial'
  },
];
