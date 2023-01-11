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
    RowContainer,
} from '../../../components/LandingPage/Datagrid/DatagridStyles';
import {
    ImporteVenta,
    Vendedor,
} from '../../../components/LandingPage/Totales/totalesStyles';
import { HeadDatagrid } from '../../../components/LandingPage/Datagrid/HeadDatagrid';
import { TitleCardHeader } from '../../../styles/globals';
import { formatoFechaLarga } from '../../../utils/handleFechas';
import { CalculoVentasxDia } from '../../../utils/handleVentas';
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

const CalculoVentasxMaquina = (ventas, idVendedorAgencia) => {
    const ventasxmaquina = ventas.reduce((vtaMaquina, venta) => {
        const index = vtaMaquina.findIndex(
            (vta) => vta.MaquinaId === venta.maquinaId
        );
        if (index !== -1) {
            vtaMaquina[index].ImporteVenta += parseFloat(venta.ImporteVenta);
            vtaMaquina[index].ComisionVendedor += venta.ComisionVendedor;
            vtaMaquina[index].ComisionAgencia += venta.ComisionAgencia;
        } else {
            vtaMaquina.push({
                MaquinaId: venta.maquinaId,
                NroMaquina: venta.maquina.NroMaquina,
                Descripcion: venta.maquina.Descripcion,
                Agencia: venta.vendedorId === idVendedorAgencia,
                ImporteVenta: parseFloat(venta.ImporteVenta),
                ComisionVendedor: venta.ComisionVendedor,
                ComisionAgencia: venta.ComisionAgencia,
            });
        }

        return vtaMaquina;
    }, []);

    ventasxmaquina.sort(function (a, b) {
        return b.ImporteVenta - a.ImporteVenta;
    });

    return ventasxmaquina;
};

const fetchVentas = async (
    setVentasxmaquina,
    fechaDesde,
    fechaHasta,
    setResumenDiario,
    idVendedorAgencia
) => {
    try {
        const { data } = await axios.get(
            `/api/ventas/reportes/?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`
        );
        const ventas = data;
        const ventasxmaquina = CalculoVentasxMaquina(ventas, idVendedorAgencia);

        if (ventasxmaquina.length === 0) {
            handleNotifications(
                'warning',
                'Reporte de Máquinas!',
                'No hay datos para esas fechas!!!'
            );
        }
        setVentasxmaquina(ventasxmaquina);
        setResumenDiario(CalculoVentasxDia(ventasxmaquina));
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

const ResumenxMaquina = () => {
    const [fechaDesde, setFechaDesde] = useState(
        formatoFecha(getFirstDayOfMonth())
    );
    const [fechaHasta, setFechaHasta] = useState(formatoFecha(new Date()));

    const [pickerDesde, setPickerDesde] = useState(getFirstDayOfMonth());
    const [pickerHasta, setPickerHasta] = useState(new Date());

    const [noShowMoneda, setNoShowMoneda] = useState(false);

    const {
        resumenDiario,
        setResumenDiario,
        configuracion,
        setConfiguracion,
        tituloReporte,
        setTituloReporte,
        ventasxmaquina,
        setVentasxmaquina,
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
                setVentasxmaquina,
                fechaDesde,
                fechaHasta,
                setResumenDiario,
                idVendedorAgencia
            );
        }
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
                    <TitleCardHeader>Reporte Máquinas</TitleCardHeader>
                    <Link
                        href={`/printer/maquinas/reporte`}
                        passHref
                        prefetch={false}
                    >
                        <a ref={refPrinter}>
                            <Printer
                                src="/assets/imagenes/print-icon.png"
                                alt="imprime reporte máquinas"
                                data-tip="Imprime reporte máquinas"
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
                            maquina={true}
                        ></HeadDatagrid>

                        {ventasxmaquina.length > 0 &&
                            ventasxmaquina.map((venta, index) => {
                                return (
                                    <RowContainer
                                        key={index}
                                        print={true}
                                        reporte
                                    >
                                        <NumeroMaquina>
                                            {venta.NroMaquina}
                                        </NumeroMaquina>
                                        <Vendedor>{venta.Descripcion}</Vendedor>
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
                            maquina={true}
                        ></Totales>
                    </ResumenContent>
                </ResumenWrapper>
                <Toaster />
                <ReactTooltip type="info" />
            </ResumenContainer>
        </Layout>
    );
};

export default ResumenxMaquina;
