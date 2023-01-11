import * as React from 'react';
import { formatoFechaArgentina } from '../../../LandingPage/Datagrid/DatagridRow';
import {
    ComisionAgencia,
    ComisionVendedor,
    Fecha,
    NumeroMaquina,
    RowContainer,
} from '../../../LandingPage/Datagrid/DatagridStyles';
import {
    HeadDatagrid,
    HeadDatagridContainerVendedor,
} from '../../../LandingPage/Datagrid/HeadDatagrid';
import {
    FechaContainer,
    ResumenContainer,
    ResumenContent,
    ResumenWrapper,
    TitleResumen,
} from '../../../LandingPage/Resumen/resumenStyles';
import {
    ImporteVenta,
    Vendedor,
} from '../../../LandingPage/Totales/totalesStyles';
import { GlobalStyles } from '../../../../themes/themes';
import {
    Container,
    HeaderLeft,
    HeaderPrint,
    HeaderRight,
    HeaderTitle,
} from '../../../../styles/globals';
import { RowContainerVendedor } from '../../../LandingPage/Datagrid/DatagridStyles';

class ToPrint1 extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {
            ventasxvendedor,
            reporte,
            tituloReporte,
            soloAgencia,
            soloVendedores,
            idVendedorAgencia,
        } = this.props;

        return (
            <div>
                <GlobalStyles print />
                <Container flxdirection={'column'} crud print>
                    <HeaderPrint resumen>
                        <HeaderLeft>Agencia 341</HeaderLeft>
                        <HeaderTitle>Reporte Vendedores</HeaderTitle>
                        <HeaderRight>Puerto Piray - Misiones</HeaderRight>
                    </HeaderPrint>

                    <ResumenContainer print>
                        {/* <style type="text/css" media="print">
                        {
                            '\
                            @page { size: portrait; }\
                        '
                        }
                    </style> */}
                        <ResumenWrapper print={true}>
                            <ResumenContent>
                                <FechaContainer print>
                                    <TitleResumen print reporte={reporte}>
                                        {/* Resumen del día:{' '}
                                        <span style={{ marginLeft: '5px' }}>
                                            {fechaLarga}
                                        </span>{' '} */}
                                        {tituloReporte}
                                    </TitleResumen>
                                </FechaContainer>
                                <HeadDatagridContainerVendedor></HeadDatagridContainerVendedor>
                                {ventasxvendedor.map((venta, index) => {
                                    {
                                        return (
                                            ((soloAgencia &&
                                                venta.vendedorId ===
                                                    idVendedorAgencia) ||
                                                (soloVendedores &&
                                                    venta.vendedorId !==
                                                        idVendedorAgencia) ||
                                                (!soloAgencia &&
                                                    !soloVendedores)) && (
                                                <RowContainerVendedor
                                                    key={index}
                                                    print={true}
                                                    reporte
                                                >
                                                    <Vendedor print>
                                                        {venta.vendedor}
                                                    </Vendedor>

                                                    <ImporteVenta
                                                        print
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
                                                        {/* {!venta.vendedor.Agencia
                                        ? `$ ${comisionVendedor.toFixed(2)}`
                                        : ' '}{' '} */}
                                                        {venta.Comision.toFixed(
                                                            2
                                                        )}
                                                    </ComisionVendedor>
                                                </RowContainerVendedor>
                                            )
                                        );
                                    }
                                })}
                            </ResumenContent>
                        </ResumenWrapper>
                    </ResumenContainer>
                </Container>
            </div>
        );
    }
}

export const ToPrint = React.forwardRef((props, ref) => {
    // eslint-disable-line max-len
    return (
        <ToPrint1
            ref={ref}
            ventasxvendedor={props.ventasxvendedor}
            reporte={props.reporte}
            tituloReporte={props.tituloReporte}
            soloAgencia={props.soloAgencia}
            soloVendedores={props.soloVendedores}
            idVendedorAgencia={props.idVendedorAgencia}
        />
    );
});
