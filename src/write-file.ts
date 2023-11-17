import * as fs from 'fs';
import * as debugLib from 'debug';
import { getLoggingPath } from './lib';
const debug = debugLib('vulnmap:write-file');

export async function writeFile(
  name: string,
  content: JSON,
): Promise<string> {
  const ROOT_DIR = getLoggingPath();
  const filename = `${ROOT_DIR}/${name}`;

  try {
    await fs.writeFileSync(filename, JSON.stringify(content));
    return filename;
  } catch (error: any) {
    debug(error);
    throw new Error(`Failed to write to file: ${filename}`);
  }
}
