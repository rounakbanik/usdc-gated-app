import { v4 as uuid } from 'uuid';
import { Circle, CircleEnvironments } from '@circle-fin/circle-sdk';
import { circleSandboxApiKey } from '@/data/constants';

// Instantiate Circle SDK object with API key
const circle = new Circle(
    circleSandboxApiKey,
    CircleEnvironments.sandbox,
);

// Create intent to pay 1 USDC
async function createUSDCPayment() {
    const reqBody = {
        amount: {
            amount: "1",
            currency: "USD"
        },
        settlementCurrency: "USD",
        // Since we're using sanbox, ETH here refers to the goerli chain
        paymentMethods: [
            {
                type: "blockchain",
                chain: "ETH"
            }
        ],
        idempotencyKey: uuid()
    };

    // Create payment intent using SDK
    const resp = await circle.cryptoPaymentIntents.createPaymentIntent(reqBody);
    return resp.data
}

// Get Payment intent
async function getPaymentIntent(paymentInentId) {
    const resp = await circle.cryptoPaymentIntents.getPaymentIntent(paymentInentId);
    return resp.data;
}

// Helper function to create a delay (in milliseconds)
function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// Poll payment ID to get payment intent every 500 ms
async function pollPaymentIntent(paymentIntentId) {

    // Poll every 0.5 seconds or 500 ms
    const pollInterval = 500;

    let resp = undefined;
    while (true) {
        resp = await getPaymentIntent(paymentIntentId);

        // Check if deposit address has been created
        let depositAddress = resp.data?.paymentMethods[0].address;

        // If address created, break. Else check again in 500 ms
        if (depositAddress) break;
        await delay(pollInterval);
    }

    return resp.data;
}

// Create wallet address and return address + payment intent
async function createWalletAddress() {

    // Create payment intent for 1 USDC
    const paymentIntent = await createUSDCPayment();
    const paymentIntentId = paymentIntent.data.id;
    const payment = await pollPaymentIntent(paymentIntentId);
    const address = payment.paymentMethods[0].address;

    // Get wallet address where customer will deposit I USDC
    console.log(`Payment Intend ID: ${paymentIntentId}`)
    console.log(`Please pay 1 USDC to ${address}`)

    return [paymentIntentId, address];
}

export { createWalletAddress }