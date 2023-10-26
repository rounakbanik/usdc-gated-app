import Head from "next/head";
import { Fragment } from "react";
import styles from "../styles/connect.module.css";
import { useConnect, useAccount } from 'wagmi'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { goerli } from '@wagmi/core/chains'

export default function Connect() {

    const { connect, connectors, error, isLoading, pendingConnector } = useConnect({
        chainId: goerli.id,
    });
    const { isConnected } = useAccount();
    const [hasMounted, setHasMounted] = useState(false);
    const router = useRouter();

    // Prevent hydration errors
    useEffect(() => {
        setHasMounted(true);
    }, [])

    // If connected, go back to the main page
    if (!hasMounted) return null;
    if (isConnected) router.replace('/');

    return (
        <Fragment>
            <Head>
                <title>Connect Wallet</title>
            </Head>
            <div className={styles.jumbotron}>
                <h1>USDC Gated App</h1>
                {connectors.map((connector) => (
                    <button
                        disabled={!connector.ready}
                        key={connector.id}
                        onClick={() => connect({ connector })}
                    >
                        Connect Wallet
                        {!connector.ready && ' (unsupported)'}
                        {isLoading &&
                            connector.id === pendingConnector?.id &&
                            ' (connecting)'}
                    </button>
                ))}
                {error && <div className={styles.error}>{error.message}</div>}
            </div>
        </Fragment>
    )
}