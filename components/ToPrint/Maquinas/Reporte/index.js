import * as React from 'react';
import { formatoFechaArgentina } from '../../../LandingPage/Datagrid/DatagridRow';
import {
    ComisionAgencia,
    ComisionVendedor,
    Fecha,
    NumeroMaquina,
    RowContainer,
} from '../../../LandingPage/Datagrid/DatagridStyles';
import { HeadDatagrid } from '../../../LandingPage/Datagrid/HeadDatagrid';
import {
    FechaContainer,
    ResumenContainer,
    ResumenContent,
    ResumenWrapper,
    TitleResumen,
} from '../../../LandingPage/Resumen/resumenStyles';
import Totales from '../../../LandingPage/Totales/totales';
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
import { formatoFechaLarga } from '../../../../utils/handleFechas';

class ToPrint1 extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { ventasxmaquina, resumenDiario, reporte, tituloReporte } =
            this.props;

        return (
            <div>
                <GlobalStyles print />
                <Container flxdirection={'column'} crud print>
                    <HeaderPrint resumen>
                        <HeaderLeft>Agencia 341</HeaderLeft>
                        <HeaderTitle>Reporte Máquinas</HeaderTitle>
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
                                <HeadDatagrid
                                    print={true}
                                    maquina={true}
                                ></HeadDatagrid>
                                {ventasxmaquina.map((venta, index) => {
                                    {
                                        return (
                                            <RowContainer
                                                print={true}
                                                key={index}
                                            >
                                                <NumeroMaquina>
                                                    {venta.NroMaquina}
                                                </NumeroMaquina>
                                                <Vendedor>
                                                    {venta.Descripcion}
                                                </Vendedor>
                                                <ImporteVenta print>
                                                    {parseFloat(
                                                        venta?.ImporteVenta
                                                    ).toFixed(2)}
                                                </ImporteVenta>

                                                <ComisionVendedor print>
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
                                    maquina={true}
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
            ventasxmaquina={props.ventasxmaquina}
            resumenDiario={props.resumenDiario}
            reporte={props.reporte}
            tituloReporte={props.tituloReporte}
        />
    );
});
