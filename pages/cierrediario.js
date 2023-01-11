import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
    BtnGuardar,
    ResumenContent,
    ResumenWrapper,
    ResumenContainer,
    FechaContainer,
    BtnIr,
    FechaPicker,
    TitleResumen,
    HeadResumen,
    Printer,
} from '../components/LandingPage/Resumen/resumenStyles';
import { CardHeader } from 'reactstrap';

import axios from 'axios';
import {
    useStateContext,
    useResumenContext,
    useVentasContext,
} from '../context/StateContext';

import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import es from 'date-fns/locale/es'; // the locale you want
import Totales from '../components/LandingPage/Totales/totales';

import { Layout } from '../layout/Layout';

import toast, { Toaster } from 'react-hot-toast';
import handleNotifications from '../utils/handleNotifications';
import ReactTooltip from 'react-tooltip';
import {
    ComisionAgencia,
    ComisionVendedor,
    ImporteWrapper,
    NumeroMaquina,
    RowContainer,
} from '../components/LandingPage/Datagrid/DatagridStyles';
import {
    ImporteVenta,
    Vendedor,
} from '../components/LandingPage/Totales/totalesStyles';
import { HeadDatagrid } from '../components/LandingPage/Datagrid/HeadDatagrid';
import { TitleCardHeader } from '../styles/globals';
import { formatoFechaLarga } from '../utils/handleFechas';
import {
    CalculoVentasxMaquina,
    CalculoVentasxDia,
} from '../utils/handleVentas';
import { obtenerConfiguracion } from '../services/configuracion';

import Dialog from '../components/Commons/DialogBox/dialog';

registerLocale('es', es); // register it with the name you want

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

export function formatoFecha(fecha) {
    return [
        fecha.getFullYear(),
        padTo2Digits(fecha.getMonth() + 1),
        padTo2Digits(fecha.getDate()),
    ].join('-');
}

const fetchVentas = async (
    fecha,
    modeloCierre,
    setTotalesCierre,
    setGastos
) => {
    try {
        const { data } = await axios.get(`/api/resumenxdia/?fecha=${fecha}`);
        const resumenDia = data;

        if (resumenDia.length === 0) {
            handleNotifications(
                'warning',
                'Cierre del día!',
                'No se realizaron ventas en esta fecha!!!'
            );
            setTotalesCierre(modeloCierre);
            setGastos(0);
        } else {
            setTotalesCierre(resumenDia[0]);
            setGastos(resumenDia[0].Gastos);
        }
    } catch (error) {
        handleNotifications(
            'danger',
            'Error inesperado!',
            'Contáctese con su Administrador!!!'
        );
    }
};

