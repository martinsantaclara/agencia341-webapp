import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
    ResumenContent,
    ResumenWrapper,
    ResumenContainer,
    FechaContainer,
    BtnIr,
    FechaPicker,
    TitleResumen,
    HeadResumen,
    Printer,
} from '../../../components/LandingPage/Resumen/resumenStyles';
import { CardHeader } from 'reactstrap';
import { formatoFechaMensual } from '../../../utils/handleFechas';

import axios from 'axios';
import {
    useStateContext,
    useResumenContext,
    useVentasContext,
} from '../../../context/StateContext';

import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import es from 'date-fns/locale/es'; // the locale you want
import Totales from '../../../components/LandingPage/Totales/totales';

import { Layout } from '../../../layout/Layout';

import toast, { Toaster } from 'react-hot-toast';
import handleNotifications from '../../../utils/handleNotifications';
import ReactTooltip from 'react-tooltip';

import { HeadDatagrid } from '../../../components/LandingPage/Datagrid/HeadDatagrid';
import { TitleCardHeader } from '../../../styles/globals';

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
const CalculoEgresos = (cierres) => {
    const egresos = cierres.reduce(
        (acc, actual) => {
            acc.gastos += parseFloat(actual.Gastos);
            acc.honorarios += parseFloat(actual.Honorarios);
            acc.impuestos += parseFloat(actual.Impuestos);
            acc.otros += parseFloat(actual.Otros);
            return acc;
        },
        {
            gastos: 0,
            honorarios: 0,
            impuestos: 0,
            otros: 0,
        }
    );
    return egresos;
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
            `/api/cierremensual/reporte/?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`
        );
        const cierres = data;
        if (cierres.length === 0) {
            handleNotifications(
                'warning',
                'Reporte Cierres!',
                'No se realizaron cierres en esos meses!!!'
            );
            setTotalesCierre(modeloCierre);
            setGastos(0);
            setImpuestos(0);
            setHonorarios(0);
            setOtros(0);
        } else {
            const totalesCierres = CalculoVentasxDia(cierres);
            setTotalesCierre(totalesCierres);
            const { gastos, honorarios, impuestos, otros } =
                CalculoEgresos(cierres);
            setGastos(gastos);
            setHonorarios(honorarios);
            setImpuestos(impuestos);
            setOtros(otros);
        }
    } catch (error) {
        handleNotifications(
            'danger',
            'Error inesperado!',
            'Contáctese con su Administrador!!!'
        );
    }
};

const getFirstDayOfYear = () => {
    const date = new Date();
    return new Date(date.getFullYear(), 0, 1);
};

const getLastDayOfMonth = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0);
};

const Resumen = () => {
    const [fechaDesde, setFechaDesde] = useState(
        formatoFecha(getFirstDayOfYear())
    );
    const [fechaHasta, setFechaHasta] = useState(
        formatoFecha(getLastDayOfMonth())
    );
    const [lastDayOfMonth, setLastDayOfMonth] = useState(
        formatoFecha(getLastDayOfMonth())
    );

    const [pickerDesde, setPickerDesde] = useState(getFirstDayOfYear());
    const [pickerHasta, setPickerHasta] = useState(getLastDayOfMonth());

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

    const { tituloReporte, setTituloReporte } = useVentasContext();

    const { activeContainer, setActiveContainer } = useStateContext();

    const refPickerDesde = useRef();
    const refPickerHasta = useRef();
    const refPrinter = useRef();

    const router = useRouter();

    const handleFecha = () => {
        let firstDayOffMonth = formatoFecha(pickerDesde);
        const hoy = formatoFecha(new Date());
        if (firstDayOffMonth.length !== 10 || firstDayOffMonth > hoy) {
            handleNotifications(
                'warning',
                'Fecha Reporte',
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
            let lastDayOffMonth = new Date(
                pickerHasta.getFullYear(),
                pickerHasta.getMonth() + 1,
                0
            );
            lastDayOffMonth = formatoFecha(lastDayOffMonth);
            if (
                lastDayOffMonth.length !== 10 ||
                lastDayOffMonth > lastDayOfMonth ||
                firstDayOffMonth > lastDayOffMonth
            ) {
                handleNotifications(
                    'warning',
                    'Fecha Reporte',
                    lastDayOffMonth.length !== 10
                        ? 'Ha introducido un mes incorrecto!!!'
                        : lastDayOffMonth > lastDayOfMonth
                        ? 'No puede ingresar un mes posterior al actual!!!'
                        : 'El mes Hasta debe ser mayor al mes Desde!!!'
                );
                setTimeout(() => {
                    setPickerHasta(new Date(fechaHasta.concat(' 00:00:00')));
                    refPickerHasta.current.setFocus();
                }, 5500);
            } else {
                setFechaHasta(lastDayOffMonth);
                refPrinter.current.focus();
            }
        }
    };

    useEffect(() => {
        if (fechaDesde <= fechaHasta) {
            const lastDayDesde = formatoFecha(
                new Date(
                    pickerDesde.getFullYear(),
                    pickerDesde.getMonth() + 1,
                    0
                )
            );
            if (lastDayDesde === fechaHasta) {
                setTituloReporte(`Mes de ${formatoFechaMensual(fechaDesde)}`);
            } else {
                setTituloReporte(
                    `De ${formatoFechaMensual(
                        fechaDesde,
                        pickerDesde.getFullYear() === pickerHasta.getFullYear()
                    )} a ${formatoFechaMensual(fechaHasta)}`
                );
            }
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
        }
    }, [fechaDesde, fechaHasta]);

    useEffect(() => {
        setCierre('Reporte de Cierres');
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
                    <TitleCardHeader>
                        Reporte de Cierres Mensuales
                    </TitleCardHeader>
                    <Link
                        href={`/printer/cierremensual`}
                        passHref
                        prefetch={false}
                    >
                        <a ref={refPrinter}>
                            <Printer
                                src="/assets/imagenes/print-icon.png"
                                alt="reporte de cierres mensuales"
                                data-tip="Imprime Reporte de Cierres Mensuales"
                            />
                        </a>
                    </Link>
                </CardHeader>
                <ResumenWrapper print={true} reporte>
                    <ResumenContent>
                        <HeadResumen reporte>
                            <FechaContainer>
                                <TitleResumen reporte>Desde</TitleResumen>
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
                                <TitleResumen reporte reporteHasta>
                                    Hasta
                                </TitleResumen>
                                <FechaPicker
                                    selected={pickerHasta}
                                    onChange={(fechaHasta) =>
                                        setPickerHasta(fechaHasta)
                                    }
                                    dateFormat="MM/yyyy"
                                    showMonthYearPicker
                                    locale="es"
                                    ref={refPickerHasta}
                                    reporte
                                    // onFocus={() => setNoShowMoneda(true)}
                                    // onBlur={() => setNoShowMoneda(false)}
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
                            importeGastos={gastos}
                            setImporteGastos={setGastos}
                            honorarios={honorarios}
                            setHonorarios={setHonorarios}
                            impuestos={impuestos}
                            setImpuestos={setImpuestos}
                            otros={otros}
                            setOtros={setOtros}
                            reporteCierreMensual={true}
                        ></Totales>
                    </ResumenContent>
                </ResumenWrapper>
                <Toaster />
                <ReactTooltip type="info" />
            </ResumenContainer>
        </Layout>
    );
};

export default Resumen;
