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
} from '../../components/LandingPage/Resumen/resumenStyles';
import { CardHeader } from 'reactstrap';
import { formatoFechaMensual } from '../../utils/handleFechas';

import axios from 'axios';
import {
    useStateContext,
    useResumenContext,
    useVentasContext,
} from '../../context/StateContext';

import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import es from 'date-fns/locale/es'; // the locale you want
import Totales from '../../components/LandingPage/Totales/totales';

import { Layout } from '../../layout/Layout';

import toast, { Toaster } from 'react-hot-toast';
import handleNotifications from '../../utils/handleNotifications';
import ReactTooltip from 'react-tooltip';

import { HeadDatagrid } from '../../components/LandingPage/Datagrid/HeadDatagrid';
import { TitleCardHeader } from '../../styles/globals';

import Dialog from '../../components/Commons/DialogBox/dialog';

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

const CalculoVentasxDia = (ventas) => {
    const ventasxdia = ventas.reduce(
        (acc, actual) => {
            acc.VentaAgencia += parseFloat(actual.VentaAgencia);
            acc.VentaVendedores += parseFloat(actual.VentaVendedores);
            acc.ComisionAgencia += actual.ComisionAgencia;
            acc.ComisionVendedores += actual.ComisionVendedores;
            return acc;
        },
        {
            id: 0,
            VentaAgencia: 0,
            VentaVendedores: 0,
            ComisionAgencia: 0,
            ComisionVendedores: 0,
        }
    );
    return ventasxdia;
};
const CalculoGastosxMes = (resumen) => {
    const gastos = resumen.reduce((acc, actual) => {
        acc += parseFloat(actual.Gastos);
        return acc;
    }, 0);
    return gastos;
};

const obtenerResumenesxdia = async (fechaDesde, fechaHasta) => {
    const { data } = await axios.get(
        `/api/resumenxdia/porfechas/?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`
    );
    return data;
};

const fetchVentas = async (
    fechaDesde,
    fechaHasta,
    modeloCierre,
    setTotalesCierre,
    setGastos,
    setHonorarios,
    setImpuestos,
    setOtros
) => {
    try {
        const { data } = await axios.get(
            `/api/cierremensual/?fecha=${fechaDesde}`
        );
        const cierre = data;
        const resumenes = await obtenerResumenesxdia(fechaDesde, fechaHasta);
        if (resumenes.length === 0) {
            handleNotifications(
                'warning',
                'Cierre Mensual!',
                'No se realizaron  ventas en este mes!!!'
            );
            setTotalesCierre(modeloCierre);
            setGastos(0);
            setImpuestos(0);
            setHonorarios(0);
            setOtros(0);
        } else {
            const totalesMes = CalculoVentasxDia(resumenes);
            if (cierre.length === 0) {
                setTotalesCierre(totalesMes);
                setGastos(CalculoGastosxMes(resumenes));
                setImpuestos(
                    ((totalesMes.VentaAgencia + totalesMes.VentaVendedores) *
                        0.02) /
                        100
                );
                setHonorarios(0);
                setOtros(0);
            } else {
                const cierreMensual = cierre[0];

                if (
                    totalesMes.VentaAgencia + totalesMes.VentaVendedores !==
                    cierreMensual.VentaAgencia + cierreMensual.VentaVendedores
                ) {
                    handleNotifications(
                        'warning',
                        'Cierre Mensual!',
                        'Ya se ha hecho un cierre mensual pero los importes de las ventas mensuales no coinciden. Se actualizarán los valores!!!'
                    );
                    setTotalesCierre({
                        id: cierreMensual.id,
                        VentaAgencia: totalesMes.VentaAgencia,
                        VentaVendedores: totalesMes.VentaVendedores,
                        ComisionAgencia: totalesMes.ComisionAgencia,
                        ComisionVendedores: totalesMes.ComisionVendedores,
                    });
                } else {
                    setTotalesCierre({
                        id: cierreMensual.id,
                        VentaAgencia: cierreMensual.VentaAgencia,
                        VentaVendedores: cierreMensual.VentaVendedores,
                        ComisionAgencia: cierreMensual.ComisionAgencia,
                        ComisionVendedores: cierreMensual.ComisionVendedores,
                    });
                }
                setGastos(cierreMensual.Gastos);
                setHonorarios(cierreMensual.Honorarios);
                setImpuestos(cierreMensual.Impuestos);
                setOtros(cierreMensual.Otros);
            }
        }
    } catch (error) {
        handleNotifications(
            'danger',
            'Error inesperado!',
            'Contáctese con su Administrador!!!'
        );
    }
};

function getFirstDayOfMonth1(year, month) {
    return new Date(year, month, 1);
}

// 👇️ First day of CURRENT MONTH

const getFirstDayOfMonth = () => {
    const date = new Date();
    const firstDayCurrentMonth = getFirstDayOfMonth1(
        date.getFullYear(),
        date.getMonth()
    );
    return firstDayCurrentMonth;
};

