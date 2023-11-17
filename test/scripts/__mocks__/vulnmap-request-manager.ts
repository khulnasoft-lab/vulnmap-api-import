// eslint-disable-next-line @typescript-eslint/naming-convention
export class requestsManager {
  params: unknown;
  constructor(params: unknown = {}) {
    this.params = params;
  }

  request = (request: { verb: string }): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      if (request.verb === 'get') {
        return reject({
          statusCode: 500,
          error: {
            message: 'Error calling Vulnmap api',
          },
        });
      }
      if (request.verb === 'post') {
        return resolve({
          statusCode: 201,
          headers: {
            location:
              'https://app.vulnmap.khulnasoft.com/api/v1/org/ORG-ID/integrations/INTEGRATION-ID/import/IMPORT-ID',
          },
        });
      }
    });
  };
}
