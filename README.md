# Self-Replicating Repo

This is a self-replicating repo that allows you to connect your GitHub account and create a new repo containing all of this app's files. It can be used to quickly create new repos with boilerplate code.

This web-app demonstrates the use of a Python/Flask backend with a React-Redux frontend and GitHub OAuth2 authentication. More on how it works below under "Technical Specifications."

## Getting Started

This app is already deployed and live on Heroku. To use and test it, simply go to <https://nf-self-replicating-repo.herokuapp.com/> – no installation required. However, if you'd like to build and run it yourself locally, instructions to do so are down below.

## Technical Specifications
What does this app do and how does it work?

As mentioned above, this application provides a web-browser interface for creating new GitHub repos with boilerplate code. This app is broken down into two major components:

### Backend:
This app uses a Python Flask App as a backend server to perform tasks such as receiving a GitHub user's OAuth token, creating a new repo, and committing its own files to that repo. The code for the backend lives primarily in `./server/`.

It has one view, which serves up a bare-bones html template that our frontend injects its own html into, as well as two api endpoints. The endpoints are:
* `/api/github/authenticate` - You provide a GitHub Authentication code (in our case, retrieved by the frontend) and it uses it to retrieve an auth bearer token for the user from GitHub.
* `/api/github/copy-app-to-repo` - You provide it a repo name and an auth token and it will create a new repo for the authenticated user with that name, then proceed to commit each file within this app to the repo. Note that certain directories and file extensions are ignored (mostly those that are generated by the build process). Also note that GitHub limits its API users to one file per request, so this can be a long-running API call (as of 11/4/2018 it takes about 1 minute to commit all 37 important files in this repo).

### Frontend:
This app uses npm and webpack to serve up a frontend web-app that utilizes React and Redux Javascript frameworks. The code for this lives primarily within `./client` and is made up of components, containers, actions, reducers, selectors, and utilities. It makes uses of redux-thunk to handle asynchronous actions (API calls to the backend).


## Building Locally

### Prerequisites

To be able to build this app and run it locally, you must have the following installed:
* Python 2 or 3
* pip, for installing Python packages
* virtualenv, a pip package for creating virtual Python environemnts
* npm for building the front end

### Procedure

1. Clone the repo from <https://github.com/noanflaherty/self-replicating-repo+git>
2. At the top level within the directory, create a .env file with contents of the form:
   ```
   APP_SECRET_KEY = REPLACE_W_SOME_RANDOM_STRING

   GITHUB_CLIENT_ID = REPLACE_W_CLIENT_ID_PROVIDED_BY_GITHUB

   GITHUB_CLIENT_SECRET = REPLACE_W_CLIENT_SECRET_PROVIDED_BY_GITHUB
   ```
3. Note that you will have to create a GitHub OAuth App by following [these instructions](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/) to get a client ID and secret.
4. Create a virtual environment in the repo directory with the name "env" and activate it.
   ```
   $ virtualenv env
   $ source env/bin/activate
   ```
5. Install all Python dependencies using pip:
   ```
   $ pip install -r requirements.txt
   ```
6. Start your python app in development mode by running:
   ```
   $ python app.py
   ```
7. Now, we need to install dependencies for our front end and use webpack to build our front-end app. In a separate terminal tab, cd into the repo and:
   ```
   $ npm install
   $ npm run dev
   ```
8. That's it! Your app is now running locally in dev mode. In your browser, go to <http://0.0.0.0:8000> to test!

9. If you'd like to run the app as if it were being run on production instead of in dev mode, then follow all steps above, except execute:

   * `$ gunicorn --bind 0.0.0.0:8000 wsgi` instead of `$ python app.py`; and

   * ` $ npm run build` instead of `$ npm run dev`.


## Author

* **Noa Flaherty**


## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/noanflaherty/self-replicating-repo/blob/master/LICENSE) file for details
