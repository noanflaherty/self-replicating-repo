from flask import Flask, session
from flask_session import Session
import logging
import os
import sys

sess = Session()

def create_app(configfile=None):
    app = Flask(__name__)
    app.config.from_object('app_config')
    app.config['SESSION_TYPE'] = 'filesystem'
    app.secret_key = 'secret'
    sess.init_app(app)
    return app


## Create the app and set configurations
app = create_app()
logger = app.logger


# # Register APIs
# from server.api.auth import auth_api
# app.register_blueprint(auth_api.blueprint, url_prefix='/api/auth')

# Register views
# from .views.index import index_view
# app.register_blueprint(index_view)

from requests_oauthlib import OAuth2Session
from flask import request, redirect, url_for
from flask.json import jsonify

# This information is obtained upon registration of a new GitHub OAuth
# application here: https://github.com/settings/applications/new
client_id = app.config.get('GITHUB_CLIENT_ID')
client_secret = app.config.get('GITHUB_CLIENT_SECRET')
authorization_base_url = 'https://github.com/login/oauth/authorize'
token_url = 'https://github.com/login/oauth/access_token'


@app.route("/")
def demo():
    """Step 1: User Authorization.

    Redirect the user/resource owner to the OAuth provider (i.e. Github)
    using an URL with a few key OAuth parameters.
    """
    github = OAuth2Session(client_id)
    authorization_url, state = github.authorization_url(authorization_base_url)

    # State is used to prevent CSRF, keep this for later.
    session['oauth_state'] = state
    return redirect(authorization_url)


# Step 2: User authorization, this happens on the provider.

@app.route("/callback", methods=["GET"])
def callback():
    """ Step 3: Retrieving an access token.

    The user has been redirected back from the provider to your registered
    callback URL. With this redirection comes an authorization code included
    in the redirect URL. We will use that to obtain an access token.
    """

    github = OAuth2Session(client_id, state=session['oauth_state'])
    token = github.fetch_token(token_url, client_secret=client_secret,
                               authorization_response=request.url)

    # At this point you can fetch protected resources but lets save
    # the token and show how this is done from a persisted token
    # in /profile.
    session['oauth_token'] = token

    return redirect(url_for('.profile'))


@app.route("/profile", methods=["GET"])
def profile():
    """Fetching a protected resource using an OAuth 2 token.
    """
    github = OAuth2Session(client_id, token=session['oauth_token'])
    return jsonify(github.get('https://api.github.com/user').json())
