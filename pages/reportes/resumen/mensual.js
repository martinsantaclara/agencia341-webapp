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
} from '../../../components/LandingPage/Resumen/resumenStyles';
import { CardHeader } from 'reactstrap';

import axios from 'axios';
import {
    useResumenContext,
    useStateContext,
    useVentasContext,
} from '../../../context/StateContext';

import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import es from 'date-fns/locale/es'; // the locale you want
import Totales from '../../../components/LandingPage/Totales/totales';

import { Layout } from '../../../layout/Layout';

import { Toaster } from 'react-hot-toast';
import handleNotifications from '../../../utils/handleNotifications';
import ReactTooltip from 'react-tooltip';
import {
    ComisionAgencia,
    ComisionVendedor,
    ImporteWrapper,
    NumeroMaquina,
    RowContainer,
} from '../../../components/LandingPage/Datagrid/DatagridStyles';
import {
    ImporteVenta,
    Vendedor,
} from '../../../components/LandingPage/Totales/totalesStyles';
import { HeadDatagrid } from '../../../components/LandingPage/Datagrid/HeadDatagrid';
import { TitleCardHeader } from '../../../styles/globals';
import { formatoFechaMensual } from '../../../utils/handleFechas';
import {
    CalculoVentasxMaquina,
    CalculoVentasxDia,
} from '../../../utils/handleVentas';
import { obtenerConfiguracion } from '../../../services/configuracion';

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
    setResumenxmaquina,
    fechaDesde,
    fechaHasta,
    setTotalesResumen,
    idVendedorAgencia
) => {
    try {
        const { data } = await axios.get(
            `/api/resumenxmaquina/reportes/?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`
        );
        const ventas = data;
        const ventasxmaquina = CalculoVentasxMaquina(ventas, idVendedorAgencia);
        if (ventasxmaquina.length === 0) {
            handleNotifications(
                'warning',
                'Reporte de Ventas!',
                'No hay datos para ese mes!!!'
            );
        }
        setResumenxmaquina(ventasxmaquina);
        setTotalesResumen(CalculoVentasxDia(ventasxmaquina));
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
        resumenxmaquina,
        setResumenxmaquina,
        totalesResumen,
        setTotalesResumen,
    } = useResumenContext();
    const { configuracion, setConfiguracion, tituloReporte, setTituloReporte } =
        useVentasContext();

    const { activeContainer, setActiveContainer } = useStateContext();

    const idVendedorAgencia = configuracion.idVendedorAgencia;
    const porcentajeAgencia = configuracion.PorcentajeAgencia;
    const porcentajeVendedores = configuracion.PorcentajeVendedores;

    const refPickerDesde = useRef();
    const refPrinter = useRef();

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

    useEffect(() => {
        setTituloReporte(`Mes de ${formatoFechaMensual(fechaDesde)}`);
        // const ObtenerConfiguracion = async () => {
        //     const { data } = await axios.get('/api/configuracion');
        //     setConfiguracion(data[0]);
        // };
        if (idVendedorAgencia === undefined) {
            obtenerConfiguracion(setConfiguracion);
        }
        fetchVentas(
            setResumenxmaquina,
            fechaDesde,
            fechaHasta,
            setTotalesResumen,
            idVendedorAgencia
        );
    }, [fechaDesde, fechaHasta, idVendedorAgencia]);

    useEffect(() => {
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
                    <TitleCardHeader>Reporte Resumen Mensual</TitleCardHeader>
                    <Link
                        href={`/printer/resumenes/reporte/mensual`}
                        passHref
                        prefetch={false}
                    >
                        <a ref={refPrinter}>
                            <Printer
                                src="/assets/imagenes/print-icon.png"
                                alt="imprime resumen mensual"
                                data-tip="Imprime resumen mensual"
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
                            print={true}
                            reporte={true}
                        ></HeadDatagrid>

                        {resumenxmaquina.length > 0 &&
                            resumenxmaquina.map((resumen, index) => {
                                return (
                                    <RowContainer
                                        key={index}
                                        print={true}
                                        reporte
                                    >
                                        <NumeroMaquina>
                                            {resumen.NroMaquina}
                                        </NumeroMaquina>
                                        <Vendedor>{resumen.Vendedor}</Vendedor>
                                        <ImporteVenta print reporte={true}>
                                            {parseFloat(
                                                resumen?.ImporteVenta
                                            ).toFixed(2)}
                                        </ImporteVenta>

                                        <ComisionVendedor print reporte={true}>
                                            {resumen.ComisionVendedor.toFixed(
                                                2
                                            )}
                                        </ComisionVendedor>
                                        <ComisionAgencia print reporte={true}>
                                            {/* {!venta.vendedor.Agencia
                                    ? `$ ${comisionVendedor.toFixed(2)}`
                                    : ' '}{' '} */}
                                            {resumen.ComisionAgencia.toFixed(2)}
                                        </ComisionAgencia>
                                    </RowContainer>
                                );
                            })}

                        <Totales
                            resumenDiario={totalesResumen}
                            print={true}
                            reporte={true}
                            mensual
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
