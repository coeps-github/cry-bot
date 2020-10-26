import * as fs from 'fs';
import minimist from 'minimist';
import { defaultConfigPath } from './constants';
import { Args, Config } from './model';

export function getConfig(): Config {
  const args = minimist(process.argv.slice(2)) as Args;
  const configPath = args.c || args.config || defaultConfigPath;
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, { encoding: 'utf-8' }));
  } else {
    throw new Error('Please specify config path -c/--c or -config/--config, default: ' + defaultConfigPath);
  }
}
