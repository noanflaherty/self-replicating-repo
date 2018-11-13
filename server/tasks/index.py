from github import Github, GithubException
import time

from server import app, celery, logger
from server.utils.utils import getAllFilesWPathsInDirectory
from server.utils.githubUtils import createNewRepo
from server.utils.socketUtils import postEvent

@celery.task
def add(x, y):
    return x + y

@celery.task(bind=True)
def timer(self, n):

    results = []

    for i in range(n):
        data = {
            'message': 'On number {} of {}'.format(i+1, n),
        }

        time.sleep(1)

        resp = postEvent('STATUS_UPDATE', data, room=self.request.id)

        results.append(i+1)

    message = {
        'message': 'Completed timer.',
        'data': results,
    }

    resp = postEvent('COMPLETED', message, room=self.request.id)

    return results


@celery.task(bind=True)
def copyAppToNewRepo(self, github_token, repo_name):

    task_id = self.request.id

    try:

        DEFAULT_DIRS_TO_AVOID = set(['./.git', './env', './node_modules', './server/static/javascript', './.profile.d', './.heroku'])
        DEFAULT_EXTENSIONS_TO_AVOID = set(['pyc', 'log', 'python_history', 'rdb', 'env'])

        g = Github(github_token)

        # Since creating a repo happens on the user obejct, we must fetch the user first.
        user = g.get_user()
        user_login = user.login

        # Create a new repo for the user. Will fail if repo name already exists
        repo = createNewRepo(user, repo_name)
        new_repo_name = repo.name

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

            try:
                # Ideally Github would allow us to add our files in batches, rather than one at a time,
                # so that we can reduce the number of API calls required. However, based on this
                # dicsussion, it does not appear to be possible. https://github.com/isaacs/github/issues/199

                debug_message = 'Committing file {file_num} of {num_files} for {user_login} to {repo_name}: {file_path}'.format(file_num=i+1, num_files=len(files), user_login=user_login, repo_name=new_repo_name, file_path=file_path_formatted)
                logger.debug(debug_message)

                commit_message = 'File {file_num} of {num_files}: {file_path}'.format(file_num=i+1, num_files=len(files), user_login=user_login, repo_name=new_repo_name, file_path=file_path_formatted)
                repo.create_file(file_path_formatted, commit_message, file_content)
                files_added_successfully.append(file_path_formatted)

                event_message = 'Committed file {file_num} of {num_files}: {file_path}'.format(file_num=i+1, num_files=len(files), user_login=user_login, repo_name=new_repo_name, file_path=file_path_formatted)
                resp = postEvent('STATUS_UPDATE', {'message': event_message}, room=task_id)

            except GithubException as e:
                errorMessage = e.args[1].get('message')
                files_failed.append(file_path_formatted)

        results = {
            'repoName': new_repo_name,
            'successfullyAdded': files_added_successfully,
            'failed': files_failed,
        }

        resp = postEvent('COMPLETED', results, room=task_id)
        return
    except GithubException as e:
        error = {
            'status': e.status,
            'data': e.data,
        }
        error['data']['repoName'] = repo_name
        logger.debug(error)
        resp = postEvent('FAILED', error, room=task_id)
        return
    except Exception as e:
        error = {
            'status': 500,
            'data': {
                'message': str(e),
                'repoName': repo_name
            }
        }
        resp = postEvent('FAILED', error, room=task_id)
        return
