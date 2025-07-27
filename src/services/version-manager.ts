import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export class VersionManager {
  private static readonly DATA_DIR = join(process.cwd(), 'data');
  private static readonly DIST_DIR = process.cwd();
  
  /**
   * Get the directory for storing/reading hnswlib files
   * In development: ./data/
   * In production (bundled): ./dist/ (current working directory)
   */
  static getStorageDir(): string {
    // Check if we're running from source (data directory exists)
    if (existsSync(VersionManager.DATA_DIR)) {
      return VersionManager.DATA_DIR;
    }
    // Otherwise assume we're running from bundled dist
    return VersionManager.DIST_DIR;
  }
  
  /**
   * Get the path for a version's HNSWlib database
   */
  static getVersionDbPath(version: string): string {
    return join(VersionManager.getStorageDir(), version, 'vector');
  }
  
  /**
   * Get the path for a version's MD cache directory
   */
  static getVersionMdPath(version: string): string {
    return join(VersionManager.getStorageDir(), version, 'md');
  }
  
  /**
   * Check if a version is available locally
   */
  static isVersionAvailable(version: string): boolean {
    const dbPath = VersionManager.getVersionDbPath(version);
    return existsSync(dbPath);
  }
  
  /**
   * Get all available versions locally
   */
  static async getAvailableVersions(): Promise<string[]> {
    try {
      const storageDir = VersionManager.getStorageDir();
      if (!existsSync(storageDir)) {
        return [];
      }
      
      const files = await readdir(storageDir);
      // Get directories that contain vector subdirectory
      const versions: string[] = [];
      for (const dir of files) {
        const vectorPath = join(storageDir, dir, 'vector');
        if (existsSync(vectorPath)) {
          versions.push(dir);
        }
      }
      return versions
        .sort((a, b) => {
          // Sort versions with latest first, then numerical order
          if (a === 'latest') return -1;
          if (b === 'latest') return 1;
          
          const aNum = parseInt(a.replace('v', ''));
          const bNum = parseInt(b.replace('v', ''));
          return bNum - aNum; // Descending order
        });
    } catch (error) {
      console.warn('Warning: Could not read available versions:', error);
      return [];
    }
  }
  
  /**
   * Generate error message for missing version
   */
  static async getMissingVersionError(requestedVersion: string): Promise<string> {
    const available = await VersionManager.getAvailableVersions();
    
    let message = `Expo SDK ${requestedVersion} documentation is not available in this MCP server.\n\n`;
    
    if (available.length > 0) {
      message += `Available versions: ${available.join(', ')}\n\n`;
      message += `Please use one of the available versions or check for an updated version of this MCP server.`;
    } else {
      message += 'No documentation versions are currently bundled with this MCP server.\n';
      message += 'Please check for an updated version of this MCP server.';
    }
    
    return message;
  }
  
  /**
   * Validate version format
   */
  static isValidVersionFormat(version: string): boolean {
    return /^(v\d+|latest)$/.test(version);
  }
  
  /**
   * Check if MD cache exists for a version
   */
  static isMdCacheAvailable(version: string): boolean {
    const mdPath = VersionManager.getVersionMdPath(version);
    return existsSync(mdPath);
  }
}