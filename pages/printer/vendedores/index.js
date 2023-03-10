import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useReactToPrint } from 'react-to-print';

import { ToPrint } from '../../../components/ToPrint/Vendedores';
import {
    useStateContext,
    useVentasContext,
} from '../../../context/StateContext';

const ImprimeVendedores = () => {
    const router = useRouter();
    const componentRef = useRef(null);

    const onBeforeGetContentResolve = useRef(null);

    const [loading, setLoading] = useState(false);
    // const [text, setText] = useState('old boring text');
    const { vendedores } = useVentasContext();
    const { darkMode } = useStateContext();

    const timeNow = new Date();

    const fecha = new Date()
        .toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        })
        .replaceAll('/', '-');
    const time = new Date().toLocaleTimeString('es-AR', {
        hour: 'numeric',
        minute: 'numeric',
    });

    let hora = Array.from(time).map((digit) => {
        return digit === ':' ? 'h' : digit;
    });
    hora.push('m');
    hora = hora.join('');

    const titulo = `ListadoVendedores ${fecha} ${hora}`;

    const handleAfterPrint = useCallback(() => {
        router.push('/vendedores');
    }, []);

    // const handleBeforePrint = useCallback(() => {
    //     console.log('`onBeforePrint` called'); // tslint:disable-line no-console
    // }, []);

    const handleOnBeforeGetContent = useCallback(() => {
        setLoading(true);

        return new Promise((resolve) => {
            onBeforeGetContentResolve.current = resolve;

            setTimeout(() => {
                setLoading(false);
                // setText('New, Updated Text!');
                resolve();
            }, 3000);
        });
    }, [setLoading]);

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: titulo,
        onBeforeGetContent: handleOnBeforeGetContent,
        // onBeforePrint: handleBeforePrint,
        onAfterPrint: handleAfterPrint,
        removeAfterPrint: true,
    });

    // useEffect(() => {
    //     if (
    //         text === 'New, Updated Text!' &&
    //         typeof onBeforeGetContentResolve.current === 'function'
    //     ) {
    //         onBeforeGetContentResolve.current();
    //     }
    // }, [onBeforeGetContentResolve.current, text]);

    useEffect(() => {
        setTimeout(() => {
            handlePrint();
        }, 2000);
    }, []);

    return (
        <div>
            {loading && <p className="indicator">Creando Impresi??n...</p>}
            <ToPrint
                ref={componentRef}
                vendedores={vendedores}
                darkMode={darkMode}
            />
        </div>
    );
};

export default ImprimeVendedores;
