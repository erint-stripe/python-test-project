# Python Boilerplate Code Repo

The intent of this repo is to provide new TSEs with a working Python environment that is correctly configured to run ad hoc requests using the Stripe library. It assumes no knowledge of the Python programming language.

## Stripe Library

Below is the library being utilized in this demo. Visit the Github repository to review the README and any outstanding issues.

- [Stripe Python](https://github.com/stripe/stripe-python) v2.67.0

## Getting Started

- After cloning the repo, create a local Python virtual environment with the following command
  ```python
  python -m venv .venv
  ```

* This will create an isolated Python installation and help avoid any conflicts when installing different Python packages. Activate the virtual environment using
  ```python
  source .venv/bin/activate
  ```
* Install required Python packages
  ```python
  pip install -r requirements.txt
  ```
  > If you update the installed packages and wish to update the requirements.txt to ensure you can recreate this environment, run `pip freeze > requirements.txt` to write the current state of installed packages to the file.

### Create `.env` file

The code in `app.py` is configured to read environment variables from a file called `.env`. There is a template version of this file called `env_template`.  Replace the placeholder test with you Stripe secret API key, webhook secret, and api version.

```
# Template for .env file

STRIPE_SECRET_KEY=your_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
STRIPE_API_VERSION=your_api_version
```

In the `app.py` file, the [`load_dotenv()` function](https://pypi.org/project/python-dotenv/) scans the current directory for the `.env` file and loads specified values as environment variables. These variables are then accessed using `os.getenv()`.

## Testing Stripe Library

Once you have either created your `.env` file or hardcoded the values for your secret key and webhook secret and activated your virtual environment, run the following command in the terminal:

```python
python app.py
```

You should see a Stripe balance object printed out. If you do not, check the error message returned and verify your secret key is correct.

## Writing additional functions in `app.py`

In addition to calling the `app.py` file using the approach above, you can write functions in `app.py` and call them using a python REPL.

Example:
- create the function
```
# app.py
def create_setup_intent():
  setup_intent = stripe.SetupIntent.create()
  return setup_intent
```
- and then you can import and call the function in the terminal
```python
$ ipython
...
ln [1]: from app import create_setup_intent
ln [2] setup_intent = create_setup_intent()
ln [3] print(setup_intent.client_secret)
```


## Running a Web Server

There is a example web server in the `web_server/` directory using [Flask](https://flask.palletsprojects.com/en/2.3.x/). The actual server code is located in `web_server/server.py`. This example includes a few **very** basic HTML template files in `web_server/public/` and some server functions that map to different URLs that you can navigate to in a web browser. The intent is to provide a basic skeleton of a web server that demonstrates how to send a response to the server and get a reply as well as how to use JavaScript to interact with the user.

Once you have your `.env` file configured, you can spin up a local web server by running the following code

```python
python web_server/server.py
```

You can then access your web server by going to `http://localhost:4321`. All the code in `server.py` is just for example and is not intended to be part of a functioning app.

## Receiving Webhook Events

The web server defined in `server.py` already has a route set up to receive webhook events at `/webhook`.  The `webhook()` function will log the incoming request data, attempt to validate the event, log the event, log any errors encountered, and respond to Stripe.  

You can forward your webhook events to this endpoint using the [Stripe CLI](https://stripe.com/docs/cli) and the `stripe listen` command. If you are using the default configuration, the command will look like this
```
stripe listen --forward-to http://localhost:4321/webhook
```
The first line you will see written to your terminal after this command will include the webhook signing secret.  It will start with `whsec_`.  Be sure to copy this text and add in to your `.env` file for the `STRIPE_WEBHOOK_SECRET` value.  If your web-server is already running you will need to restart it to ensure the value is loaded properly.

Once you receive a webhook event you should see it logged in the terminal window in which you are running `server.py`.

## Troubleshooting

For an integration this simple there are not many things that could be going wrong. The first place to look is the value loaded fron the `.env` file as the `STRIPE_SECRET_KEY`. Uncomment line 17 in `app.py` to see the value printed to the terminal the next time you run the program. If you do not see your API key, check the spelling of the variable name in both `.env` and `app.py`. Additionally make sure there are no spaces around the `=` sign in `.env`.

## Python Protips
* While not a requirement here, if you are going to do much work in the `terminal` using Python it is advised to install the iPython REPL (`pip install ipython`).  This REPL includes code completion, syntax highlighting, code history, and some simple command suggestions based on command history.  It makes remembering all those `import ...` statements a lot easier to reproduce each time you start a new terminal session.

---

Maintained by [@rmanzer](https://stripe.slack.com/app_redirect?channel=U02HWDC8UER)
