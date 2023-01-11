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

const Totales = ({
    resumenDiario,
    print = false,
    reporte = false,
    resumen,
    mensual,
    maquina = false,
    cierre = '',
    refBtnGuardar,
    importeGastos,
    setImporteGastos,
    honorarios = 0,
    setHonorarios,
    impuestos = 0,
    setImpuestos,
    otros = 0,
    setOtros,
    reporteCierreMensual = false,
}) => {
    const { screenWidth } = useDeviceContext();
    const totalesVenta =
        resumenDiario?.VentaAgencia + resumenDiario?.VentaVendedores;

    const inputRef = useRef([]);

    const lineasGastos = cierre === 'Cierre Mensual' ? [1, 2, 3] : [];

    const cambioInputRef = (indice) => {
        const valor = parseFloat(inputRef.current[indice].value);
        if (isNaN(valor)) valor = 0;
        switch (indice) {
            case 0:
                setImporteGastos(valor);
                break;
            case 1:
                setHonorarios(valor);
                break;
            case 2:
                setImpuestos(valor);
                break;
            case 3:
                setOtros(valor);
                break;

            default:
                break;
        }
    };

    const keyVenta = (e) => {
        const indice = parseInt(e.target.id);
        if (
            (e.key === 'Enter' || e.key === 'ArrowDown') &&
            indice < lineasGastos.length
        ) {
            inputRef.current[indice + 1].focus();
            inputRef.current[indice + 1].select();
        } else if (e.key === 'Enter' || e.key === 'ArrowDown') {
            refBtnGuardar.current.focus();
        } else if (e.key === 'ArrowUp' && indice > 0) {
            inputRef.current[indice - 1].focus();
            inputRef.current[indice - 1].select();
        }
    };

    useEffect(() => {
        if (cierre !== '') {
            inputRef.current[0].focus();
            inputRef.current[0].select();
        }
    }, []);

    return (
        <TotalesWrapper>
            <TotalesContainer print={print} reporte={reporte}>
                {!maquina && (
                    <>
                        <Fecha print={print}></Fecha>
                        <Maquina></Maquina>
                        <Vendedor>Agencia</Vendedor>
                        <ImporteVenta print={print} reporte={reporte}>
                            {resumenDiario?.VentaAgencia.toFixed(2)}
                        </ImporteVenta>
                        <div></div>
                        <ComisionAgencia print={print} reporte={reporte}>
                            {resumenDiario?.ComisionAgencia.toFixed(2)}
                        </ComisionAgencia>
                        <Fecha print={print}></Fecha>
                        <Maquina></Maquina>
                        <Vendedor>Vendedores</Vendedor>
                        <ImporteVenta print={print} reporte={reporte}>
                            {resumenDiario?.VentaVendedores.toFixed(2)}
                        </ImporteVenta>
                        <ComisionVendedor print={print} reporte={reporte}>
                            {resumenDiario?.ComisionVendedores.toFixed(2)}
                        </ComisionVendedor>
                        <div></div>
                    </>
                )}

                <Fecha print={print}></Fecha>
                <Maquina></Maquina>
                <Vendedor totales>{`TOTALES ${
                    resumen
                        ? 'DEL SORTEO'
                        : mensual || cierre === 'Cierre Mensual'
                        ? 'DEL MES'
                        : cierre === 'Cierre Diario'
                        ? 'DEL DÍA'
                        : ''
                }`}</Vendedor>
                <ImporteVenta
                    totales
                    print={print}
                    reporte={reporte}
                    maquina={maquina}
                >
                    {totalesVenta.toFixed(2)}
                </ImporteVenta>
                <ComisionVendedor
                    noMoneda={false}
                    totales
                    print={print}
                    reporte={reporte}
                    maquina={maquina}
                >
                    {resumenDiario?.ComisionVendedores.toFixed(2)}
                </ComisionVendedor>
                <ComisionAgencia
                    totales
                    print={print}
                    reporte={reporte}
                    maquina={maquina}
                >
                    {resumenDiario?.ComisionAgencia.toFixed(2)}
                </ComisionAgencia>

                {/* GASTOS */}

                {cierre !== '' && (
                    <>
                        <Fecha print={print}></Fecha>
                        <Maquina></Maquina>
                        <Vendedor totales>{`GASTOS`}</Vendedor>
                        <GastoNulo></GastoNulo>
                        <GastoNulo></GastoNulo>
                        <ComisionAgencia
                            print={print}
                            reporte={reporte}
                            maquina={maquina}
                            cierre
                        >
                            <ImporteGasto
                                mask={Number}
                                scale="2"
                                radix="."
                                // mapToRadix={['.']}
                                padFractionalZeros={true}
                                value={importeGastos.toString()}
                                unmask={true} // true|false|'typed'
                                // ref={(el) => (ref.current[index] = el)}
                                inputRef={(el) => (inputRef.current[0] = el)} // access to nested input
                                // DO NOT USE onChange TO HANDLE CHANGES!
                                // USE onAccept INSTEAD
                                onAccept={
                                    // depending on prop above first argument is
                                    // `value` if `unmask=false`,
                                    // `unmaskedValue` if `unmask=true`,
                                    // `typedValue` if `unmask='typed'`
                                    // (value, mask) => console.log(value)
                                    // (value) => cambioInputRefGastos(value)
                                    () => cambioInputRef(0)
                                }
                                // ...and more mask props in a guide

                                // input props also availableref
                                // onBlur={handleBlur}
                                onKeyDown={keyVenta}
                                placeholder="   Ingrese gasto"
                                id="0"
                                disabled={reporteCierreMensual}
                            />
                        </ComisionAgencia>
                    </>
                )}

                {/* CIERRE MENSUAL */}

                {cierre === 'Cierre Mensual' && (
                    <>
                        <Fecha print={print}></Fecha>
                        <Maquina></Maquina>
                        <Vendedor totales>{`HONORARIOS`}</Vendedor>
                        <GastoNulo></GastoNulo>
                        <GastoNulo></GastoNulo>
                        <ComisionAgencia
                            print={print}
                            reporte={reporte}
                            maquina={maquina}
                            cierre
                        >
                            <ImporteGasto
                                mask={Number}
                                scale="2"
                                radix="."
                                // mapToRadix={['.']}
                                padFractionalZeros={true}
                                value={honorarios.toString()}
                                unmask={true} // true|false|'typed'
                                // ref={(el) => (ref.current[index] = el)}
                                inputRef={(el) => (inputRef.current[1] = el)} // access to nested input
                                // DO NOT USE onChange TO HANDLE CHANGES!
                                // USE onAccept INSTEAD
                                onAccept={
                                    // depending on prop above first argument is
                                    // `value` if `unmask=false`,
                                    // `unmaskedValue` if `unmask=true`,
                                    // `typedValue` if `unmask='typed'`
                                    // (value, mask) => console.log(value)
                                    // (value) => cambioInputRefHonorarios(value)
                                    () => cambioInputRef(1)
                                }
                                // ...and more mask props in a guide

                                // input props also availableref
                                // onBlur={handleBlur}
                                onKeyDown={keyVenta}
                                placeholder="   Honorarios"
                                id="1"
                                disabled={reporteCierreMensual}
                            />
                        </ComisionAgencia>
                        <Fecha print={print}></Fecha>
                        <Maquina></Maquina>
                        <Vendedor totales>{`IMPUESTOS (0,02%)`}</Vendedor>
                        <GastoNulo></GastoNulo>
                        <GastoNulo></GastoNulo>
                        <ComisionAgencia
                            print={print}
                            reporte={reporte}
                            maquina={maquina}
                            cierre
                        >
                            <ImporteGasto
                                mask={Number}
                                scale="2"
                                radix="."
                                // mapToRadix={['.']}
                                padFractionalZeros={true}
                                value={impuestos.toString()}
                                unmask={true} // true|false|'typed'
                                // ref={(el) => (ref.current[index] = el)}
                                inputRef={(el) => (inputRef.current[2] = el)} // access to nested input
                                // DO NOT USE onChange TO HANDLE CHANGES!
                                // USE onAccept INSTEAD
                                onAccept={
                                    // depending on prop above first argument is
                                    // `value` if `unmask=false`,
                                    // `unmaskedValue` if `unmask=true`,
                                    // `typedValue` if `unmask='typed'`
                                    // (value, mask) => console.log(value)
                                    () => cambioInputRef(2)
                                }
                                // ...and more mask props in a guide

                                // input props also availableref
                                // onBlur={handleBlur}
                                onKeyDown={keyVenta}
                                placeholder="   Impuestos"
                                id="2"
                                disabled={reporteCierreMensual}
                            />
                        </ComisionAgencia>
                        <Fecha print={print}></Fecha>
                        <Maquina></Maquina>
                        <Vendedor totales>{`OTROS`}</Vendedor>
                        <GastoNulo></GastoNulo>
                        <GastoNulo></GastoNulo>
                        <ComisionAgencia
                            print={print}
                            reporte={reporte}
                            maquina={maquina}
                            cierre
                        >
                            <ImporteGasto
                                mask={Number}
                                scale="2"
                                radix="."
                                // mapToRadix={['.']}
                                padFractionalZeros={true}
                                value={otros.toString()}
                                unmask={true} // true|false|'typed'
                                // ref={(el) => (ref.current[index] = el)}
                                inputRef={(el) => (inputRef.current[3] = el)} // access to nested input
                                // DO NOT USE onChange TO HANDLE CHANGES!
                                // USE onAccept INSTEAD
                                onAccept={
                                    // depending on prop above first argument is
                                    // `value` if `unmask=false`,
                                    // `unmaskedValue` if `unmask=true`,
                                    // `typedValue` if `unmask='typed'`
                                    // (value, mask) => console.log(value)
                                    // (value) => cambioInputRefOtros(value)
                                    () => cambioInputRef(3)
                                }
                                // ...and more mask props in a guide

                                // input props also availableref
                                // onBlur={handleBlur}
                                onKeyDown={keyVenta}
                                placeholder="   Ingrese otros"
                                id="3"
                                disabled={reporteCierreMensual}
                            />
                        </ComisionAgencia>
                    </>
                )}

                {cierre !== '' && (
                    <>
                        <Fecha print={print}></Fecha>
                        <Maquina></Maquina>
                        <Vendedor totales>{`BENEFICIOS DEL ${
                            cierre === 'Cierre Mensual' ? 'MES' : 'DÍA'
                        } `}</Vendedor>
                        <GastoNulo></GastoNulo>
                        <GastoNulo></GastoNulo>
                        <ImporteBeneficio
                            print={print}
                            reporte={reporte}
                            maquina={maquina}
                            cierre
                            beneficio={
                                resumenDiario.ComisionAgencia -
                                    importeGastos -
                                    honorarios -
                                    impuestos -
                                    otros >=
                                0
                            }
                        >
                            {parseFloat(
                                resumenDiario.ComisionAgencia -
                                    importeGastos -
                                    honorarios -
                                    impuestos -
                                    otros
                            ).toFixed(2)}
                        </ImporteBeneficio>
                    </>
                )}
            </TotalesContainer>
            <LineaTotales
                screenWidth={
                    screenWidth <= 1237
                        ? reporte
                            ? screenWidth * 0.8971 - 64
                            : screenWidth
                        : reporte
                        ? 1046
                        : 1237
                }
                print={print}
                reporte={reporte}
            ></LineaTotales>
            {cierre !== '' &&
                lineasGastos.map((linea, index) => {
                    return (
                        <LineaTotalesGastos
                            key={index}
                            screenWidth={
                                screenWidth <= 1237
                                    ? reporte
                                        ? screenWidth * 0.8971 - 64
                                        : screenWidth
                                    : reporte
                                    ? 1046
                                    : 1237
                            }
                            print={print}
                            reporte={reporte}
                            linea={linea}
                            cierremensual={cierre === 'Cierre Mensual'}
                        ></LineaTotalesGastos>
                    );
                })}
        </TotalesWrapper>
    );
};

export default Totales;
