import React, { useState, useEffect, useRef } from 'react';
import { useVentasContext } from '../../../context/StateContext';
import { CalculoVentasxDia } from '../../../utils/handleVentas';

import {
    NumeroMaquina,
    Fecha,
    RowContainer,
    ComisionVendedor,
    ComisionAgencia,
    ImporteVenta,
    ImporteWrapper,
    Vendedor,
} from './DatagridStyles';

export const formatoFechaArgentina = (fecha) => {
    return [
        fecha.substring(8),
        fecha.substring(5, 7),
        fecha.substring(0, 4),
    ].join('/');
};

const DatagridRow = ({
    venta,
    indice,
    fecha,
    refBtnGuardar,
    inputRef,
    porcentajeAgencia,
    porcentajeVendedores,
    blocked,
}) => {
    const [importe, setImporte] = useState(venta.ImporteVenta);
    const [cambio, setCambio] = useState(false);
    const { ventas, setResumenDiario } = useVentasContext();

    const handleBlur = () => {
        if (inputRef.current[indice].value === '') {
            inputRef.current[indice].value = 0;
            inputRef.current[indice].focus();
        } else {
            venta.ComisionVendedor =
                venta.ImporteVenta * (venta.Agencia ? 0 : porcentajeVendedores);
            venta.ComisionAgencia =
                venta.ImporteVenta *
                (porcentajeAgencia -
                    (venta.Agencia ? 0 : porcentajeVendedores));
            setResumenDiario(CalculoVentasxDia(ventas));
            setCambio(!cambio);
        }
    };

    const keyVenta = (e) => {
        if (
            (e.key === 'Enter' || e.key === 'ArrowDown') &&
            indice < inputRef.current.length - 1
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

    const cambioInputRef = (valor) => {
        venta.ImporteVenta = valor;
        setImporte(valor);
    };

    useEffect(() => {
        inputRef.current[0].focus();
        inputRef.current[0].select();
    }, [venta]);

    return (
        <RowContainer>
            <Fecha>{formatoFechaArgentina(fecha)}</Fecha>
            <NumeroMaquina>{venta.NroMaquina}</NumeroMaquina>
            <Vendedor>{venta.Vendedor}</Vendedor>

            <ImporteWrapper>
                <ImporteVenta
                    mask={Number}
                    scale="2"
                    radix="."
                    // mapToRadix={['.']}
                    padFractionalZeros={true}
                    value={venta.ImporteVenta.toString()}
                    unmask={true} // true|false|'typed'
                    // ref={(el) => (ref.current[index] = el)}
                    inputRef={(el) => (inputRef.current[indice] = el)} // access to nested input
                    // DO NOT USE onChange TO HANDLE CHANGES!
                    // USE onAccept INSTEAD
                    onAccept={
                        // depending on prop above first argument is
                        // `value` if `unmask=false`,
                        // `unmaskedValue` if `unmask=true`,
                        // `typedValue` if `unmask='typed'`
                        // (value, mask) => console.log(value)
                        (value) => cambioInputRef(value)
                    }
                    onBlur={handleBlur}
                    onKeyDown={keyVenta}
                    // ...and more mask props in a guide

                    // input props also available
                    placeholder="   Ingrese importe"
                    disabled={blocked}
                />
            </ImporteWrapper>

            {/* <input
                type="text"
                onBlur={handleBlur}
                onKeyDown={keyVenta}
                value={venta.ImporteVenta}
                onChange={(e) => changeImporte(e)}
                ref={(el) => (refImporte.current[index] = el)}
            /> */}

            <ComisionVendedor>
                {/* {!venta.vendedor.Agencia
                    ? `$ ${comisionVendedor.toFixed(2)}`
                    : ' '}{' '} */}
                {venta.ComisionVendedor.toFixed(2)}
            </ComisionVendedor>
            <ComisionAgencia>
                {/* {!venta.vendedor.Agencia
                    ? `$ ${comisionVendedor.toFixed(2)}`
                    : ' '}{' '} */}
                {venta.ComisionAgencia.toFixed(2)}
            </ComisionAgencia>
        </RowContainer>
    );
};

export default DatagridRow;
