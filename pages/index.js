import React, { useEffect, useState, useRef } from 'react';
import prisma from '../lib/prisma';

import axios from 'axios';
import Head from 'next/head';

import {
    useDeviceContext,
    useSorteosContext,
    useVentasContext,
} from '../context/StateContext';
import { Layout } from '../layout/Layout';
import { Resumen } from '../components/LandingPage/Resumen/resumen';

const Home = ({ Configuracion }) => {
    const { screenWidth } = useDeviceContext();
    const { setSorteos, setLastSorteoId } = useSorteosContext();
    const { setConfiguracion } = useVentasContext();

    useEffect(() => {
        setConfiguracion(Configuracion);
    }, []);

    return (
        <>
            <Head>
                <title>Agencia 341</title>
                <meta name="description" content="frontmentor challenge" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {screenWidth !== 0 && (
                <Layout>
                    <Resumen></Resumen>
                </Layout>
            )}
        </>
    );
};

export default Home;

export const getStaticProps = async ({ params }) => {
    // const { data } = await axios.get('/api/configuracion');
    const data = await prisma.configuracion.findMany({
        include: {
            vendedor: true,
        },
    });
    const Configuracion = data[0];
    return { props: { Configuracion } };
};