const Resumen = () => {
    const [fechaDesde, setFechaDesde] = useState(
        formatoFecha(getFirstDayOfMonth())
    );
    const [fechaHasta, setFechaHasta] = useState(formatoFecha(new Date()));

    const [pickerDesde, setPickerDesde] = useState(getFirstDayOfMonth());

    const {
        setCierre,
        modeloCierre,
        totalesCierre,
        setTotalesCierre,
        gastos,
        setGastos,
        honorarios,
        setHonorarios,
        impuestos,
        setImpuestos,
        otros,
        setOtros,
    } = useResumenContext();

    // const [totalesResumen, setTotalesResumen] = useState(modeloResumen);
    // const [gastos, setGastos] = useState(0);
    // const [honorarios, setHonorarios] = useState(0);
    // const [impuestos, setImpuestos] = useState(0);
    // const [otros, setOtros] = useState(0);

    const [dialogBox, setDialogBox] = useState(false);

    const { tituloReporte, setTituloReporte } = useVentasContext();

    const { activeContainer, setActiveContainer } = useStateContext();

    const refPickerDesde = useRef();
    const refPrinter = useRef();
    const refBtnGuardar = useRef();

    const router = useRouter();

    const handleFecha = () => {
        let firstDayOffMonth = formatoFecha(pickerDesde);
        let lastDayOffMonth = new Date(
            pickerDesde.getFullYear(),
            pickerDesde.getMonth() + 1,
            0
        );
        lastDayOffMonth = formatoFecha(lastDayOffMonth);

        const hoy = formatoFecha(new Date());
        if (firstDayOffMonth.length !== 10 || firstDayOffMonth > hoy) {
            handleNotifications(
                'warning',
                'Fecha Resumen',
                firstDayOffMonth.length !== 10
                    ? 'Ha introducido un mes incorrecto!!!'
                    : 'No puede ingresar un mes posterior al actual!!!'
            );

            setTimeout(() => {
                setPickerDesde(new Date(fechaDesde.concat(' 00:00:00')));
                refPickerDesde.current.setFocus();
            }, 5500);
        } else {
            setFechaDesde(firstDayOffMonth);
            setFechaHasta(lastDayOffMonth);
            refPrinter.current.focus();
        }
    };

    const actualizaDatos = async () => {
        if (totalesCierre.VentaAgencia + totalesCierre.VentaVendedores === 0) {
            handleNotifications(
                'warning',
                'Cierre Mensual!',
                'No se realizaron ventas en este mes!!!'
            );
        } else {
            setDialogBox(true);
        }
    };

    const actualiza = async () => {
        const result = await toast.promise(
            cierreMensual(),
            {
                loading: <b>Realizando Cierre Mensual</b>,
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

    const cierreMensual = async () => {
        const cierre = {
            id: totalesCierre.id,
            Fecha: fechaDesde,
            VentaAgencia: totalesCierre.VentaAgencia,
            VentaVendedores: totalesCierre.VentaVendedores,
            ComisionAgencia: totalesCierre.ComisionAgencia,
            ComisionVendedores: totalesCierre.ComisionVendedores,
            Gastos: gastos,
            Honorarios: honorarios,
            Impuestos: impuestos,
            Otros: otros,
        };

        const body = cierre;
        const header = {
            'Content-Type': 'application/json;charset=utf-8',
        };

        if (cierre.id == 0) {
            const { data } = await axios.post(
                `/api/cierremensual`,
                body,
                header
            );
            return data;
        } else {
            const { data } = await axios.put(
                `/api/cierremensual`,
                body,
                header
            );
            return data;
        }
    };

    useEffect(() => {
        setTituloReporte(`Mes de ${formatoFechaMensual(fechaDesde)}`);
        fetchVentas(
            fechaDesde,
            fechaHasta,
            modeloCierre,
            setTotalesCierre,
            setGastos,
            setHonorarios,
            setImpuestos,
            setOtros
        );
    }, [fechaDesde, fechaHasta]);

    useEffect(() => {
        setCierre('Cierre Mensual');
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
                    }}
                >
                    <TitleCardHeader>Cierre Mensual</TitleCardHeader>
                    <Link
                        href={`/printer/cierremensual`}
                        passHref
                        prefetch={false}
                    >
                        <a ref={refPrinter}>
                            <Printer
                                src="/assets/imagenes/print-icon.png"
                                alt="imprime cierre mensual"
                                data-tip="Imprime Cierre Mensual"
                            />
                        </a>
                    </Link>
                </CardHeader>
                <ResumenWrapper print={true} reporte>
                    <ResumenContent>
                        <HeadResumen reporte>
                            <FechaContainer>
                                <TitleResumen reporte>Mes</TitleResumen>
                                <FechaPicker
                                    selected={pickerDesde}
                                    onChange={(fechaDesde) =>
                                        setPickerDesde(fechaDesde)
                                    }
                                    dateFormat="MM/yyyy"
                                    showMonthYearPicker
                                    locale="es"
                                    ref={refPickerDesde}
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
                            cierre={'Cierre Mensual'}
                            refBtnGuardar={refBtnGuardar}
                            importeGastos={gastos}
                            setImporteGastos={setGastos}
                            honorarios={honorarios}
                            setHonorarios={setHonorarios}
                            impuestos={impuestos}
                            setImpuestos={setImpuestos}
                            otros={otros}
                            setOtros={setOtros}
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
                        primaryMessage={`Confirma ${
                            totalesCierre.id === 0
                                ? 'Creación'
                                : 'Actualización'
                        } del Cierre Mensual`}
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
