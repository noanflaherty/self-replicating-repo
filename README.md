# Self-Replicating Repo

This is a self-replicating repo that allows you to connect your GitHub account and create a new repo containing all of this app's files. It can be used to quickly create new repos with boilerplate code.

This web-app demonstrates the use of a Python/Flask backend with a React-Redux frontend. It also showcases the use of REST APIs, asynchronous tasks via Celery, RabbitMQ, and Redis, Websocket connections, and OAuth2, authentication. More on how it works below under "Technical Specifications."

## Getting Started

This app is already deployed and live on Heroku. To use and test it, simply go to <https://nf-self-replicating-repo.herokuapp.com/> – no installation required. However, if you'd like to build and run it yourself locally, instructions to do so are down below.

## Technical Specifications
What does this app do and how does it work?

As mentioned above, this application provides a web-browser interface for creating new GitHub repos with boilerplate code. This app is broken down into two major components:

### Backend:
This app uses a Python Flask App as a backend server to perform tasks such as receiving a GitHub user's OAuth token, queuing asynchronous tasks, and sending progress updates back to the client via websocket connections. The code for the backend lives primarily in `./server/`.

It has one view, which serves up a bare-bones html template that our frontend injects its own html into, as well as three api endpoints. The endpoints are:
* `/api/github/authenticate` - You provide a GitHub Authentication code (in our case, retrieved by the frontend) and it uses it to retrieve an auth bearer token for the user from GitHub.
* `/api/github/copy-app-to-repo` - You provide it a repo name and an auth token and it will queue up an asynchronous task that creates a new repo for the authenticated user with that name, then proceeds to commit each file within this app to the repo. Note that certain directories and file extensions are ignored (mostly those that are generated by the build process).
* `/api/message/emit` - An internal API used by our asynchronous worker to emit websocket events back to the client.

### Task Queue:
This app uses a Celery task queue, a RabbitMQ message broker, and a Redis result store to perform the actual work of creating a new repo and committing this app's files. This process is done asynchronously because each file must be committed to GitHub individually, meaning that the job time scales linearly with the number of files in this app.

During the task, the worker posts status updates to our internal endpoint, which in turn, emits websocket messages to clients listening for updates to that specific task.

### Frontend:
This app uses npm and webpack to serve up a frontend web-app that utilizes React and Redux Javascript frameworks. The code for this lives primarily within `./client` and is made up of components, containers, actions, reducers, selectors, and utilities. It makes uses of redux-thunk to handle asynchronous actions (API calls to the backend). Lastly, it opens websocket connections with the server when a job is begun and closes it when the job either completes or fails.


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
   SECRET_KEY = REPLACE_W_SOME_RANDOM_STRING_1
   SERVICE_TOKEN = REPPLACE_W_SOME_RANDOM_STRING_2
   SESSION_TYPE = redis
   REDIS_URL = REPLACE_W_REDIS_URL
   SERVER_NAME = localhost:8000

   GITHUB_CLIENT_ID = REPLACE_W_CLIENT_ID_PROVIDED_BY_GITHUB
   GITHUB_CLIENT_SECRET = REPLACE_W_CLIENT_SECRET_PROVIDED_BY_GITHUB

   CELERY_BROKER_URL = REPLACE_W_RABBITMQ_URL
   CELERY_TRACE_APP = 1
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
   export the variables in the .env file above.
   $ npm run dev
   ```
8. We are using celery and rabbitmq to handle asynchronous events. Open another terminal tab and enter the following. This will begin our RabbitMQ broker. You can view the admin UI for this at <http://localhost:15672>.
   ```
   $ /usr/local/sbin/rabbitmq-server
   ```
9. We will use redis to store the results of our tasks. While the app does not take advantage of this currently, it sets things up nicely should we decide to take advantage of this in the future. Start redis in a new tab by executing:
   ```
   $ redis-server
   ```
10. Now start the celery worker by opening another terminal tab and entering:
    ```
    $ celery -A server.celery worker --loglevel=DEBUG
    ```
11. If you'd like to view the admin UI for celery, open another terminal tab and enter the following, then go to http://localhost:5555>.
    ```
    $ flower -A server.celery --port=5555
    ```
12. Whew! You made it! Your app is now running locally in dev mode. In your browser, go to <http://0.0.0.0:8000> to test!

13. If you'd like to run the app as if it were being run on production instead of in dev mode, then follow all steps above, except execute:

    * `$ gunicorn --worker-class eventlet -w 1 wsgi:app` instead of `$ python app.py`;
    * `$ celery -A server.celery worker` instead of `$ celery -A server.celery worker --loglevel=DEBUG`; and

    * ` $ npm run build` instead of `$ npm run dev`.

## Future Enhancements
As with any project, there are areas worthy of improvement with this app. Here are a few that I would tackle first.

1.  Implement Immutable.js. Redux benefits from having an immutable state. Implementing immutable reduces frontend bug surface area down the line.
2.  Better containerization of React components. This app's containers, components, and their styles were implemented in an MVP fashion, but with better organization, they would lend themselves better to component reuse down the line.


## Author

* **Noa Flaherty**


## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/noanflaherty/self-replicating-repo/blob/master/LICENSE) file for details
