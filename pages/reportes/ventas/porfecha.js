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
    TipoSorteo,
} from '../../../components/LandingPage/Resumen/resumenStyles';
import { CardHeader } from 'reactstrap';

import axios from 'axios';
import {
    useSorteosContext,
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
import { formatoFechaLarga } from '../../../utils/handleFechas';
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
    setVentas,
    fechaDesde,
    fechaHasta,
    setResumenDiario,
    idVendedorAgencia,
    sorteoId
) => {
    try {
        const { data } = await axios.get(
            `/api/ventas/reportes/porsorteo/?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}&sorteoId=${sorteoId}`
        );
        const ventas = data;
        const ventasxmaquina = CalculoVentasxMaquina(ventas, idVendedorAgencia);

        if (ventasxmaquina.length === 0) {
            handleNotifications(
                'warning',
                'Reporte de Ventas!',
                'No hay datos para esas fechas!!!'
            );
        }
        setVentas(ventasxmaquina);
        setResumenDiario(CalculoVentasxDia(ventasxmaquina));
    } catch (error) {
        handleNotifications(
            'danger',
            'Error inesperado!',
            'Cont??ctese con su Administrador!!!'
        );
    }
};

function getFirstDayOfMonth1(year, month) {
    return new Date(year, month, 1);
}

