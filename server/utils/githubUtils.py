from server import logger, app
from github import GithubException

def createNewRepo(user, repo_name):
    # user is expected to be of type github.AuthenticatedUser
    user_login = user_login = user.login

    repo = user.create_repo(repo_name)
    logger.debug('Created new repo with name: {} for user {}'.format(repo_name, user_login))
    return repo
