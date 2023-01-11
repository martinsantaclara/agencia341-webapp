import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useReactToPrint } from 'react-to-print';

import {
    useResumenContext,
    useVentasContext,
} from '../../../../context/StateContext';
// import { ToPrint } from '../../../../components/ToPrint/Resumenes/porfecha';
import { ToPrint } from '../../../../components/ToPrint/Resumenes';

const ImprimeResumenPorFecha = () => {
    const router = useRouter();
    const componentRef = useRef(null);

    const onBeforeGetContentResolve = useRef(null);

    const [loading, setLoading] = useState(false);
    // const [text, setText] = useState('old boring text');
    const { resumenxmaquina, totalesResumen } = useResumenContext();
    const { tituloReporte } = useVentasContext();

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
    const titulo = `Resumen Mensual ${fecha} ${hora}`;

    const handleAfterPrint = useCallback(() => {
        router.push('/');
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
            {loading && <p className="indicator">Creando Impresión...</p>}
            <ToPrint
                ref={componentRef}
                ventas={resumenxmaquina}
                resumenDiario={totalesResumen}
                tituloReporte={tituloReporte}
                reporte
                resumen={false}
                mensual={true}
            />
        </div>
    );
};

export default ImprimeResumenPorFecha;
