export const clientConfig = {
  app: {
    defaultRepoName: 'self-replicating-repo',
  },
  github: {
    clientId: '4851d210ea350c0dc4f1',
    redirectUri: `${NODE_ENV == 'PROD' ? 'https' : 'http'}://${SERVER_NAME}/login`,
    defaultScope: 'user public_repo',
  },
};
