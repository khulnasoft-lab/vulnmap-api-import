import { exec } from 'child_process';
import * as path from 'path';
import { deleteFiles } from '../../delete-files';
const main = './dist/index.js'.replace(/\//g, path.sep);

describe('General `vulnmap-api-import orgs:data <...>`', () => {
  const OLD_ENV = process.env;
  afterAll(() => {
    process.env = { ...OLD_ENV };
  });
  it('Generates orgs data as expected for Bitbucket Server', (done) => {
    const groupId = 'hello';
    exec(
      `node ${main} orgs:data --source=bitbucket-server --groupId=${groupId} --sourceUrl=${process.env.BBS_SOURCE_URL}`,
      {
        env: {
          PATH: process.env.PATH,
          BITBUCKET_SERVER_TOKEN: process.env.BBS_TOKEN,
          VULNMAP_LOG_PATH: __dirname,
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          throw err;
        }
        expect(stderr).toEqual('');
        expect(err).toBeNull();
        expect(stdout).toMatch(
          'Found 3 project(s). Written the data to file: group-hello-bitbucket-server-orgs.json',
        );
        deleteFiles([
          path.resolve(
            __dirname,
            `group-${groupId}-bitbucket-server-orgs.json`,
          ),
        ]);
      },
    ).on('exit', (code) => {
      expect(code).toEqual(0);
      done();
    });
  }, 20000);
});
