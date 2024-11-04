"""
app.py - This script provides the basic framework necessary to execute Stripe API requests

"""
import stripe

# Loading .env file for constants
# If you are not using a .env file, feel free to comment out
import os
from dotenv import load_dotenv

load_dotenv()  # load .env defined environment variables

# DEFINE CONSTANTS
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')

# print(STRIPE_SECRET_KEY) <-- Uncomment this to examine variable

# Initializing Stripe library with secret key
stripe.api_key = STRIPE_SECRET_KEY

# DEFINE FUNCTIONS


def test_balance():
    """
    A simple GET request to validate the Stripe library is working with the provided API key
    """
    balance = stripe.Balance.retrieve()
    print(balance)


def main():
    # testing Stripe instance properly configured
    test_balance()


if __name__ == "__main__":
    # This will run if this file is invoked from the command line
    main()
