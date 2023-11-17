export const IMPORT_LOG_NAME = 'imported-targets.log';
export const FAILED_LOG_NAME = 'failed-imports.log';
export const FAILED_PROJECTS_LOG_NAME = 'failed-projects.log';
export const UPDATED_PROJECTS_LOG_NAME = 'updated-projects.log';
export const FAILED_UPDATE_PROJECTS_LOG_NAME = 'failed-to-update-projects.log';
export const FAILED_POLLS_LOG_NAME = 'failed-polls.log';
export const IMPORT_JOBS_LOG_NAME = 'import-jobs.log';
export const IMPORTED_PROJECTS_LOG_NAME = 'imported-projects.log';
export const IMPORTED_BATCHES_LOG_NAME = 'imported-batches.log';
export const IMPORT_JOB_RESULTS = 'import-job-results.log';
export const CREATED_ORG_LOG_NAME = 'created-orgs.log'
export const FAILED_ORG_LOG_NAME = 'failed-to-create-orgs.log'
export const FAILED_SYNC_LOG_NAME = 'failed-to-sync-target.log'
export const targetProps = [
  'name',
  'appId',
  'functionId',
  'slugId',
  'projectKey',
  'repoSlug',
  // 'id', skip Gitlab ID so we can match against Vulnmap project data where ID is never returned by Vulnmap APIs
  'owner',
  'branch',
];
export const targetPropsWithId = [...targetProps, 'id'];

export const defaultExclusionGlobs = [
  'fixtures',
  'tests',
  '__tests__',
  'test',
  '__test__',
  'ci',
  'node_modules',
  'bower_components',
  '.git',
];
