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
    RowContainerVendedor,
} from '../../../components/LandingPage/Datagrid/DatagridStyles';
import {
    ImporteVenta,
    Vendedor,
} from '../../../components/LandingPage/Totales/totalesStyles';
import { HeadDatagridContainerVendedor } from '../../../components/LandingPage/Datagrid/HeadDatagrid';
import { TitleCardHeader } from '../../../styles/globals';
import { formatoFechaLarga } from '../../../utils/handleFechas';
import {
    CalculoVentasxMaquina,
    CalculoVentasxDia,
} from '../../../utils/handleVentas';
import {
    ImprimeCheck,
    LabelImprimeCheck,
} from '../../../components/Commons/DialogBox/dialogStyles';
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

const CalculoVentasxVendedor = (ventas, idVendedorAgencia) => {
    const ventasxvendedor = ventas.reduce(
        (vtaVendedor, venta) => {
            if (venta.vendedorId === idVendedorAgencia) {
                // vtaVendedor[0].Fecha = venta.FechaVenta;
                vtaVendedor[0].Venta += parseFloat(venta.ImporteVenta);
            } else {
                const index = vtaVendedor.findIndex(
                    (vta) => vta.vendedorId === venta.vendedorId
                );
                if (index !== -1) {
                    vtaVendedor[index].Venta += parseFloat(venta.ImporteVenta);
                    vtaVendedor[index].Comision += venta.ComisionVendedor;
                } else {
                    vtaVendedor.push({
                        vendedor:
                            venta.vendedor.ApellidoVendedor +
                            ' ' +
                            venta.vendedor.NombreVendedor,
                        vendedorId: venta.vendedorId,
                        Venta: parseFloat(venta.ImporteVenta),
                        Comision: venta.ComisionVendedor,
                    });
                }
            }
            vtaVendedor[0].Comision += venta.ComisionAgencia;
            return vtaVendedor;
        },
        [
            {
                vendedor: 'Agencia',
                vendedorId: idVendedorAgencia,
                Venta: 0,
                Comision: 0,
            },
        ]
    );
    ventasxvendedor.sort(function (a, b) {
        return b.Venta - a.Venta;
    });

    return ventasxvendedor;
};

