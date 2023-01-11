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
import TotalesPrintCierre from '../../LandingPage/Totales/totalesPrintCierre';
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
            resumenDiario,
            reporte,
            tituloReporte,
            resumen,
            mensual,
            cierre,
            gastos,
            honorarios = 0,
            impuestos = 0,
            otros = 0,
        } = this.props;

        return (
            <div>
                <GlobalStyles print />
                <Container flxdirection={'column'} crud print>
                    <HeaderPrint resumen>
                        <HeaderLeft>Agencia 341</HeaderLeft>
                        <HeaderTitle>{`${
                            cierre === 'Reporte de Cierres' ? cierre : 'Cierre'
                        }`}</HeaderTitle>
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
                                    <TitleResumen print reporte={true}>
                                        {/* Resumen del día:{' '}
                                        <span style={{ marginLeft: '5px' }}>
                                            {fechaLarga}
                                        </span>{' '} */}
                                        {tituloReporte}
                                    </TitleResumen>
                                </FechaContainer>
                                <HeadDatagrid
                                    cierre={true}
                                    print={true}
                                ></HeadDatagrid>
                                <TotalesPrintCierre
                                    resumenDiario={resumenDiario}
                                    cierremensual={cierre !== 'Cierre Diario'}
                                    gastos={gastos}
                                    honorarios={honorarios}
                                    impuestos={impuestos}
                                    otros={otros}
                                ></TotalesPrintCierre>
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
            resumenDiario={props.resumenDiario}
            reporte={props.reporte}
            tituloReporte={props.tituloReporte}
            resumen={props.resumen}
            mensual={props.mensual}
            cierre={props.cierre}
            gastos={props.gastos}
            honorarios={props.honorarios}
            impuestos={props.impuestos}
            otros={props.otros}
        />
    );
});
