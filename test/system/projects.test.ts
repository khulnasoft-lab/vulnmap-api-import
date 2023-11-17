import { requestsManager } from 'snyk-request-manager';
import { updateProject } from '../../src/lib';

const VULNMAP_API_TEST = process.env.VULNMAP_API_TEST as string;
const PROJECT_ID = process.env.TEST_PROJECT_ID as string;
const ORG_ID = process.env.TEST_ORG_ID as string;

jest.unmock('snyk-request-manager');
jest.requireActual('snyk-request-manager');

describe('UpdateProject - e2e', () => {
  const OLD_ENV = process.env;
  process.env.VULNMAP_API = VULNMAP_API_TEST;
  process.env.VULNMAP_TOKEN = process.env.VULNMAP_TOKEN_TEST;
  const requestManager = new requestsManager({
    userAgentPrefix: 'vulnmap-api-import:tests',
  });
  afterAll(async () => {
    process.env = { ...OLD_ENV };
  }, 1000);

  it('Update project branch e2e', async () => {
    let res = await updateProject(requestManager, ORG_ID, PROJECT_ID, {
      branch: 'newDefaultBranch',
    });
    expect(res.branch).toEqual('newDefaultBranch');

    res = await updateProject(requestManager, ORG_ID, PROJECT_ID, {
      branch: 'main',
    });
    expect(res.branch).toEqual('main');
  }, 5000);
});
