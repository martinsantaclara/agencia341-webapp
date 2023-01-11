import React, { useState, useEffect, useRef } from 'react';
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
    NumeroSorteo,
    LabelNumeroSorteo,
} from './resumenStyles';

import axios from 'axios';
import Datagrid from '../Datagrid/Datagrid';

import {
    useVentasContext,
    useStateContext,
    useSorteosContext,
} from '../../../context/StateContext';
import { creaResumen, actualizaResumen } from '../../../services/resumen';

import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import es from 'date-fns/locale/es'; // the locale you want
import Totales from '../Totales/totales';

import Dialog from '../../Commons/DialogBox/dialog';

import toast, { Toaster } from 'react-hot-toast';
import handleNotifications from '../../../utils/handleNotifications';
import ReactTooltip from 'react-tooltip';
import { formatoFechaArgentina } from '../Datagrid/DatagridRow';
import {
    ImprimeCheck,
    LabelImprimeCheck,
} from '../../Commons/DialogBox/dialogStyles';
import { formatoFechaLarga } from '../../../utils/handleFechas';
import {
    CalculoVentasxDia,
    CalculoVentasxVendedor,
} from '../../../utils/handleVentas';

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

export const Resumen = () => {
    const [fecha, setFecha] = useState(formatoFecha(new Date()));
    const [existeResumen, setExisteResumen] = useState(false);
    const [datePicker, setDatePicker] = useState(new Date());

    const [dialogBox, setDialogBox] = useState(false);
    const [imprimeCheck, setImprimeCheck] = useState(true);

    const [blocked, setBlocked] = useState(false);
    const { sorteos, setSorteos, lastSorteoId, setLastSorteoId } =
        useSorteosContext();
    const sorteoRef = useRef();

    const {
        ventas,
        setVentas,
        resumenDiario,
        setResumenDiario,
        configuracion,
        tituloReporte,
        setTituloReporte,
    } = useVentasContext();

    const { darkMode } = useStateContext();
    const [sorteoIdRef, setSorteoIdRef] = useState();
    const [sorteoId, setSorteoId] = useState();

    const [tipoSorteo, setTipoSorteo] = useState('');
    const [ordenSorteo, setOrdenSorteo] = useState();
    const [numeroSorteo, setNumeroSorteo] = useState(0);

    const idVendedorAgencia = configuracion.idVendedorAgencia;
    const porcentajeAgencia = configuracion.PorcentajeAgencia;
    const porcentajeVendedores = configuracion.PorcentajeVendedores;
    const imprimeResumen = configuracion.ImprimeResumen;

    const refBtnGuardar = useRef();
    const refDatePicker = useRef();
    const refPrinter = useRef();

    const router = useRouter();

    const fetchVentas = async () => {
        try {
            const { data } = await axios.get(
                `/api/ventas/fechaysorteo/?fecha=${fecha}&sorteo=${sorteoId}`
            );
            const ventas = data;
            if (ventas.length !== 0) {
                const { data } = await axios.get(
                    `/api/ventasxdia/fechaysorteo/?fecha=${fecha}&sorteo=${sorteoId}`
                );
                setBlocked(data[0].Blocked);
                setNumeroSorteo(data[0].NumeroSorteo);
                const nuevasVentas = ventas.map((venta) => {
                    return {
                        FechaVenta: venta.FechaVenta,
                        MaquinaId: venta.maquinaId,
                        NroMaquina: venta.maquina.NroMaquina,
                        VendedorId: venta.vendedorId,
                        Vendedor: `${venta.vendedor.ApellidoVendedor} ${
                            venta.vendedor.NombreVendedor || ''
                        }`,
                        Agencia: venta.vendedorId === idVendedorAgencia,
                        ImporteVenta: venta.ImporteVenta,
                        ComisionAgencia: venta.ComisionAgencia,
                        ComisionVendedor: venta.ComisionVendedor,
                    };
                });
                setExisteResumen(true);
                setVentas(nuevasVentas);
                const ventasOrig = nuevasVentas.reduce((acc, venta) => {
                    acc.push({
                        MaquinaId: venta.MaquinaId,
                        ImporteVenta: venta.ImporteVenta,
                        ComisionVendedor: venta.ComisionVendedor,
                        ComisionAgencia: venta.ComisionAgencia,
                    });
                    return acc;
                }, []);
                const diario = CalculoVentasxDia(nuevasVentas);
                setResumenDiario(diario);
            } else {
                const { data } = await axios.get(`/api/maquinas`);
                const ventasxmaquina = data;
                setBlocked(false);
                const nuevasVentas = ventasxmaquina.map((venta) => {
                    return {
                        FechaVenta: fecha,
                        MaquinaId: venta.id,
                        NroMaquina: venta.NroMaquina,
                        VendedorId: venta.vendedorId,
                        Vendedor: `${venta.vendedor.ApellidoVendedor} ${
                            venta.vendedor.NombreVendedor || ''
                        }`,
                        Agencia: venta.vendedorId === idVendedorAgencia,
                        ImporteVenta: 0,
                        ComisionAgencia: 0,
                        ComisionVendedor: 0,
                    };
                });
                const sorteos = await ObtenerSorteos(false);
                const sorteo = sorteos.find((s) => s.id === sorteoId);
                setNumeroSorteo(
                    fecha > sorteo.FechaSorteo
                        ? sorteo.NumeroSorteo + 1
                        : '0000'
                );
                setExisteResumen(false);
                setVentas(nuevasVentas);
                const diario = CalculoVentasxDia(nuevasVentas);
                setResumenDiario(diario);
            }
        } catch (error) {
            handleNotifications(
                'danger',
                'Error inesperado!',
                'Contáctese con su Administrador!!!'
            );
        }
    };

    const actualizaDatos = () => {
        if (fecha !== formatoFecha(datePicker)) {
            handleNotifications(
                'warning',
                'Fecha Resumen',
                'Las fechas no coinciden. Presione el botón Ir!!!'
            );
            setTimeout(() => {
                refDatePicker.current.setFocus();
            }, 5500);
        } else if (
            resumenDiario.VentaAgencia + resumenDiario.VentaVendedores ===
            0
        ) {
            handleNotifications(
                'warning',
                'Importe Resumen',
                'Los importes deben ser distintos a $ 0.00!!!'
            );
        } else if (tipoSorteo !== sorteoRef.current.value) {
            handleNotifications(
                'warning',
                'Tipo de Sorteo',
                'Los sorteos no coinciden. Presione el botón Ir!!!'
            );
            setTimeout(() => {
                sorteoRef.current.focus();
            }, 5500);
        } else {
            setImprimeCheck(imprimeResumen);
            setDialogBox(true);
        }
    };

    const handleFecha = () => {
        const nuevaFecha = formatoFecha(datePicker);
        const hoy = formatoFecha(new Date());
        if (nuevaFecha.length !== 10 || nuevaFecha > hoy) {
            handleNotifications(
                'warning',
                'Fecha Resumen',
                nuevaFecha.length !== 10
                    ? 'Ha introducido una fecha incorrecta!!!'
                    : 'No puede ingresar una fecha posterior a la de hoy!!!'
            );

            setTimeout(() => {
                setDatePicker(new Date(fecha.concat(' 00:00:00')));
                refDatePicker.current.setFocus();
            }, 5500);
        } else {
            setTipoSorteo(sorteoRef.current.value);
            setFecha(nuevaFecha);
            setSorteoId(sorteoIdRef);
            const ordenSorteo = sorteos.find(
                (sorteo) => sorteo.id === sorteoIdRef
            );
            setOrdenSorteo(ordenSorteo.OrdenSorteo);
            refPrinter.current.focus();
        }
    };

    const updateDatos = async (imprimeCheck) => {
        const resumenxvendedorinicial = CalculoVentasxVendedor(
            fecha,
            ventas,
            idVendedorAgencia
        );
        const resumenxmaquinainicial = ventas.map((venta) => {
            return {
                FechaVenta: new Date(fecha),
                ImporteVenta: parseFloat(venta.ImporteVenta),
                ComisionVendedor: parseFloat(venta.ComisionVendedor),
                ComisionAgencia: parseFloat(venta.ComisionAgencia),
                vendedorId: venta.VendedorId,
                maquinaId: venta.MaquinaId,
            };
        });
        const ventasxmaquina = resumenxmaquinainicial.map((res) => ({
            ...res,
            sorteoId: sorteoId,
        }));
        const ventasxvendedor = resumenxvendedorinicial.map((res) => ({
            ...res,
            sorteoId: sorteoId,
        }));

        const ventasxdiaOriginal = await obtenerVentasDiaOriginal();
        const ventasxmaquinaOriginal = await obtenerVentasMaquinaOriginal();
        const ventasxvendedorOriginal = await obtenerVentasVendedorOriginal();

        const { resumenxdia, existe } = await obtenerResumenxdia(
            ventasxdiaOriginal
        );
        const resumenxmaquina = await obtenerResumenxmaquina(
            resumenxmaquinainicial,
            ventasxmaquinaOriginal
        );
        const resumenxvendedor = await obtenerResumenxvendedor(
            resumenxvendedorinicial,
            ventasxvendedorOriginal
        );

        const indexSorteo = sorteos.findIndex(
            (sorteo) => sorteo.id === sorteoId
        );
        const updateSorteo =
            new Date(fecha).toISOString() >= sorteos[indexSorteo].FechaSorteo;

        if (existeResumen) {
            const UpdateResumen = async () => {
                const result = await toast.promise(
                    actualizaResumen(
                        fecha,
                        resumenDiario,
                        ventasxmaquina,
                        ventasxvendedor,
                        resumenxdia,
                        resumenxmaquina,
                        resumenxvendedor,
                        blocked,
                        updateSorteo,
                        sorteoId,
                        ordenSorteo,
                        numeroSorteo
                    ),
                    {
                        loading: <b>Actualizando Resumen...</b>,
                        error: (err) => {
                            const error = err.response.data;
                            handleNotifications(
                                error.type,
                                error.title,
                                error.message
                            );
                        },
                        success: (data) => {
                            handleNotifications(
                                data.type,
                                data.title,
                                data.message
                            );
                            setTimeout(() => {
                                if (imprimeCheck)
                                    router.push(`/pruebaprint/${fecha}`);
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
                refBtnGuardar.current.blur();
            };
            setTimeout(() => {
                UpdateResumen();
            }, 100);
        } else {
            const CreateResumen = async () => {
                const result = await toast.promise(
                    creaResumen(
                        fecha,
                        resumenDiario,
                        ventasxmaquina,
                        ventasxvendedor,
                        existe,
                        resumenxdia,
                        resumenxmaquina,
                        resumenxvendedor,
                        blocked,
                        updateSorteo,
                        sorteoId,
                        ordenSorteo,
                        numeroSorteo
                    ),
                    {
                        loading: <b>Creando Resumen...</b>,
                        error: (err) => {
                            const error = err.response.data;
                            handleNotifications(
                                error.type,
                                error.title,
                                error.message
                            );
                        },
                        success: (data) => {
                            handleNotifications(
                                data.type,
                                data.title,
                                data.message
                            );
                            setTimeout(() => {
                                if (imprimeCheck)
                                    router.push(`/printer/resumenes/${fecha}`);
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
                setExisteResumen(true);
                refBtnGuardar.current.blur();
            };
            setTimeout(() => {
                CreateResumen();
            }, 100);
        }

        setDialogBox(false);
    };

    const obtenerVentasDiaOriginal = async () => {
        const { data } = await axios.get(
            `/api/ventasxdia/fechaysorteo/?fecha=${fecha}&sorteo=${sorteoId}`
        );
        return data[0];
    };

    const obtenerResumenxdia = async (ventasxdiaOriginal) => {
        const { data } = await axios.get(`/api/resumenxdia/?fecha=${fecha}`);
        const ventasxdia = data;
        const existe = ventasxdia.length > 0;
        const resumenxdia = ventasxdia.reduce(
            (acc, actual) => {
                acc.VentaAgencia +=
                    actual.VentaAgencia -
                    (existeResumen ? ventasxdiaOriginal.VentaAgencia : 0);
                acc.VentaVendedores +=
                    actual.VentaVendedores -
                    (existeResumen ? ventasxdiaOriginal.VentaVendedores : 0);
                acc.ComisionAgencia +=
                    actual.ComisionAgencia -
                    (existeResumen ? ventasxdiaOriginal.ComisionAgencia : 0);
                acc.ComisionVendedores +=
                    actual.ComisionVendedores -
                    (existeResumen ? ventasxdiaOriginal.ComisionVendedores : 0);
                acc.Gastos += actual.Gastos;
                return acc;
            },
            {
                FechaVenta: fecha,
                VentaAgencia: resumenDiario.VentaAgencia,
                VentaVendedores: resumenDiario.VentaVendedores,
                ComisionAgencia: resumenDiario.ComisionAgencia,
                ComisionVendedores: resumenDiario.ComisionVendedores,
                Gastos: 0,
            }
        );
        return { resumenxdia, existe };
    };

    const obtenerVentasMaquinaOriginal = async () => {
        const { data } = await axios.get(
            `/api/ventas/fechaysorteo/?fecha=${fecha}&sorteo=${sorteoId}`
        );
        const ventas = data;
        return ventas;
    };

    const obtenerResumenxmaquina = async (
        resumenInicial,
        ventasxmaquinaOriginal
    ) => {
        const { data } = await axios.get(
            `/api/resumenxmaquina/?fecha=${fecha}`
        );
        const ventasxmaquina = data;
        const resumenxmaquina = ventasxmaquina.reduce((vtaMaquina, venta) => {
            const index = vtaMaquina.findIndex(
                (vta) => vta.maquinaId === venta.maquinaId
            );
            vtaMaquina[index].ImporteVenta +=
                parseFloat(venta.ImporteVenta) -
                (existeResumen
                    ? parseFloat(ventasxmaquinaOriginal[index].ImporteVenta)
                    : 0);
            vtaMaquina[index].ComisionVendedor +=
                venta.ComisionVendedor -
                (existeResumen
                    ? ventasxmaquinaOriginal[index].ComisionVendedor
                    : 0);
            vtaMaquina[index].ComisionAgencia +=
                venta.ComisionAgencia -
                (existeResumen
                    ? ventasxmaquinaOriginal[index].ComisionAgencia
                    : 0);
            return vtaMaquina;
        }, resumenInicial);
        return resumenxmaquina;
    };

    const obtenerVentasVendedorOriginal = async () => {
        const { data } = await axios.get(
            `/api/ventasxvendedor/fechaysorteo/?fecha=${fecha}&sorteo=${sorteoId}`
        );
        const ventas = data;
        return ventas;
    };

    const obtenerResumenxvendedor = async (
        resumenInicial,
        ventasxvendedorOriginal
    ) => {
        const { data } = await axios.get(
            `/api/resumenxvendedor/?fecha=${fecha}`
        );
        const ventasxvendedor = data;
        const resumenxvendedor = ventasxvendedor.reduce(
            (vtaVendedor, venta) => {
                const index = vtaVendedor.findIndex(
                    (vta) => vta.vendedorId === venta.vendedorId
                );

                vtaVendedor[index].Venta +=
                    parseFloat(venta.Venta) -
                    (existeResumen ? ventasxvendedorOriginal[index].Venta : 0);
                vtaVendedor[index].Comision +=
                    venta.Comision -
                    (existeResumen
                        ? ventasxvendedorOriginal[index].Comision
                        : 0);

                return vtaVendedor;
            },
            resumenInicial
        );
        return resumenxvendedor;
    };

    const handleSorteo = (e) => {
        const index = e.target.options.selectedIndex;
        setSorteoIdRef(parseInt(e.target.options[index].id));
    };

    const handleNumeroSorteo = (e) => {
        const numeroSorteo = parseInt(e.target.value);
        if (isNaN(numeroSorteo)) {
            handleNotifications(
                'warning',
                'Número de Sorteo!',
                'Debe ingresar un valor númerico!!!'
            );
        } else {
            setNumeroSorteo(numeroSorteo);
        }
    };

    useEffect(() => {
        setTituloReporte(
            `${formatoFechaLarga(fecha)} - ${tipoSorteo} - ${numeroSorteo}`
        );
        if (sorteoId !== undefined) {
            fetchVentas();
        }
    }, [fecha, sorteoId, idVendedorAgencia]);

    useEffect(() => {
        setTituloReporte(
            `${formatoFechaLarga(fecha)} - ${tipoSorteo} - ${numeroSorteo}`
        );
    }, [numeroSorteo]);

    const ObtenerSorteos = async (resumen) => {
        const { data } = await axios.get(`/api/sorteos`);
        const sorteos = data;
        setSorteos(sorteos);
        if (resumen) {
            const lastId = [...sorteos].pop().OrdenSorteo;
            setLastSorteoId(lastId);
            ObtenerSorteosResumen(sorteos, lastId);
        } else {
            return sorteos;
        }
    };

    const ObtenerSorteosResumen = async (sorteos, lastSorteoId) => {
        try {
            const { data } = await axios.get(
                `/api/ventasxdia/fecha/?fecha=${fecha}`
            );
            const lastVenta = data;
            let lastId =
                lastVenta.length !== 0
                    ? lastVenta[0].OrdenSorteo + 1
                    : sorteos[0].OrdenSorteo;
            const newSorteo = lastId <= lastSorteoId;
            lastId = lastId <= lastSorteoId ? lastId : lastSorteoId;
            setTipoSorteo(sorteos[lastId].NombreSorteo);
            setSorteoId(sorteos[lastId].id);
            setSorteoIdRef(sorteos[lastId].id);
            setOrdenSorteo(sorteos[lastId].OrdenSorteo);
            setNumeroSorteo(
                newSorteo
                    ? sorteos[lastId].NumeroSorteo + 1
                    : lastVenta[0].NumeroSorteo
            );
            sorteoRef.current.value = sorteos[lastId].NombreSorteo;
        } catch (error) {
            handleNotifications(
                'danger',
                'Error inesperado!',
                'Contáctese con su Administrador!!!'
            );
        }
    };

    useEffect(() => {
        ObtenerSorteos(true);
    }, []);

    return (
        <ResumenContainer>
            <ResumenWrapper>
                <ResumenContent>
                    <HeadResumen>
                        <FechaContainer>
                            <TitleResumen>Día</TitleResumen>
                            <FechaPicker
                                selected={datePicker}
                                onChange={(fecha) => setDatePicker(fecha)}
                                dateFormat="dd/MM/yyyy"
                                locale="es"
                                ref={refDatePicker}
                                reporte
                            />
                            <TipoSorteo
                                name="sorteo"
                                ref={sorteoRef}
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
                                                    backgroundColor: 'white',
                                                }}
                                            >
                                                {sorteo.NombreSorteo}
                                            </option>
                                        );
                                    })}
                            </TipoSorteo>

                            <LabelNumeroSorteo>Sorteo N°:</LabelNumeroSorteo>

                            <NumeroSorteo
                                type="text"
                                maxLength="5"
                                value={numeroSorteo}
                                onChange={handleNumeroSorteo}
                            ></NumeroSorteo>

                            <BtnIr onClick={handleFecha} tabIndex={0}>
                                Ir
                            </BtnIr>
                        </FechaContainer>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ fontSize: '1.33rem' }}>
                                <LabelImprimeCheck resumen>
                                    <ImprimeCheck
                                        type="checkbox"
                                        checked={blocked}
                                        onChange={() =>
                                            setBlocked((prev) => !prev)
                                        }
                                        resumen
                                    />
                                    Bloquear Resumen
                                </LabelImprimeCheck>
                            </div>
                            <Link
                                href={`/printer/resumenes/${fecha}`}
                                passHref
                                prefetch={false}
                            >
                                <a ref={refPrinter}>
                                    <Printer
                                        src="/assets/imagenes/print-icon.png"
                                        alt="imprime resumen"
                                        data-tip={`Imprime Resumen día ${formatoFechaArgentina(
                                            fecha
                                        )}`}
                                    />
                                </a>
                            </Link>
                        </div>
                        <ReactTooltip type="info" />
                    </HeadResumen>
                    <h5 style={{ textAlign: 'center' }}>{tituloReporte}</h5>

                    <Datagrid
                        fecha={fecha}
                        refBtnGuardar={refBtnGuardar}
                        porcentajeAgencia={porcentajeAgencia}
                        porcentajeVendedores={porcentajeVendedores}
                        blocked={blocked && existeResumen}
                    ></Datagrid>
                    <Totales resumenDiario={resumenDiario} resumen></Totales>
                    <BtnGuardar
                        onClick={actualizaDatos}
                        ref={refBtnGuardar}
                        tabIndex={0}
                        disable={
                            resumenDiario?.VentaAgencia +
                                resumenDiario?.VentaVendedores ===
                                0 || fecha !== formatoFecha(datePicker)
                        }
                        actualiza={existeResumen}
                    >
                        {existeResumen ? 'Actualiza ' : 'Crea '}
                        Resumen
                    </BtnGuardar>
                    {dialogBox && (
                        <Dialog
                            primaryMessage={`Confirma ${
                                existeResumen ? 'actualización ' : 'creación '
                            } del Resumen`}
                            imprime={true}
                            imprimeCheck={imprimeCheck}
                            setImprimeCheck={setImprimeCheck}
                            setDialogBox={setDialogBox}
                            clickSubmit={updateDatos}
                        />
                    )}
                </ResumenContent>
            </ResumenWrapper>
            <Toaster />
            <ReactTooltip type="info" />
        </ResumenContainer>
    );
};
