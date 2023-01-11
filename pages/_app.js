import React from 'react';
import { StateContext } from '../context/StateContext';
import NextNProgress from 'nextjs-progressbar';
import '../styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

function MyApp({ Component, pageProps }) {
    return (
        <StateContext>
            <NextNProgress
                color="orange"
                startPosition={0.1}
                stopDelayMs={20}
                height={5}
            />
            <ReactNotifications />
            <Component {...pageProps} />
        </StateContext>
    );
}
export default MyApp;
