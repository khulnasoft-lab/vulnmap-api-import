import { exec } from 'child_process';
import * as path from 'path';
import { deleteFiles } from '../delete-files';
import { generateLogsPaths } from '../generate-log-file-names';
import { deleteTestProjects } from '../delete-test-projects';
import type { Project } from '../../src/lib/types';
const main = './dist/index.js'.replace(/\//g, path.sep);

const ORG_ID = process.env.TEST_ORG_ID as string;

describe('`vulnmap-api-import import`', () => {
  let logs: string[] = [];
  const discoveredProjects: Project[] = [];
  afterAll(async () => {
    await deleteTestProjects(ORG_ID, discoveredProjects);
  });
  afterEach(async () => {
    deleteFiles(logs);
  });
  it('Import is the default command when no command passed in', (done) => {
    const testRoot = __dirname + '/fixtures/single-project';
    const logFiles = generateLogsPaths(testRoot, ORG_ID);
    logs = Object.values(logFiles);

    const importFile = path.resolve(testRoot + '/import-projects-single.json');
    const logPath = path.resolve(testRoot);
    exec(
      `node ${main}`,
      {
        env: {
          PATH: process.env.PATH,
          VULNMAP_TOKEN: process.env.VULNMAP_TOKEN_TEST,
          VULNMAP_API: process.env.VULNMAP_API_TEST,
          VULNMAP_IMPORT_PATH: importFile,
          VULNMAP_LOG_PATH: logPath,
          ORG_ID: process.env.TEST_ORG_ID,
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          throw err;
        }
        expect(stderr).toEqual('');
        expect(err).toBeNull();
        expect(stdout.trim()).toMatch(`project(s)
Processed 1 out of a total of 1 targets
Check the logs for any failures located at:`);
      },
    ).on('exit', (code) => {
      expect(code).toEqual(0);
      done();
    });
  }, 240000);
  it('`import` command triggers the API import', (done) => {
    const testRoot = __dirname + '/fixtures';
    const logFiles = generateLogsPaths(testRoot, ORG_ID);
    logs = Object.values(logFiles);

    const importFile = path.resolve(testRoot + '/import-projects.json');
    const logPath = path.resolve(testRoot);

    exec(
      `node ${main} import`,
      {
        env: {
          PATH: process.env.PATH,
          VULNMAP_TOKEN: process.env.VULNMAP_TOKEN_TEST,
          VULNMAP_API: process.env.VULNMAP_API_TEST,
          VULNMAP_IMPORT_PATH: importFile,
          VULNMAP_LOG_PATH: logPath,
          ORG_ID: process.env.TEST_ORG_ID,
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          throw err;
        }
        expect(err).toBeNull();
        expect(stderr).toEqual('');
        expect(stdout.trim()).toMatch(`project(s)
Processed 1 out of a total of 1 targets
Check the logs for any failures located at:`);
      },
    ).on('exit', (code) => {
      expect(code).toEqual(0);
      done();
    });
  }, 500000);

  it('`import` command fails when missing import file', (done) => {
    const testRoot = __dirname + '/fixtures';
    const logFiles = generateLogsPaths(testRoot, ORG_ID);
    logs = Object.values(logFiles);
    const logPath = path.resolve(testRoot);

    exec(
      `node ${main} import --file=non-existent.json`,
      {
        env: {
          PATH: process.env.PATH,
          VULNMAP_TOKEN: process.env.VULNMAP_TOKEN_TEST,
          VULNMAP_API: process.env.VULNMAP_API_TEST,
          VULNMAP_LOG_PATH: logPath,
          ORG_ID: process.env.TEST_ORG_ID,
        },
      },
      (err, stdout, stderr) => {
        expect(err!.message).toMatch(
          'ERROR! Failed to kick off import with error: Could not find the import file, locations tried:',
        );
        expect(stderr).toMatch(
          'ERROR! Failed to kick off import with error: Could not find the import file, locations tried:',
        );
        expect(stdout).toEqual('');
      },
    ).on('exit', (code) => {
      expect(code).toEqual(1);
      done();
    });
  }, 500000);
});