const fetchVentas = async (
    setVentasxvendedor,
    fechaDesde,
    fechaHasta,
    idVendedorAgencia
) => {
    try {
        const { data } = await axios.get(
            `/api/ventas/reportes/?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`
        );
        const ventas = data;

        if (ventas.length === 0) {
            handleNotifications(
                'warning',
                'Reporte de Vendedores!',
                'No hay datos para esas fechas!!!'
            );
            setVentasxvendedor([]);
        } else {
            const ventasxvendedor = CalculoVentasxVendedor(
                ventas,
                idVendedorAgencia
            );
            setVentasxvendedor(ventasxvendedor);
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
    const [pickerHasta, setPickerHasta] = useState(new Date());

    const [noShowMoneda, setNoShowMoneda] = useState(false);

    const {
        configuracion,
        setConfiguracion,
        tituloReporte,
        setTituloReporte,
        ventasxvendedor,
        setVentasxvendedor,
        soloAgencia,
        setSoloAgencia,
        soloVendedores,
        setSoloVendedores,
    } = useVentasContext();

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
                'Fecha Reporte',
                nuevaFecha.length !== 10
                    ? 'Ha introducido una fecha incorrecta!!!'
                    : 'No puede ingresar una fecha posterior a la de hoy!!!'
            );

            setTimeout(() => {
                setPickerDesde(new Date(fechaDesde.concat(' 00:00:00')));
                refPickerDesde.current.setFocus();
            }, 5500);
        } else {
            setFechaDesde(nuevaFechaDesde);
        }

        const nuevaFechaHasta = formatoFecha(pickerHasta);
        if (
            nuevaFechaHasta.length !== 10 ||
            nuevaFechaHasta > hoy ||
            nuevaFechaDesde > nuevaFechaHasta
        ) {
            handleNotifications(
                'warning',
                'Fecha Reporte',
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
            setFechaHasta(nuevaFechaHasta);
            refPrinter.current.focus();
        }
    };

    useEffect(() => {
        if (fechaDesde <= fechaHasta) {
            if (fechaDesde === fechaHasta) {
                setTituloReporte(formatoFechaLarga(fechaHasta, false, true));
            } else {
                setTituloReporte(
                    `Del ${formatoFechaLarga(
                        fechaDesde,
                        true
                    )} al ${formatoFechaLarga(fechaHasta, false, true)}`
                );
            }
            // const ObtenerConfiguracion = async () => {
            //     const { data } = await axios.get('/api/configuracion');
            //     setConfiguracion(data[0]);
            // };
            if (idVendedorAgencia === undefined) {
                obtenerConfiguracion(setConfiguracion);
            }
            fetchVentas(
                setVentasxvendedor,
                fechaDesde,
                fechaHasta,
                idVendedorAgencia
            );
        }
    }, [fechaDesde, fechaHasta, idVendedorAgencia]);

    useEffect(() => {
        setActiveContainer(true);
    }, []);

    const handleSoloAgencia = () => {
        setSoloAgencia((prev) => !prev);
        setSoloVendedores(false);
    };
    const handleSoloVendedores = () => {
        setSoloVendedores((prev) => !prev);
        setSoloAgencia(false);
    };

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
                    <TitleCardHeader>Reporte Vendedores</TitleCardHeader>
                    <Link
                        href={`/printer/vendedores/reporte`}
                        passHref
                        prefetch={false}
                    >
                        <a ref={refPrinter}>
                            <Printer
                                src="/assets/imagenes/print-icon.png"
                                alt="imprime reporte vendedores"
                                data-tip="Imprime reporte vendedores"
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
                                <BtnIr
                                    onClick={handleFecha}
                                    tabIndex={0}
                                    reporte
                                    activeContainer={activeContainer}
                                >
                                    Ir
                                </BtnIr>
                            </FechaContainer>
                            <LabelImprimeCheck>
                                <ImprimeCheck
                                    type="checkbox"
                                    checked={soloAgencia}
                                    onChange={handleSoloAgencia}
                                />
                                Sólo Agencia
                            </LabelImprimeCheck>
                            <LabelImprimeCheck>
                                <ImprimeCheck
                                    type="checkbox"
                                    checked={soloVendedores}
                                    onChange={handleSoloVendedores}
                                />
                                Sólo Vendedores
                            </LabelImprimeCheck>
                        </HeadResumen>

                        {/* (showAllVendedores ||
                                        venta.vendedorId !==
                                            idVendedorAgencia)             */}

                        <h5
                            style={{
                                textAlign: 'center',
                                paddingTop: '0.5rem',
                            }}
                        >
                            {tituloReporte}
                        </h5>
                        <HeadDatagridContainerVendedor></HeadDatagridContainerVendedor>
                        {ventasxvendedor.length > 0 &&
                            ventasxvendedor.map((venta, index) => {
                                return (
                                    ((soloAgencia &&
                                        venta.vendedorId ===
                                            idVendedorAgencia) ||
                                        (soloVendedores &&
                                            venta.vendedorId !==
                                                idVendedorAgencia) ||
                                        (!soloAgencia && !soloVendedores)) && (
                                        <RowContainerVendedor
                                            key={index}
                                            print={true}
                                            reporte
                                        >
                                            {/* <NumeroMaquina>
                                            {venta.NroMaquina}
                                        </NumeroMaquina> */}
                                            <Vendedor vendedor>
                                                {venta.vendedor}
                                            </Vendedor>
                                            <ImporteVenta
                                                print
                                                noShowMoneda={noShowMoneda}
                                                reporte={true}
                                            >
                                                {parseFloat(
                                                    venta?.Venta
                                                ).toFixed(2)}
                                            </ImporteVenta>

                                            <ComisionVendedor
                                                print
                                                reporte={true}
                                            >
                                                {venta.Comision.toFixed(2)}
                                            </ComisionVendedor>
                                        </RowContainerVendedor>
                                    )
                                );
                            })}
                    </ResumenContent>
                </ResumenWrapper>
                <Toaster />
                <ReactTooltip type="info" />
            </ResumenContainer>
        </Layout>
    );
};

export default Resumen;
