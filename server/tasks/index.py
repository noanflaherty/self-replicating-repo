from github import Github, GithubException

from server import app, celery, logger
from server.utils.utils import getAllFilesWPathsInDirectory


@celery.task
def add(x, y):
    return x + y

@celery.task
def copyAppToNewRepo(github_token, repo_name):

    DEFAULT_DIRS_TO_AVOID = set(['./.git', './env', './node_modules', './server/static/javascript', './.profile.d', './.heroku'])
    DEFAULT_EXTENSIONS_TO_AVOID = set(['pyc', 'log', 'python_history'])

    g = Github(github_token)

    # Since creating a repo happens on the user obejct, we must fetch the user first.
    user = g.get_user()
    user_login = user.login

    # Try to create the repo. Creation will fail if a repo has already been created with that name.
    try:
        logger.debug('Trying to create new repo with name: {}'.format(repo_name))
        repo = user.create_repo(repo_name)
        new_repo_name = repo.name
    # If we fail to create a repo, we check to see if it was because there was already one with that name
    except GithubException as repo_creation_error:
        data = {
            'repoName': repo_name,
        }
        return handleGithubError(repo_creation_error, data=data)

    # If we successfully created the repo, then we can prep all files in this app to add to the repo.
    files = getAllFilesWPathsInDirectory('.', dirsToAvoid=DEFAULT_DIRS_TO_AVOID, extensionsToAvoid=DEFAULT_EXTENSIONS_TO_AVOID)
    files_added_successfully = []
    files_failed = []

    for i, file_path in enumerate(files):

        # Try to read the file's content.
        try:
            with open(file_path, 'rb') as file:
                file_content = file.read()
        except IOError as e:
            files_failed.append(file_path_formatted)
            continue

        file_path_formatted = file_path[2:]
        commit_message = 'Committing file {file_num} of {num_files} for {user_login} to {repo_name}: {file_path}'.format(file_num=i+1, num_files=len(files), user_login=user_login, repo_name=new_repo_name, file_path=file_path_formatted)

        logger.debug(commit_message)

        try:
            # Ideally Github would allow us to add our files in batches, rather than one at a time,
            # so that we can reduce the number of API calls required. However, based on this
            # dicsussion, it does not appear to be possible. https://github.com/isaacs/github/issues/199

            repo.create_file(file_path_formatted, commit_message, file_content)
            files_added_successfully.append(file_path_formatted)
        except GithubException as e:
            errorMessage = e.args[1].get('message')
            files_failed.append(file_path_formatted)


def handleGithubError(error, data={}):
    status = error.args[0]
    errorData = error.args[1]

    resp = {
        'data': data,
        'error': errorData,
    }

    logger.debug('Received GitHub Error with Status {status}. Error: {errorData}'.format(status=status, errorData=errorData))
    return resp, status
