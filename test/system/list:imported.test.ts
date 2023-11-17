import { exec } from 'child_process';
import * as path from 'path';
import { sep } from 'path';
import { IMPORT_LOG_NAME } from '../../src/common';
import { deleteFiles } from '../delete-files';
const main = './dist/index.js'.replace(/\//g, sep);

describe('`vulnmap-api-import list:imported <...>`', () => {
  const OLD_ENV = process.env;
  const GROUP_ID = process.env.TEST_GROUP_ID as string;
  const ORG_ID = process.env.TEST_ORG_ID as string;

  afterAll(() => {
    process.env = { ...OLD_ENV };
  });
  it('Shows help text as expected', (done) => {
    exec(`node ${main} list:imported help`, (err, stdout) => {
      if (err) {
        throw err;
      }
      expect(err).toBeNull();
      expect(stdout).toMatchInlineSnapshot(`
        "index.js list:imported

        List all targets imported in Vulnmap for a given group & source type. An analysis
        is performed on all current organizations and their projects to generate this.
        The generated file can be used to skip previously imported targets when running
        the \`import\` command

        Options:
          --version          Show version number                               [boolean]
          --help             Show help                                         [boolean]
          --groupId          Public id of the group in Vulnmap (available on group
                             settings)
          --orgId            Public id of the organization in Vulnmap (available in
                             organization settings)
          --integrationType  The configured integration type (source of the projects in
                             Vulnmap e.g. Github, Github Enterprise.). This will be used to
                             pick the correct integrationID from each org in Vulnmap E.g.
                             --integrationType=github,
                             --integrationType=github-enterprise
           [required] [choices: \\"github\\", \\"github-enterprise\\", \\"bitbucket-cloud\\", \\"gcr\\",
                    \\"docker-hub\\", \\"gitlab\\", \\"azure-repos\\", \\"bitbucket-server\\"] [default:
          [\\"github\\",\\"github-enterprise\\",\\"bitbucket-cloud\\",\\"gcr\\",\\"docker-hub\\",\\"gitlab\\",\\"a
                                                        zure-repos\\",\\"bitbucket-server\\"]]
        "
      `);
    }).on('exit', (code) => {
      expect(code).toEqual(0);
      done();
    });
  }, 20000);

  it('Generates Vulnmap imported targets data as expected for github + Group', (done) => {
    exec(
      `node ${main} list:imported --integrationType=github --groupId=${GROUP_ID}`,
      {
        env: {
          PATH: process.env.PATH,
          VULNMAP_TOKEN: process.env.VULNMAP_TOKEN_TEST,
          VULNMAP_API: process.env.VULNMAP_API_TEST,
          VULNMAP_LOG_PATH: __dirname,
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          throw err;
        }
        expect(stderr).toMatch('No projects in org');
        expect(err).toBeNull();
        expect(stdout.trim()).toMatch(
          `repo(s). Written the data to file: ${path.resolve(
            __dirname,
            'imported-targets.log',
          )}`,
        );
        expect(stdout.trim()).toContain(
          'Extracted 2 unique targets from 2 projects from org 74e2f385-a54f-491e-9034-76c53e72927a',
        );
        deleteFiles([path.resolve(__dirname, IMPORT_LOG_NAME)]);
      },
    ).on('exit', (code) => {
      expect(code).toEqual(0);
      done();
    });
  }, 20000);

  it('Generates Vulnmap imported targets data as expected for all integrations by default for an Org', (done) => {
    exec(
      `node ${main} list:imported --orgId=${ORG_ID}`,
      {
        env: {
          PATH: process.env.PATH,
          VULNMAP_TOKEN: process.env.VULNMAP_TOKEN_TEST,
          VULNMAP_API: process.env.VULNMAP_API_TEST,
          VULNMAP_LOG_PATH: __dirname,
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          throw err;
        }
        expect(stderr).toEqual('');
        expect(err).toBeNull();
        expect(stdout.trim()).toMatch(
          `target(s). Written the data to file: ${path.resolve(
            __dirname,
            'imported-targets.log',
          )}`,
        );
        deleteFiles([path.resolve(__dirname, IMPORT_LOG_NAME)]);
      },
    ).on('exit', (code) => {
      expect(code).toEqual(0);
      done();
    });
  }, 10000);

  it('Generates Vulnmap imported targets data as expected for multiple integrations for an Org', (done) => {
    exec(
      `node ${main} list:imported --integrationType=github --integrationType=github-enterprise --orgId=${ORG_ID}`,
      {
        env: {
          PATH: process.env.PATH,
          VULNMAP_TOKEN: process.env.VULNMAP_TOKEN_TEST,
          VULNMAP_API: process.env.VULNMAP_API_TEST,
          VULNMAP_LOG_PATH: __dirname,
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          throw err;
        }
        expect(stderr).toEqual('');
        expect(err).toBeNull();
        expect(stdout.trim()).toMatch(
          `target(s). Written the data to file: ${path.resolve(
            __dirname,
            'imported-targets.log',
          )}`,
        );
        deleteFiles([path.resolve(__dirname, IMPORT_LOG_NAME)]);
      },
    ).on('exit', (code) => {
      expect(code).toEqual(0);
      done();
    });
  }, 10000);

  it('Generates Vulnmap imported targets data as expected for an Org', (done) => {
    exec(
      `node ${main} list:imported --integrationType=github --orgId=${ORG_ID}`,
      {
        env: {
          PATH: process.env.PATH,
          VULNMAP_TOKEN: process.env.VULNMAP_TOKEN_TEST,
          VULNMAP_API: process.env.VULNMAP_API_TEST,
          VULNMAP_LOG_PATH: __dirname,
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          throw err;
        }
        expect(stderr).toEqual('');
        expect(err).toBeNull();
        expect(stdout.trim()).toMatch(
          `repo(s). Written the data to file: ${path.resolve(
            __dirname,
            'imported-targets.log',
          )}`,
        );
        deleteFiles([path.resolve(__dirname, IMPORT_LOG_NAME)]);
      },
    ).on('exit', (code) => {
      expect(code).toEqual(0);
      done();
    });
  }, 10000);
  it('Shows error when missing groupId & orgId', (done) => {
    exec(
      `node ${main} list:imported --integrationType=github`,
      {
        env: {
          PATH: process.env.PATH,
          VULNMAP_TOKEN: process.env.VULNMAP_TOKEN_TEST,
          VULNMAP_API: process.env.VULNMAP_API_TEST,
          VULNMAP_LOG_PATH: __dirname,
        },
      },
      (err, stdout, stderr) => {
        expect(stderr).toMatchInlineSnapshot(`
          "ERROR! Failed to list imported targets in Vulnmap. Try running with \`DEBUG=vulnmap* <command> for more info\`.
          ERROR: Missing required parameters: orgId or groupId must be provided.
          "
        `);
        expect(err).toMatchInlineSnapshot(`
          [Error: Command failed: node ./dist/index.js list:imported --integrationType=github
          ERROR! Failed to list imported targets in Vulnmap. Try running with \`DEBUG=vulnmap* <command> for more info\`.
          ERROR: Missing required parameters: orgId or groupId must be provided.
          ]
        `);

        expect(stdout).toEqual('');
      },
    ).on('exit', (code) => {
      expect(code).toEqual(1);
      done();
    });
  }, 20000);
  it('Shows error when both groupId & orgId provided', (done) => {
    exec(
      `node ${main} list:imported --integrationType=github --orgId=foo --groupId=bar`,
      {
        env: {
          PATH: process.env.PATH,
          VULNMAP_TOKEN: process.env.VULNMAP_TOKEN_TEST,
          VULNMAP_API: process.env.VULNMAP_API_TEST,
          VULNMAP_LOG_PATH: __dirname,
        },
      },
      (err, stdout, stderr) => {
        expect(stderr).toMatchInlineSnapshot(`
          "ERROR! Failed to list imported targets in Vulnmap. Try running with \`DEBUG=vulnmap* <command> for more info\`.
          ERROR: Too many parameters: orgId or groupId must be provided, not both.
          "
        `);
        expect(err).toMatchInlineSnapshot(`
          [Error: Command failed: node ./dist/index.js list:imported --integrationType=github --orgId=foo --groupId=bar
          ERROR! Failed to list imported targets in Vulnmap. Try running with \`DEBUG=vulnmap* <command> for more info\`.
          ERROR: Too many parameters: orgId or groupId must be provided, not both.
          ]
        `);
        expect(stdout).toEqual('');
      },
    ).on('exit', (code) => {
      expect(code).toEqual(1);
      done();
    });
  }, 20000);
});
