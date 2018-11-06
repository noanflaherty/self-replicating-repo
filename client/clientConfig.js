export const clientConfig = {
  app: {
    defaultRepoName: 'self-replicating-repo',
  },
  github: {
    clientId: '4851d210ea350c0dc4f1',
    redirectUri: (process.env.NODE_ENV == 'production' ? 'https://nf-self-replicating-repo.herokuapp.com/login' : 'http://0.0.0.0:8000/login'),
    defaultScope: 'user public_repo',
  },
};
