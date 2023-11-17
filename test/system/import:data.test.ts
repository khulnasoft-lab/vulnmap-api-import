import { exec } from 'child_process';

import { sep, join } from 'path';
import { deleteFiles } from '../delete-files';
const main = './dist/index.js'.replace(/\//g, sep);

describe('`vulnmap-api-import import:data <...>`', () => {
  const OLD_ENV = process.env;
  afterAll(() => {
    process.env = { ...OLD_ENV };
  });
  it('Shows help text as expected', (done) => {
    exec(
      `node ${main} import:data help`,
      {
        env: {
          PATH: process.env.PATH,
          GITHUB_TOKEN: process.env.GH_TOKEN,
          VULNMAP_LOG_PATH: __dirname,
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          throw err;
        }
        expect(err).toBeNull();
        expect(stderr).toEqual('');
        expect(stdout.trim()).toMatchInlineSnapshot(`
          "index.js import:data

          Generate data required for targets to be imported via API to create Vulnmap
          projects.


          Options:
            --version    Show version number                                     [boolean]
            --help       Show help                                               [boolean]
            --orgsData   Path to organizations data file generated with \\"orgs:create\\"
                         command                                                [required]
            --source     The source of the targets to be imported e.g. Github, Github
                         Enterprise, Gitlab, Azure. This will be used to make an API call
                         to list all available entities per org
              [required] [choices: \\"github\\", \\"github-enterprise\\", \\"gitlab\\", \\"azure-repos\\",
                                \\"bitbucket-server\\", \\"bitbucket-cloud\\"] [default: \\"github\\"]
            --sourceUrl  Custom base url for the source API that can list organizations
                         (e.g. Github Enterprise url)"
        `);
      },
    ).on('exit', (code) => {
      expect(code).toEqual(0);
      done();
    });
  });

  it('Generates repo data as expected for Gitlab', (done) => {
    const orgDataFile = 'test/system/fixtures/org-data/orgs.json';
    exec(
      `node ${main} import:data --source=gitlab --sourceUrl=${process.env.TEST_GITLAB_BASE_URL} --orgsData=${orgDataFile}`,
      {
        env: {
          PATH: process.env.PATH,
          GITLAB_TOKEN: process.env.TEST_GITLAB_TOKEN,
          VULNMAP_LOG_PATH: __dirname,
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          throw err;
        }
        expect(err).toBeNull();
        expect(stderr).toEqual('');
        expect(stdout.trim()).toMatch('Written the data to file');
        deleteFiles([join(__dirname, 'gitlab-import-targets.json')]);
      },
    ).on('exit', (code) => {
      expect(code).toEqual(0);
      done();
    });
  }, 200000);
  it('Generates repo data as expected for Bitbucket Server', (done) => {
    const orgDataFile =
      'test/system/fixtures/org-data/bitbucket-server-orgs.json';
    exec(
      `node ${main} import:data --source=bitbucket-server --sourceUrl=${process.env.BBS_SOURCE_URL} --orgsData=${orgDataFile}`,
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
        expect(err).toBeNull();
        expect(stderr).toEqual('');
        expect(stdout.trim()).toMatch('Written the data to file');
        deleteFiles([join(__dirname, 'bitbucket-server-import-targets.json')]);
      },
    ).on('exit', (code) => {
      expect(code).toEqual(0);
      done();
    });
  }, 50000);
  it('Generates repo data as expected for Bitbucket Cloud', (done) => {
    const orgDataFile =
      'test/system/fixtures/org-data/bitbucket-cloud-orgs.json';
    exec(
      `node ${main} import:data --source=bitbucket-cloud --orgsData=${orgDataFile}`,
      {
        env: {
          PATH: process.env.PATH,
          BITBUCKET_CLOUD_USERNAME: process.env.BBC_USERNAME,
          BITBUCKET_CLOUD_PASSWORD: process.env.BBC_PASSWORD,
          VULNMAP_LOG_PATH: __dirname,
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          throw err;
        }
        expect(err).toBeNull();
        expect(stderr).toEqual('');
        expect(stdout.trim()).toMatch('Written the data to file');
        deleteFiles([join(__dirname, 'bitbucket-cloud-import-targets.json')]);
      },
    ).on('exit', (code) => {
      expect(code).toEqual(0);
      done();
    });
  }, 50000);
  it('Shows error when missing loading non existent file', (done) => {
    exec(
      `node ${main} import:data --source=bitbucket-cloud --orgsData=non-existent.json`,
      {
        env: {
          PATH: process.env.PATH,
          BITBUCKET_CLOUD_USERNAME: process.env.BBC_USERNAME,
          BITBUCKET_CLOUD_PASSWORD: process.env.BBC_PASSWORD,
          VULNMAP_LOG_PATH: __dirname,
        },
      },
      (err, stdout, stderr) => {
        expect(err!.message).toMatch(`File can not be found at location`);
        expect(stderr).toMatch(`File can not be found at location`);
        expect(stdout).toEqual('');
      },
    ).on('exit', (code) => {
      expect(code).toEqual(1);
      done();
    });
  });
});
