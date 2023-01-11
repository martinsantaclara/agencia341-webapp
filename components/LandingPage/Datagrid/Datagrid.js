import React, { useState, useEffect, useRef } from 'react';
import { useVentasContext } from '../../../context/StateContext';
import Totales from '../Totales/totales';
import DatagridRow from './DatagridRow';
import { HeadDatagrid } from './HeadDatagrid';
// import {
//     HeadComision,
//     HeadComisionAgencia,
//     HeadComisionVendedor,
//     HeadDatagrid,
//     HeadFecha,
//     HeadMaquina,
//     HeadVendedor,
//     HeadVenta,
// } from './DatagridStyles';

const Datagrid = ({
    fecha,
    refBtnGuardar,
    porcentajeAgencia,
    porcentajeVendedores,
    blocked,
}) => {
    const inputRef = useRef([]);
    const { ventas } = useVentasContext();
    return (
        <>
            {/* <HeadDatagrid>
                <HeadFecha>Fecha</HeadFecha>
                <HeadMaquina>Máquina</HeadMaquina>
                <HeadVendedor>Vendedor</HeadVendedor>
                <HeadVenta>Importe Venta</HeadVenta>
                <HeadComision>Comisión</HeadComision>
                <HeadComisionVendedor>Vendedor</HeadComisionVendedor>
                <HeadComisionAgencia>Agencia</HeadComisionAgencia>
            </HeadDatagrid> */}

            <HeadDatagrid></HeadDatagrid>

            {ventas.length > 0 &&
                ventas.map((venta, index) => {
                    {
                        return (
                            <DatagridRow
                                className="datagrid"
                                key={index}
                                venta={venta}
                                indice={index}
                                fecha={fecha}
                                refBtnGuardar={refBtnGuardar}
                                inputRef={inputRef}
                                porcentajeAgencia={porcentajeAgencia}
                                porcentajeVendedores={porcentajeVendedores}
                                blocked={blocked}
                            />
                        );
                    }
                })}
            {/* <Totales></Totales> */}
        </>
    );
};

export default Datagrid;