// ??????? First day of CURRENT MONTH

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
    const [pickerHasta, setPickerHasta] = useState(new Date());

    const [noShowMoneda, setNoShowMoneda] = useState(false);

    const {
        ventas,
        setVentas,
        resumenDiario,
        setResumenDiario,
        configuracion,
        setConfiguracion,
        tituloReporte,
        setTituloReporte,
    } = useVentasContext();

    const { sorteos, setSorteos } = useSorteosContext();
    const [sorteoIdRef, setSorteoIdRef] = useState();
    const [sorteoId, setSorteoId] = useState();
    const [tipoSorteo, setTipoSorteo] = useState('');
    const refSorteo = useRef();

    const { activeContainer, setActiveContainer } = useStateContext();

    const idVendedorAgencia = configuracion.idVendedorAgencia;
    const porcentajeAgencia = configuracion.PorcentajeAgencia;
    const porcentajeVendedores = configuracion.PorcentajeVendedores;

    const refPickerDesde = useRef();
    const refPickerHasta = useRef();
    const refPrinter = useRef();

    const router = useRouter();

    const handleFecha = () => {
        const nuevaFechaDesde = formatoFecha(pickerDesde);
        const hoy = formatoFecha(new Date());
        if (nuevaFechaDesde.length !== 10 || nuevaFechaDesde > hoy) {
            handleNotifications(
                'warning',
                'Fecha Resumen',
                nuevaFechaDesde.length !== 10
                    ? 'Ha introducido una fecha incorrecta!!!'
                    : 'No puede ingresar una fecha posterior a la de hoy!!!'
            );

            setTimeout(() => {
                setPickerDesde(new Date(fechaDesde.concat(' 00:00:00')));
                refPickerDesde.current.setFocus();
            }, 5500);
        } else {
            setFechaDesde(nuevaFechaDesde);
            const nuevaFechaHasta = formatoFecha(pickerHasta);
            if (
                nuevaFechaHasta.length !== 10 ||
                nuevaFechaHasta > hoy ||
                nuevaFechaDesde > nuevaFechaHasta
            ) {
                handleNotifications(
                    'warning',
                    'Fecha Resumen',
                    nuevaFechaHasta.length !== 10
                        ? 'Ha introducido una fecha incorrecta!!!'
                        : nuevaFechaHasta > hoy
                        ? 'No puede ingresar una fecha posterior a la de hoy!!!'
                        : 'La fecha Hasta debe ser mayor a la fecha Desde!!!'
                );

                setTimeout(() => {
                    setPickerHasta(new Date(fechaHasta.concat(' 00:00:00')));
                    refPickerHasta.current.setFocus();
                }, 5500);
            } else {
                setTipoSorteo(refSorteo.current.value);
                setFechaHasta(nuevaFechaHasta);
                setSorteoId(sorteoIdRef);
                refPrinter.current.focus();
            }
        }
    };

    const handleSorteo = (e) => {
        const index = e.target.options.selectedIndex;
        setSorteoIdRef(parseInt(e.target.options[index].id));
    };

    const ObtenerSorteos = async () => {
        const { data } = await axios.get(`/api/sorteos`);
        const sorteos = data;
        setSorteos(sorteos);
        setSorteoId(sorteos[0].id);
        setTipoSorteo(sorteos[0].NombreSorteo);
    };

    useEffect(() => {
        if (fechaDesde <= fechaHasta) {
            const yearDesde = fechaDesde.substring(0, 4);
            const yearHasta = fechaHasta.substring(0, 4);
            if (fechaDesde === fechaHasta) {
                setTituloReporte(
                    `${formatoFechaLarga(
                        fechaHasta,
                        false,
                        true
                    )}- ${tipoSorteo}`
                );
            } else {
                setTituloReporte(
                    `Del ${formatoFechaLarga(
                        fechaDesde,
                        true,
                        yearDesde !== yearHasta
                    )} al ${formatoFechaLarga(
                        fechaHasta,
                        false,
                        true
                    )} - ${tipoSorteo}`
                );
            }
            if (idVendedorAgencia === undefined) {
                obtenerConfiguracion(setConfiguracion);
            }
            if (sorteoId === undefined) {
                ObtenerSorteos();
            } else {
                fetchVentas(
                    setVentas,
                    fechaDesde,
                    fechaHasta,
                    setResumenDiario,
                    idVendedorAgencia,
                    sorteoId
                );
            }
        }
    }, [fechaDesde, fechaHasta, sorteoId, idVendedorAgencia]);

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
                    <TitleCardHeader>Reporte Resumen Por Fecha</TitleCardHeader>
                    <Link
                        href={`/printer/ventas/reporte/porfecha`}
                        passHref
                        prefetch={false}
                    >
                        <a ref={refPrinter}>
                            <Printer
                                src="/assets/imagenes/print-icon.png"
                                alt="imprime resumen por fecha"
                                data-tip="Imprime resumen por fecha"
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
                                    dateFormat="dd/MM/yyyy"
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
                                    dateFormat="dd/MM/yyyy"
                                    locale="es"
                                    ref={refPickerHasta}
                                    reporte
                                    onFocus={() => setNoShowMoneda(true)}
                                    onBlur={() => setNoShowMoneda(false)}
                                />
                                <TipoSorteo
                                    name="sorteo"
                                    ref={refSorteo}
                                    onChange={handleSorteo}
                                    // value={tipoSorteo}
                                    // defaultValue={
                                    //     maquina.vendedor?.ApellidoVendedor
                                    // }
                                >
                                    {sorteos.length !== 0 &&
                                        sorteos.map((sorteo, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={sorteo.NombreSorteo}
                                                    id={sorteo.id}
                                                    style={{
                                                        color: 'hsl(219 29% 14%)',
                                                        backgroundColor:
                                                            'white',
                                                    }}
                                                >
                                                    {sorteo.NombreSorteo}
                                                </option>
                                            );
                                        })}
                                </TipoSorteo>
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

                        {ventas.length > 0 &&
                            ventas.map((venta, index) => {
                                return (
                                    <RowContainer
                                        key={index}
                                        print={true}
                                        reporte
                                    >
                                        <NumeroMaquina>
                                            {venta.NroMaquina}
                                        </NumeroMaquina>
                                        <Vendedor>{venta.Vendedor}</Vendedor>
                                        <ImporteVenta
                                            print
                                            noShowMoneda={noShowMoneda}
                                            reporte={true}
                                        >
                                            {parseFloat(
                                                venta?.ImporteVenta
                                            ).toFixed(2)}
                                        </ImporteVenta>

                                        <ComisionVendedor print reporte={true}>
                                            {venta.ComisionVendedor.toFixed(2)}
                                        </ComisionVendedor>
                                        <ComisionAgencia print reporte={true}>
                                            {/* {!venta.vendedor.Agencia
                                    ? `$ ${comisionVendedor.toFixed(2)}`
                                    : ' '}{' '} */}
                                            {venta.ComisionAgencia.toFixed(2)}
                                        </ComisionAgencia>
                                    </RowContainer>
                                );
                            })}

                        <Totales
                            resumenDiario={resumenDiario}
                            print={true}
                            reporte={true}
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
