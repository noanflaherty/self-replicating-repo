export const clientConfig = {
  app: {
    defaultRepoName: 'self-replicating-repo',
  },
  github: {
    clientId: GITHUB_CLIENT_ID,
    redirectUri: `${NODE_ENV == 'PROD' ? 'https' : 'http'}://${SERVER_NAME}/login`,
    defaultScope: 'user public_repo',
  },
};
