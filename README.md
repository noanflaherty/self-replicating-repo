# Self-Replicating Repo

This is a self-replicating app that allows you to authenticate with your GitHub account and create a new repo containing all of this app's files. It can be used to quickly create new repos with boilerplate code.

This fully-functioning web-app demonstrates the use of a Python/Flask backend with a React-Redux front-end and GitHub OAuth2 authentication.

## Getting Started

This app is currently set up to be deployed to Heroku. You can test a live functioning version of this app at <https://nf-self-replicating-repo.herokuapp.com/>. Instructions for building yourself locally are below.

## Prerequisites

To be able to build this app and run it locally, you must have the following installed:
* Python 2 or 3
* pip, for installing Python packages
* virtualenv, a pip package for creating virtual Python environemnts
* npm for building the front end

## Building Locally

1. Clone the repo from <https://github.com/noanflaherty/self-replicating-repo+git>
2. At the top level within the directory, create a .env file with the contents:
   ```
   APP_SECRET_KEY = {SOME RANDOM STRING}

   GITHUB_CLIENT_ID = {PROVIDED BY GITHUB}

   GITHUB_CLIENT_SECRET = {PROVIDED BY GITHUB}
   ```
3. Note that you will have to create a GitHub OAuth App by following [these instructions](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/) to get a client ID and secret.
4. Create a virtual environment in the repo directory and activate it.
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
8. That's it! Your app is now running locally in dev mode. If you'd like to run it as if it were being run on production, you can, instead of executing:
   ```
   $ python app.py
   $ npm run dev
   ```
   Execute (respectively):
   ```
   $ gunicorn --bind 0.0.0.0:8000 wsgi
   $ npm run build
   ```

## Authors

* **Noa Flaherty**


## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/noanflaherty/self-replicating-repo/blob/master/LICENSE) file for details
