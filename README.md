#  USDC Payment Gated App

This demo app, built using NextJS and the Circle SDK, allows developers to create gated content that can be accessed once a payment has been made in USDC.

## Installation

1. Clone the repository
2. Install required packages using `npm install`.
3. Create a copy of `.env.local.sample` and name it `.env.local`. Add the Infura and Circle API keys.
4. Deploy a version of the app to localhost using `npm run dev`.

## Usage

1. User connects their wallet to the app (a self-custodial browser wallet like MetaMask is required)
2. Once connected, user requests to make a payment
3. A payment intent is created, and the user is asked to make a 1 USDC payment to a deposit address
4. Once the payment is made, user can request confirmation
5. Once payment is confirmed, user can access gated content!

