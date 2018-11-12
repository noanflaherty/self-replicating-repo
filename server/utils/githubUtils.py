

def createNewRepo(user):
    # user is expected to be of type github.AuthenticatedUser


    user_login = user_login = user.login

    # Try to create the repo. Creation will fail if a repo has already been created with that name.
    try:
        logger.debug('Created new repo with name: {} for user {}'.format(repo_name, user_login))
        repo = user.create_repo(repo_name)
    # If we fail to create a repo, we check to see if it was because there was already one with that name
    except GithubException as repo_creation_error:
        logger.debug('Failed to create new repo with name: {} for user {}'.format(repo_name, user_login))
        data = {
            'repoName': repo_name,
        }
        return handleGithubError(repo_creation_error, data=data)

    return repo


def handleGithubError(error, data={}):
    status = error.args[0]
    errorData = error.args[1]

    resp = {
        'data': data,
        'error': errorData,
    }

    logger.debug('Received GitHub Error with Status {status}. Error: {errorData}'.format(status=status, errorData=errorData))
    return resp, status
