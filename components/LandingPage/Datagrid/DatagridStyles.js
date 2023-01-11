import styled from 'styled-components';
import { IMaskInput } from 'react-imask';

export const HeadDatagridContainer = styled.div`
    display: grid;
    grid-template-columns: ${({ print, reporte }) =>
        print
            ? reporte
                ? '110px 290px 180px repeat(2, 170px)'
                : '80px 200px 130px repeat(2, 120px)'
            : '120px 100px 200px repeat(3, 150px)'};
    grid-template-rows: repeat(2, 30px);
    align-items: center;
    justify-items: center;
    margin: 0 auto 10px;
    max-width: 920px;
    column-gap: 5px;
    background-color: ${({ theme }) => theme.secondary};
    color: white;
    padding: 5px 0;
`;

export const HeadDatagridVendedor = styled.div`
    display: grid;
    grid-template-columns: 350px 200px 200px;
    grid-template-rows: 30px;
    align-items: center;
    justify-items: center;
    justify-content: center;
    margin: 0 auto 10px;
    max-width: 920px;
    column-gap: 5px;
    background-color: ${({ theme }) => theme.secondary};
    color: white;
    padding: 5px 0;
`;

export const HeadFecha = styled.div`
    display: ${({ print }) => (print ? 'none' : '')};
    grid-row: 1 / 3;
`;

export const HeadMaquina = styled.p`
    grid-row: 1 / 3;
`;

export const HeadVendedor = styled.p`
    grid-row: ${({ vendedor }) => (vendedor ? '' : '1 / 3')};
`;

export const HeadVenta = styled.p`
    grid-row: ${({ vendedor }) => (vendedor ? '' : '1 / 3')};
`;

export const HeadComision = styled.p`
    grid-column: ${({ print, vendedor }) =>
        print ? '4 / 6' : vendedor ? '' : '5 / 7'};
    grid-row: ${({ vendedor }) => (vendedor ? '' : '1 / 2')};
`;

export const HeadComisionVendedor = styled.p`
    grid-row: 2 / 3;
`;

export const HeadComisionAgencia = styled.p`
    grid-row: 2 / 3;
`;

export const RowContainer = styled.div`
    font-size: 1rem;
    display: grid;
    grid-template-columns: ${({ print, reporte }) =>
        print
            ? reporte
                ? '110px 290px 180px repeat(2, 170px)'
                : '80px 200px 130px repeat(2, 120px)'
            : '120px 100px 200px repeat(3, 150px)'};
    row-gap: 10px;
    column-gap: 5px;
    align-items: center;
    margin: 0 auto 10px;
    color: ${({ theme }) => theme.onSurface1};
    border-bottom: 1px solid ${({ theme }) => theme.onSurface2};
    max-width: 920px;
`;

export const RowContainerVendedor = styled.div`
    font-size: 1rem;
    display: grid;
    grid-template-columns: 350px 200px 200px;
    row-gap: 10px;
    column-gap: 5px;
    justify-content: center;
    align-items: center;
    margin: 0 auto 10px;
    color: ${({ theme }) => theme.onSurface1};
    border-bottom: 1px solid ${({ theme }) => theme.onSurface2};
    max-width: 920px;
`;

export const Fecha = styled.div`
    // font-size: 1rem;
    // background-color: lightBlue;
    // color: white;
    display: ${({ print }) => (print ? 'none' : '')};
    text-align: center;
    padding: 5px;
`;

export const NumeroMaquina = styled.div`
    // font-size: 1rem;
    // background-color: black;
    // color: white;
    text-align: center;
    padding: 5px;
`;

export const Vendedor = styled.div`
    // color: white;
    // background-color: black;
    padding: 5px;
    // font-size: 1rem;
    margin-right: 5px;
`;

export const ImporteWrapper = styled.div`
    position: relative;
    font-size: 1rem;
    &:before {
        content: '$';
        position: absolute;
        left: 5px;
        top: -12px;
        // color: black;
        z-index: 1;
    }
`;

export const ImporteVenta = styled(IMaskInput)`
    position: absolute;
    width: ${({ print }) => (print ? '130px' : '150px')};
    font-size: 1rem;
    border: none;
    text-align: right;
    padding: 5px;
    right: 5px;
    top: -17px;
    background-color: transparent;
    color: ${({ theme }) => theme.onSurface1};
`;

export const ComisionVendedor = styled.div`
    position: relative;
    // font-size: 1rem;
    width: ${({ print, reporte }) => (print && !reporte ? '120px' : '150px')};
    text-align: right;
    // color: white;
    // background-color: burlywood;
    padding: 5px;
    &:before {
        content: '$';
        position: absolute;
        left: 10px;
    }
`;

export const ComisionAgencia = styled.div`
    position: relative;
    // font-size: 1rem;
    width: ${({ print, reporte }) => (print && !reporte ? '120px' : '150px')};
    text-align: right;
    // color: white;
    // background-color: cadetblue;
    padding: 5px;
    &:before {
        content: '$';
        position: absolute;
        left: 10px;
    }
`;