const Resumen = () => {
    const [fecha, setFecha] = useState(formatoFecha(new Date()));

    const [datePicker, setDatePicker] = useState(new Date());

    const {
        setCierre,
        modeloCierre,
        totalesCierre,
        setTotalesCierre,
        gastos,
        setGastos,
    } = useResumenContext();
    const [] = useState(0);
    const [dialogBox, setDialogBox] = useState(false);

    const { tituloReporte, setTituloReporte } = useVentasContext();

    const { activeContainer, setActiveContainer } = useStateContext();

    const refDatePicker = useRef();
    const refPrinter = useRef();
    const refBtnGuardar = useRef();

    const router = useRouter();

    const handleFecha = () => {
        const nuevaFecha = formatoFecha(datePicker);
        const hoy = formatoFecha(new Date());
        if (nuevaFecha.length !== 10 || nuevaFecha > hoy) {
            handleNotifications(
                'warning',
                'Fecha Cierre Diario',
                nuevaFecha.length !== 10
                    ? 'Ha introducido una fecha incorrecta!!!'
                    : 'No puede ingresar una fecha posterior a la de hoy!!!'
            );

            setTimeout(() => {
                setDatePicker(new Date(fecha.concat(' 00:00:00')));
                refDatePicker.current.setFocus();
            }, 5500);
        } else {
            setFecha(nuevaFecha);
            refPrinter.current.focus();
        }
    };

    const actualizaDatos = async () => {
        if (totalesCierre.VentaAgencia + totalesCierre.VentaVendedores === 0) {
            handleNotifications(
                'warning',
                'Cierre del día!',
                'No se realizaron ventas en esta fecha!!!'
            );
        } else {
            setDialogBox(true);
        }
    };

    const actualiza = async () => {
        const result = await toast.promise(
            cierreDiario(),
            {
                loading: <b>Realizando Cierre Diario</b>,
                error: (err) => {
                    const error = err.response.data;
                    handleNotifications(error.type, error.title, error.message);
                    setTimeout(() => {
                        setDialogBox(false);
                    }, 3000);
                },
                success: (data) => {
                    handleNotifications(data.type, data.title, data.message);
                    setTimeout(() => {
                        setDialogBox(false);
                    }, 3000);
                },
            },
            {
                success: {
                    duration: 1,
                },
                error: {
                    duration: 1,
                },
                loading: {
                    style: {
                        backgroundColor: '#2f96b4',
                        padding: '10px',
                        color: '#ffffff',
                    },
                },
            }
        );
    };

    const cierreDiario = async () => {
        const id = totalesCierre.id;
        const Gastos = gastos;
        const body = { id, Gastos };
        const header = {
            'Content-Type': 'application/json;charset=utf-8',
        };
        const { data } = await axios.put(`/api/resumenxdia`, body, header);
        return data;
    };

    useEffect(() => {
        setTituloReporte(formatoFechaLarga(fecha));
        fetchVentas(fecha, modeloCierre, setTotalesCierre, setGastos);
    }, [fecha]);

    useEffect(() => {
        setCierre('Cierre Diario');
        setActiveContainer(true);
    }, []);

    return (
        <Layout>
            <ResumenContainer print={true} reporte>
                <CardHeader
                    style={{
                        backgroundColor: 'hsl(235 69% 61%)',
                        color: 'hsl(0 0% 100%)',
                        fontSize: '1rem',
                        fontWeight: '600',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.25rem 2rem',
                        borderRadius: '6px 6px 0 0',
                        height: '72px',
                    }}
                >
                    <TitleCardHeader>Cierre Diario</TitleCardHeader>
                    <Link
                        href={`/printer/cierremensual`}
                        passHref
                        prefetch={false}
                    >
                        <a ref={refPrinter}>
                            <Printer
                                src="/assets/imagenes/print-icon.png"
                                alt="imprime cierre diario"
                                data-tip="Imprime Cierre Diario"
                            />
                        </a>
                    </Link>
                </CardHeader>
                <ResumenWrapper print={true} reporte>
                    <ResumenContent>
                        <HeadResumen reporte>
                            <FechaContainer>
                                <TitleResumen reporte>Día</TitleResumen>
                                <FechaPicker
                                    selected={datePicker}
                                    onChange={(fecha) => setDatePicker(fecha)}
                                    dateFormat="dd/MM/yyyy"
                                    locale="es"
                                    ref={refDatePicker}
                                    reporte
                                />

                                <BtnIr
                                    onClick={handleFecha}
                                    tabIndex={0}
                                    reporte
                                    activeContainer={activeContainer}
                                >
                                    Ir
                                </BtnIr>
                            </FechaContainer>
                        </HeadResumen>
                        <h5
                            style={{
                                textAlign: 'center',
                                paddingTop: '0.5rem',
                            }}
                        >
                            {tituloReporte}
                        </h5>
                        <HeadDatagrid
                            cierre={true}
                            print={true}
                            reporte={true}
                        ></HeadDatagrid>
                        <Totales
                            resumenDiario={totalesCierre}
                            print={true}
                            reporte={true}
                            cierre={'Cierre Diario'}
                            refBtnGuardar={refBtnGuardar}
                            importeGastos={gastos}
                            setImporteGastos={setGastos}
                        ></Totales>
                    </ResumenContent>
                </ResumenWrapper>
                <BtnGuardar
                    actualiza
                    onClick={actualizaDatos}
                    ref={refBtnGuardar}
                    tabIndex={0}
                    disable={
                        totalesCierre.VentaAgencia +
                            totalesCierre.VentaVendedores ===
                        0
                    }
                    cierre
                >
                    Confirma
                </BtnGuardar>
                {dialogBox && (
                    <Dialog
                        primaryMessage={`Confirma Cierre Diario`}
                        imprime={false}
                        setDialogBox={setDialogBox}
                        clickSubmit={actualiza}
                    />
                )}
                <Toaster />
                <ReactTooltip type="info" />
            </ResumenContainer>
        </Layout>
    );
};

export default Resumen;
