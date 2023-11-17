import * as bunyan from 'bunyan';
import * as debugLib from 'debug';

import { getLoggingPath } from './../lib';
import { FAILED_POLLS_LOG_NAME } from './../common';

const debug = debugLib('vulnmap:import-projects-script');

export async function logFailedPollUrls(
  locationUrl: string,
  errorData: {
    errorMessage: string;
    [name: string]: any;
  },
  loggingPath: string = getLoggingPath(),
): Promise<void> {
  try {
    const orgId = locationUrl.split('/').slice(-5)[0];
    const log = bunyan.createLogger({
      name: 'vulnmap:import-projects-script',
      level: 'error',
      streams: [
        {
          level: 'error',
          path: `${loggingPath}/${orgId}.${FAILED_POLLS_LOG_NAME}`,
        },
      ],
    });
    debug({ orgId, locationUrl, ...errorData }, 'Failed to poll url');
    log.error({ orgId, locationUrl, ...errorData }, 'Failed to poll url');
  } catch (e) {
    // do nothing
  }
}
