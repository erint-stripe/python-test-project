"""
server.py - Define basic web server functionality
"""


from flask import Flask, jsonify, render_template, request
from dotenv import load_dotenv
from logging import getLogger

import stripe
import os
import json
import hmac

logger = getLogger('__name__')

load_dotenv()  # load .env defined environment variables

# DEFINE CONSTANTS - change these values to whether you want
PORT = 4321
HOST = "127.0.0.1"
DEBUG = True
STATIC_FOLDER = 'public'

# Load account specific environment variables
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET')
STRIPE_API_VERSION = os.getenv('STRIPE_API_VERSION')

# Define Flask app
app = Flask(
    __name__,
    static_folder=STATIC_FOLDER,
    template_folder=STATIC_FOLDER,
    static_url_path='/static'
)

stripe.api_key = STRIPE_SECRET_KEY
stripe.api_version = STRIPE_API_VERSION


@app.route("/")
def hello_world():
    example_variable = "This is an example variable.  You can pass this to your template!"
    return render_template('index.html', example_variable=example_variable)


@app.route("/checkout", methods=['POST'])
def checkout():
    """Define a checkout endpoint.  This is where you could create a Checkout Session or create and return a PaymentIntent."""

    payment_intent = stripe.PaymentIntent.create(
        amount=1000, currency='usd', payment_method_types=['card'],)
    checkout_session = stripe.checkout.Session.create(line_items=[{
        'price_data': {
            'currency': 'usd',
            'product_data': {
                'name': 'T-shirt',
            },
            'unit_amount': 2000,
        },
        'quantity': 1,
    }], payment_method_types=['card'], mode='payment', success_url='https://example.com/success', cancel_url='https://example.com/cancel',)
    return render_template('checkout.html', client_secret=payment_intent.client_secret, checkout_session_id=checkout_session.id, url=checkout_session.url)


@app.route("/success")
def success():
    """Define success page endpoint. Redirect to this page after a successful payment."""
    return render_template('success.html')


@app.route("/webhook", methods=['POST'])
def webhook():
    """Define webhook receiver endpoint.

    You can use the Stripe CLI to forward events to this endpoint while testing.

    Example:
    stripe listen --forward-to localhost:4321/webhook
    """
    event = None
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')
    logger.info(f"Received webhook payload: {payload}")
    logger.info(f"Received webhook signature: {sig_header}")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )

    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid signature: {e}")
        return jsonify(success=False), 400

    except ValueError as e:
        logger.error(f"Invalid payload: {e}")
        return jsonify(success=False), 400

    # Handle the event
    if event:
        # Do things here based on event type
        logger.info(f"Received event: {event}")
        # if you are doing complicated stuff, you should use an asynchronous task queue like Celery or Kafka
        # so that you return a 200 response code to Stripe as quickly as possible.
    
    # Always return a 200 response code to Stripe to acknowledge receipt of the event
    return jsonify(success=True), 200


# This ensures that app.run() will be invoked if this file is called from the terminal (e.g. python server.py)
# https://docs.python.org/3/tutorial/modules.html#executing-modules-as-scripts
if __name__ == '__main__':
    app.run(
        host=HOST,
        port=PORT,
        debug=DEBUG
    )
