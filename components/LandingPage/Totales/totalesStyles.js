import styled from 'styled-components';
import { IMaskInput } from 'react-imask';

export const TotalesWrapper = styled.div`
    position: relative;
`;

export const TotalesContainer = styled.div`
    display: grid;
    grid-template-columns: ${({ print, reporte }) =>
        print
            ? reporte
                ? '110px 290px 180px repeat(2, 170px)'
                : '80px 200px 130px repeat(2, 120px)'
            : '120px 100px 200px repeat(3, 150px)'};
    grid-template-rows: repeat(2, 30px) 40px;
    column-gap: 5px;
    max-width: 920px;
    margin: 0 auto;

    // position: absolute;
    // right: -22px;
`;

export const Fecha = styled.div`
    display: ${({ print }) => (print ? 'none' : '')};
`;

export const Maquina = styled.div``;

export const Vendedor = styled.div`
    padding: 5px;
    padding-left: ${({ vendedor, print }) =>
        print ? '50px' : vendedor ? '20px' : ''};
    font-size: 1rem;
    margin-right: 5px;
    margin-top: ${({ totales }) => (totales ? '10px' : '')};
`;

export const ImporteVenta = styled.div`
    position: relative;
    font-size: 1rem;
    text-align: right;
    padding: 5px 10px 5px 5px;
    background-color: ${({ totales, theme }) =>
        totales ? theme.secondary : ''};
    color: ${({ totales }) => (totales ? 'white' : '')};
    margin-top: ${({ totales }) => (totales ? '10px' : '')};
    width: ${({ print, reporte }) => (print && !reporte ? '130px' : '150px')};
    height: ${({ maquina }) => (maquina ? '35px' : '')};
    &:before {
        content: '$';
        position: absolute;
        left: 5px;
        // color: black;
        z-index: ${({ noShowMoneda }) => (noShowMoneda ? 0 : 1)};
    }
`;

export const GastoNulo = styled.div`
    // position: relative;
    width: 150px;
`;

export const ComisionVendedor = styled.div`
    position: relative;
    // font-size: 1rem;
    width: ${({ print, reporte }) =>
        print && !reporte ? '120px' : reporte ? '155px' : '150px'};
    height: ${({ maquina }) => (maquina ? '35px' : '')};
    text-align: right;
    color: ${({ totales }) => (totales ? 'white' : '')};
    background-color: ${({ totales, theme }) =>
        totales ? theme.secondary : ''};
    padding: 5px ${({ reporte }) => (reporte ? '10px' : '5px')} 5px 5px;
    margin-top: ${({ totales }) => (totales ? '10px' : '')};
    &:before {
        content: '$';
        position: absolute;
        left: 10px;
    }
`;

export const ComisionAgencia = styled.div`
    position: relative;
    // font-size: 1rem;
    width: ${({ print, reporte }) =>
        print && !reporte ? '120px' : reporte ? '155px' : '150px'};
    height: ${({ maquina, cierre }) =>
        maquina ? '35px' : cierre ? '30px' : ''};
    text-align: right;
    color: ${({ totales, cierre }) =>
        totales ? 'white' : cierre ? 'red' : ''};
    background-color: ${({ totales, theme }) =>
        totales ? theme.secondary : ''};
    padding: 5px ${({ reporte }) => (reporte ? '10px' : '5px')} 5px 5px;
    margin-top: ${({ totales, cierre }) =>
        totales ? '10px' : cierre ? '14px' : ''};
    border: ${({ cierre }) => (cierre ? '1px solid red' : '')};

    &:before {
        content: '$';
        position: absolute;
        left: 10px;
        bottom: ${({ cierre }) => (cierre ? '2px' : '')};
    }
`;

export const ImporteGasto = styled(IMaskInput)`
    position: absolute;
    width: ${({ print }) => (print ? '130px' : '150px')};
    font-size: 1rem;
    border: none;
    text-align: right;
    padding: 5px;
    right: 5px;
    top: -3px;
    background-color: transparent;
    color: red;
    &:focus {
        border: none;
        outline: none;
    }
`;

export const ImporteBeneficio = styled.div`
    position: relative;
    // font-size: 1rem;
    width: ${({ print, reporte }) =>
        print && !reporte ? '120px' : reporte ? '155px' : '150px'};
    height: ${({ maquina, cierre }) =>
        maquina ? '35px' : cierre ? '30px' : ''};
    text-align: right;
    color: white;
    background-color: ${({ beneficio }) => (beneficio ? 'green' : 'red')};
    padding: 5px ${({ reporte }) => (reporte ? '10px' : '5px')} 5px 5px;
    margin-top: ${({ totales, cierre }) =>
        totales ? '10px' : cierre ? '14px' : ''};
    &:before {
        content: '$';
        position: absolute;
        left: 10px;
        bottom: ${({ cierre }) => (cierre ? '2px' : '')};
    }
`;

export const LineaTotales = styled.div`
    position: absolute;
    height: 2px;
    background-color: ${({ theme }) => theme.secondary};
    width: ${({ print, reporte }) =>
        print && !reporte ? '600px' : reporte ? '810px' : '685px'};
    right: 0;
    bottom: 35px;
    @media screen and (min-width: 1064px) {
        right: ${({ screenWidth, print, reporte }) =>
            print && !reporte
                ? '0'
                : reporte
                ? `calc((${screenWidth}px - 920px) * 0.5)`
                : `calc((${screenWidth}px - 1064px) * 0.51)`};
    }
`;

export const LineaTotalesGastos = styled.div`
    position: absolute;
    height: 2px;
    background-color: ${({ theme }) => theme.secondary};
    width: ${({ print, reporte }) =>
        print && !reporte ? '600px' : reporte ? '810px' : '685px'};
    right: 0;
    bottom: ${({ linea, cierremensual }) =>
        linea === 1
            ? cierremensual
                ? '256px'
                : '124px'
            : linea === 2
            ? cierremensual
                ? '212px'
                : '80px'
            : '35px'};
    @media screen and (min-width: 1064px) {
        right: ${({ screenWidth, print, reporte }) =>
            print && !reporte
                ? '0'
                : reporte
                ? `calc((${screenWidth}px - 920px) * 0.5)`
                : `calc((${screenWidth}px - 1064px) * 0.51)`};
    }
`;
