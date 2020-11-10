import { File, FileConfig } from './model';
import * as fs from 'fs';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import * as readline from 'readline';
import * as path from 'path';

export function getFile(config?: FileConfig): File {
  const dir = config?.dir;
  const getFilePath = (file: string) => dir ? path.join(dir, file) : file;
  const createIfNotExists = (filePath: string) => {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '', { encoding: 'utf-8' });
    }
  };
  return {
    readLines: <T>(file: string) => {
      const filePath = getFilePath(file);
      createIfNotExists(filePath);
      return new Observable<T>(observer => {
        const readInterface = readline.createInterface({
          input: fs.createReadStream(filePath, { encoding: 'utf-8' }),
          crlfDelay: Infinity
        });
        readInterface.on('line', line => observer.next(JSON.parse(line)));
        readInterface.on('close', () => observer.complete());
        return () => readInterface.close();
      }).pipe(
        share()
      );
    },
    appendLine: <T>(file: string, content: T) => {
      const filePath = getFilePath(file);
      createIfNotExists(filePath);
      fs.appendFileSync(filePath, `${JSON.stringify(content)}\n`, { encoding: 'utf-8' });
    }
  };
}
