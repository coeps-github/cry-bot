import { Observable } from 'rxjs';

export interface FileConfig {
  readonly dir?: string;
}

export interface File {
  readonly readLines: <T>(file: string) => Observable<T>;
  readonly appendLine: <T>(file: string, content: T) => void;
}
