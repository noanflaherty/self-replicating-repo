export const clientConfig = {
  app: {
    defaultRepoName: 'self-replicating-repo',
  },
  github: {
    clientId: 'a2095cdeb6ef908ffafb',
    redirectUri: (process.env.LOCATION == 'PROD' ? 'https://nf-self-replicating-repo.herokuapp.com/login' : 'http://0.0.0.0:8000/login'),
    defaultScope: 'user public_repo',
  },
};
