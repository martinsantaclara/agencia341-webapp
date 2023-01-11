import {
    HeadComision,
    HeadComisionAgencia,
    HeadComisionVendedor,
    HeadDatagridContainer,
    HeadDatagridVendedor,
    HeadFecha,
    HeadMaquina,
    HeadVendedor,
    HeadVenta,
} from './DatagridStyles';

export const HeadDatagrid = ({
    print = false,
    reporte = false,
    maquina = false,
    cierre = false,
}) => {
    return (
        <HeadDatagridContainer print={print} reporte={reporte}>
            <HeadFecha print={print}>Fecha</HeadFecha>
            <HeadMaquina>{cierre ? '' : 'Máquina'}</HeadMaquina>
            <HeadVendedor>{maquina ? 'Descripción' : 'Vendedor'}</HeadVendedor>
            <HeadVenta>Importe Venta</HeadVenta>
            <HeadComision print={print}>Comisión</HeadComision>
            <HeadComisionVendedor>Vendedor</HeadComisionVendedor>
            <HeadComisionAgencia>Agencia</HeadComisionAgencia>
        </HeadDatagridContainer>
    );
};

export const HeadDatagridContainerVendedor = ({ print = false }) => {
    return (
        <HeadDatagridVendedor>
            <HeadVendedor vendedor>Vendedor</HeadVendedor>
            <HeadVenta vendedor>Importe Venta</HeadVenta>
            <HeadComision vendedor>Comisión</HeadComision>
        </HeadDatagridVendedor>
    );
};
