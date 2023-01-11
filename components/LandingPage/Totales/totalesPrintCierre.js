import React, { useState, useEffect, useRef } from 'react';
import { useDeviceContext } from '../../../context/StateContext';
import {
    Comision,
    ComisionAgencia,
    ComisionVendedor,
    EncabezadoDatagrid,
    Fecha,
    GastoNulo,
    ImporteBeneficio,
    ImporteGasto,
    ImporteVenta,
    LineaTotales,
    LineaTotalesGastos,
    Maquina,
    TotalesContainer,
    TotalesWrapper,
    Vendedor,
    Venta,
} from './totalesStyles';

const TotalesPrintCierre = ({
    resumenDiario,
    cierremensual,
    gastos,
    honorarios,
    impuestos,
    otros,
}) => {
    const { screenWidth } = useDeviceContext();
    const totalesVenta =
        resumenDiario?.VentaAgencia + resumenDiario?.VentaVendedores;

    const lineasGastos = [1, 2, 3];

    return (
        <TotalesWrapper>
            <TotalesContainer print>
                <Fecha print></Fecha>
                <Maquina></Maquina>
                <Vendedor>Agencia</Vendedor>
                <ImporteVenta print>
                    {resumenDiario?.VentaAgencia.toFixed(2)}
                </ImporteVenta>
                <div></div>
                <ComisionAgencia print>
                    {resumenDiario?.ComisionAgencia.toFixed(2)}
                </ComisionAgencia>
                <Fecha print></Fecha>
                <Maquina></Maquina>
                <Vendedor>Vendedores</Vendedor>
                <ImporteVenta print>
                    {resumenDiario?.VentaVendedores.toFixed(2)}
                </ImporteVenta>
                <ComisionVendedor print>
                    {resumenDiario?.ComisionVendedores.toFixed(2)}
                </ComisionVendedor>
                <div></div>

                <Fecha print></Fecha>
                <Maquina></Maquina>
                <Vendedor totales>{`TOTALES DEL ${
                    cierremensual ? 'MES' : 'DÍA'
                }`}</Vendedor>
                <ImporteVenta totales print>
                    {totalesVenta.toFixed(2)}
                </ImporteVenta>
                <ComisionVendedor totales print>
                    {resumenDiario?.ComisionVendedores.toFixed(2)}
                </ComisionVendedor>
                <ComisionAgencia totales print>
                    {resumenDiario?.ComisionAgencia.toFixed(2)}
                </ComisionAgencia>

                {/* GASTOS */}
                <Fecha print></Fecha>
                <Maquina></Maquina>
                <Vendedor totales>{`GASTOS`}</Vendedor>
                <GastoNulo></GastoNulo>
                <GastoNulo></GastoNulo>
                <ComisionAgencia print cierre>
                    {gastos.toFixed(2)}
                </ComisionAgencia>
                {cierremensual && (
                    <>
                        {/* HONORARIOS */}
                        <Fecha print></Fecha>
                        <Maquina></Maquina>
                        <Vendedor totales>{`HONORARIOS`}</Vendedor>
                        <GastoNulo></GastoNulo>
                        <GastoNulo></GastoNulo>
                        <ComisionAgencia print cierre>
                            {honorarios.toFixed(2)}
                        </ComisionAgencia>

                        {/* IMPUESTOS */}
                        <Fecha print></Fecha>
                        <Maquina></Maquina>
                        <Vendedor totales>{`IMPUESTOS (0,02%)`}</Vendedor>
                        <GastoNulo></GastoNulo>
                        <GastoNulo></GastoNulo>
                        <ComisionAgencia print cierre>
                            {impuestos.toFixed(2)}
                        </ComisionAgencia>

                        {/* OTROS */}
                        <Fecha print></Fecha>
                        <Maquina></Maquina>
                        <Vendedor totales>{`OTROS`}</Vendedor>
                        <GastoNulo></GastoNulo>
                        <GastoNulo></GastoNulo>
                        <ComisionAgencia print cierre>
                            {otros.toFixed(2)}
                        </ComisionAgencia>
                    </>
                )}

                <Fecha print></Fecha>
                <Maquina></Maquina>
                <Vendedor totales>{`BENEFICIOS DEL ${
                    cierremensual ? 'MES' : 'DÍA'
                }`}</Vendedor>
                <GastoNulo></GastoNulo>
                <GastoNulo></GastoNulo>
                <ImporteBeneficio
                    print
                    cierre
                    beneficio={
                        resumenDiario.ComisionAgencia -
                            gastos -
                            (cierremensual
                                ? honorarios + impuestos + otros
                                : 0) >=
                        0
                    }
                >
                    {parseFloat(
                        resumenDiario.ComisionAgencia -
                            gastos -
                            (cierremensual ? honorarios + impuestos + otros : 0)
                    ).toFixed(2)}
                </ImporteBeneficio>
            </TotalesContainer>
            {lineasGastos.map((linea, index) => {
                return (
                    <LineaTotalesGastos
                        key={index}
                        screenWidth={
                            screenWidth <= 1237
                                ? screenWidth * 0.8971 - 64
                                : 1046
                        }
                        print
                        linea={linea}
                        cierremensual={cierremensual}
                    ></LineaTotalesGastos>
                );
            })}
        </TotalesWrapper>
    );
};

export default TotalesPrintCierre;
