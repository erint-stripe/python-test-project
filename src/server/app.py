import csv
import os
import stripe
from flask import Flask, request, Response, json
from dotenv import load_dotenv

load_dotenv()  # load .env defined environment variables

# constants
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# initializing stripe library with secret key
stripe.api_key = STRIPE_SECRET_KEY

# initialize flask app
app = Flask(__name__)

# routes

@app.get("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/balance", methods=["GET"])
def balance():
    match request.method:
        case "GET":
            balance = stripe.Balance.retrieve()
            response = json.dumps(balance)
            return Response(response, status=200)
    return Response(status=405)

@app.route("/balance-transactions", methods=["GET"])
def balance_transactions():
    match request.method:
        case "GET":
            balance_transactions = stripe.BalanceTransaction.list(limit=50)
            response = json.dumps(balance_transactions)
            return Response(response, status=200)
    return Response(status=405)

@app.route("/payment-intent", methods=["POST"])
def payment_intent():
    match request.method:
        case "POST":
            amount = int(float(request.get_json()["amount"]) * 100)
            payment_intent = stripe.PaymentIntent.create(
                amount=amount,
                currency="usd",
                automatic_payment_methods={"enabled": True}
            )
            response = json.dumps({"clientSecret": payment_intent["client_secret"]})
            return Response(response, status=200)
    return Response(status=405)

@app.route("/payment-intents", methods=["GET"])
def payment_intents():
    match request.method:
        case "GET":
            payment_intents = stripe.PaymentIntent.list(limit=50)
            response = json.dumps(payment_intents)
            return Response(response, status=200)
    return Response(status=405)

@app.route("/refund", methods=["POST"])
def refunds():
    match request.method:
        case "POST":
            payment_intent = request.get_json().get("paymentIntent")
            amount = request.get_json().get("amount")
            refund = stripe.Refund.create(
                payment_intent=payment_intent,
                amount=amount
            )
            response = json.dumps(refund)
            return Response(response, status=200)
    return Response(status=405)

@app.post("/webhook")
def handle_webhook():
    payload = request.data
    signature_header = request.headers["Stripe-Signature"]

    try:
        event = stripe.Webhook.construct_event(
            payload, signature_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
    # Invalid payload
        print('Error parsing payload: {}'.format(str(e)))
        return Response(status=400)
    except stripe.error.SignatureVerificationError as e:
    # Invalid signature
        print('Error verifying webhook signature: {}'.format(str(e)))
        return Response(status=400)
    
    # Handle events
    match event["type"]:
        case "charge.succeeded":
            print("Charge succeeded!")
        case "charge.updated":
            print("Charge updated!")
        case "charge.dispute.created":
            write_dispute(event)
            print("Charge disputed!")
        case "payment_intent.created":
            print("Payment intent created!")
        case "payment_intent.succeeded":
            print("Payment intent succceeded!")
        case "payment_method.attached":
            print("Payment method attached!")
        case _:
            print("unrecognized event: ", event["type"])
    return Response(status=200)

def write_dispute(event):
    print(event)
    with open('../../dispute_log.csv', 'a', newline='') as csvfile:
        charge_data = event["data"]["object"]
        row = [
            charge_data["amount"],
            charge_data["charge"],
            charge_data["created"],
            charge_data["currency"],
            charge_data["id"],
            charge_data["reason"],
            charge_data["status"]
        ]
        writer = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        writer.writerow(row)


def main():
    app.run()

if __name__ == "__main__":
    # This will run if this file is invoked from the command line
    main()
