// Standard Next and CSS imports
import Head from "next/head";
import { Fragment, useState, useEffect } from "react";
import styles from "../styles/mainpage.module.css";
import { useRouter } from "next/router";
import { Inter } from 'next/font/google'

// Wagmi import for connected wallet info
import { useAccount } from "wagmi";

// Custom imports
import { createWalletAddress } from "@/utils/payments";
import { checkPaymentStatus } from "@/utils/confirmation";
import { apiKey, circleSandboxApiKey } from "@/data/constants";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  // Standard Next router definition
  const router = useRouter();

  // Get connected wallet address and connection status
  const { isConnected } = useAccount();

  // Prevent Hydration errors
  const [hasMounted, setHasMounted] = useState(false);

  // Payment intent and deposit address
  const [intentLoading, setIntentLoading] = useState(false);
  const [intent, setIntent] = useState(null);
  const [depositAddress, setDepositAddress] = useState(null);

  // Payment status and error checker (ie payment hasn't been made yet)
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [error, setError] = useState(null);

  // Hydration error fix
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Do not render until entire UI is mounted  
  if (!hasMounted) return null;

  // Redirect to Connect page if wallet is not connected
  if (!isConnected) {
    router.replace('/connect');
  }

  // Create payment intent and set intent ID + deposit address
  const createPaymentIntent = async (e) => {

    e.preventDefault();
    setIntentLoading(true);

    let [intent, address] = await createWalletAddress();
    setIntent(intent);
    setDepositAddress(address);
    setIntentLoading(false);
  }

  // Confirm if payment has been made
  const confirmPayment = async (e) => {

    e.preventDefault();

    let paymentStatus = await checkPaymentStatus(intent);
    if (paymentStatus) {
      setIntent(null);
      setDepositAddress(null);
      setError(null);
    }
    else {
      setError("Payment hasn't been confirmed yet. Try again in sometime in case it's already done.")
    }
    setPaymentStatus(paymentStatus);
  }

  return (
    <Fragment>
      <Head>
        <title>My USDC Payment Gated App</title>
      </Head>

      <main className={inter.className}>
        <div className={styles.jumbotron}>
          <h1>USDC Gated App</h1>
          {/* Display when no intent to pay has been made */}
          {!intent && !depositAddress && !paymentStatus && <div>
            <p>
              You will need to make a payment to access this gated content.
            </p>
            {!intentLoading && <form onSubmit={createPaymentIntent} className={styles.mint_form}>
              <button type="submit">
                Pay 1 USDC
              </button>
            </form>}
            {intentLoading && <div className={styles.loader}></div>}
          </div>}

          {/* Display when intent to pay is created but payment is pending */}
          {intent && depositAddress && !paymentStatus && <div>
            <p>Please pay 1 USDC to {depositAddress}</p>
            <p>Once done, click for confirmation</p>
            <form onSubmit={confirmPayment} className={styles.mint_form}>
              <button type="submit">
                Confirm
              </button>
            </form>
          </div>}

          {/* Display when payment is made */}
          {!intent && !depositAddress && paymentStatus && <div>
            <p>Thank you for the payment!</p>
            <p>Here is some super exclusive content!</p>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/Df3GmQsCcFQ?si=RNPSGr4gngYoLo1G" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          </div>}
          {error && <p>{error}</p>}
        </div>
      </main>

    </Fragment>
  )
}