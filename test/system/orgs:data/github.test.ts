import { exec } from 'child_process';
import * as path from 'path';
import { deleteFiles } from '../../delete-files';
const main = './dist/index.js'.replace(/\//g, path.sep);

describe('General `vulnmap-api-import orgs:data <...>`', () => {
  const OLD_ENV = process.env;
  afterAll(() => {
    process.env = { ...OLD_ENV };
  });
  it('Generates orgs data as expected', (done) => {
    const groupId = 'hello';
    exec(
      `node ${main} orgs:data --source=github --groupId=${groupId}`,
      {
        env: {
          PATH: process.env.PATH,
          GITHUB_TOKEN: process.env.GITHUB_TOKEN,
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
          'Found 3 organization(s). Written the data to file: group-hello-github-com-orgs.json',
        );
        deleteFiles([
          path.resolve(__dirname, `group-${groupId}-github-com-orgs.json`),
        ]);
      },
    ).on('exit', (code) => {
      expect(code).toEqual(0);
      done();
    });
  }, 20000);
});
