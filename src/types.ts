export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

export interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

export interface GitHubBlobResponse {
  sha: string;
  node_id: string;
  size: number;
  url: string;
  content: string;
  encoding: 'base64' | 'utf-8';
}

export interface MdxFile {
  path: string;
  sha: string;
  content: string;
  relativePath: string;
}

export interface CompiledFile {
  path: string;
  content: string;
  relativePath: string;
}

export interface ConversionResult {
  success: boolean;
  path: string;
  error?: string;
  compiledFile?: CompiledFile;
}

export interface CliOptions {
  outDir: string;
  batchSize?: number;
  verbose?: boolean;
  help?: boolean;
}

export interface ProgressInfo {
  current: number;
  total: number;
  phase: 'discovery' | 'download' | 'conversion';
  message?: string;
}