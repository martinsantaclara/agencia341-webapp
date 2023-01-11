import * as React from 'react';
import { formatoFechaArgentina } from '../../LandingPage/Datagrid/DatagridRow';
import {
    ComisionAgencia,
    ComisionVendedor,
    Fecha,
    NumeroMaquina,
    RowContainer,
    Vendedor,
} from '../../LandingPage/Datagrid/DatagridStyles';
import { HeadDatagrid } from '../../LandingPage/Datagrid/HeadDatagrid';
import {
    FechaContainer,
    ResumenContainer,
    ResumenContent,
    ResumenWrapper,
    TitleResumen,
} from '../../LandingPage/Resumen/resumenStyles';
import Totales from '../../LandingPage/Totales/totales';
import { ImporteVenta } from '../../LandingPage/Totales/totalesStyles';
import { GlobalStyles } from '../../../themes/themes';
import {
    Container,
    HeaderLeft,
    HeaderPrint,
    HeaderRight,
    HeaderTitle,
} from '../../../styles/globals';
import { formatoFechaLarga } from '../../../utils/handleFechas';

class ToPrint1 extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {
            ventas,
            resumenDiario,
            reporte,
            tituloReporte,
            resumen,
            mensual,
        } = this.props;

        return (
            <div>
                <GlobalStyles print />
                <Container flxdirection={'column'} crud print>
                    <HeaderPrint resumen>
                        <HeaderLeft>Agencia 341</HeaderLeft>
                        <HeaderTitle>
                            {reporte ? 'Resumen' : 'Sorteo'}
                        </HeaderTitle>
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
                                <HeadDatagrid print={true}></HeadDatagrid>
                                {ventas.map((venta, index) => {
                                    {
                                        return (
                                            <RowContainer
                                                key={index}
                                                print={true}
                                            >
                                                {!reporte && (
                                                    <Fecha print={true}>
                                                        {formatoFechaArgentina(
                                                            venta.FechaVenta
                                                        )}
                                                    </Fecha>
                                                )}
                                                <NumeroMaquina>
                                                    {venta.NroMaquina}
                                                </NumeroMaquina>
                                                <Vendedor>
                                                    {venta.Vendedor}
                                                </Vendedor>

                                                <ImporteVenta print>
                                                    {parseFloat(
                                                        venta?.ImporteVenta
                                                    ).toFixed(2)}
                                                </ImporteVenta>

                                                <ComisionVendedor print>
                                                    {/* {!venta.vendedor.Agencia
                                        ? `$ ${comisionVendedor.toFixed(2)}`
                                        : ' '}{' '} */}
                                                    {venta.ComisionVendedor.toFixed(
                                                        2
                                                    )}
                                                </ComisionVendedor>
                                                <ComisionAgencia print>
                                                    {/* {!venta.vendedor.Agencia
                                        ? `$ ${comisionVendedor.toFixed(2)}`
                                        : ' '}{' '} */}
                                                    {venta.ComisionAgencia.toFixed(
                                                        2
                                                    )}
                                                </ComisionAgencia>
                                            </RowContainer>
                                        );
                                    }
                                })}
                                <Totales
                                    resumenDiario={resumenDiario}
                                    print={true}
                                    resumen={resumen}
                                    mensual={mensual}
                                ></Totales>
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
            ventas={props.ventas}
            resumenDiario={props.resumenDiario}
            reporte={props.reporte}
            tituloReporte={props.tituloReporte}
            resumen={props.resumen}
            mensual={props.mensual}
        />
    );
});
