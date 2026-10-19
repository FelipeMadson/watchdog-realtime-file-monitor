export type FileChangeType = 'created' | 'modified' | 'deleted';

export interface FileChangeRecord {
  path: string;
  type: FileChangeType;
  timestamp: number;
}
