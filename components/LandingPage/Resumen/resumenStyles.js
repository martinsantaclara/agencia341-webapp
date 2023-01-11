import styled from 'styled-components';
import { GlobalContainer } from '../../../styles/globals';
import DatePicker from 'react-datepicker';

export const ResumenContainer = styled.section`
    ${GlobalContainer}
    margin: ${({ reporte }) => (reporte ? '3rem' : '5.25rem')} auto 2rem;
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    row-gap: 3rem;
    @media ${({ theme }) => theme.breakpoints.md} {
        max-width: ${({ print, reporte }) =>
            print && !reporte ? '730px' : '69.375rem'};
    }

    @media ${({ theme }) => theme.breakpoints.xxl} {
        max-width: ${({ print, reporte }) =>
            print && !reporte ? '730px' : '69.375rem'};
    }
`;

export const ResumenWrapper = styled.div`
    width: 100%;
    padding: ${({ reporte }) => (reporte ? '1rem' : 0)} 2rem 1rem;
    margin-top: ${({ reporte }) => (reporte ? '0.625rem' : '')};
    background-color: ${({ theme }) => theme.surface};
    border-radius: 0.375rem;
    max-width: ${({ print, reporte }) => (print && !reporte ? '738px' : '')};
    min-height: 210px;

    // @media ${({ theme }) => theme.breakpoints.md} {
    //     padding: 0 1rem 2.25rem 2rem;
    // }
`;

export const ResumenContent = styled.article`
    margin: -4rem auto 0;
`;

export const HeadResumen = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: ${({ reporte }) => (reporte ? '920px' : '')};
    margin: ${({ reporte }) => (reporte ? '0 auto' : '')};
    margin-bottom: 10px;
`;

export const FechaContainer = styled.div`
    display: flex;
    align-items: center;
    width: ${({ print }) => (print ? '100%' : '650px')};
`;

export const TitleResumen = styled.p`
    font-size: ${({ reporte }) => (reporte ? '1.25rem' : '1rem')};
    width: ${({ print, page, reporte }) =>
        print || page ? '100%' : reporte ? '' : '30px'};
    color: ${({ theme, print }) =>
        print ? 'hsl(214 17% 51%)' : theme.clrHeading};
    margin-bottom: ${({ print }) => (print ? '1rem' : '')};
    margin-right: 0.5rem;
    // margin-left: ${({ reporteHasta }) => (reporteHasta ? '-40px' : '')};
    margin-left: ${({ reporteHasta }) => (reporteHasta ? '0.5rem' : '')};
`;

export const FechaPicker = styled(DatePicker)`
    width: ${({ reporte }) => (reporte ? '100px' : '150px')};
    border-radius: ${({ reporte }) => (reporte ? '5px' : '10px')};
    font-size: ${({ reporte }) => (reporte ? '1rem' : '1.5rem')};
    border: 2px solid rgb(118, 118, 118);
    height: 35px;
    text-align: center;
    cursor: pointer;
`;

export const TipoSorteo = styled.select`
    color: black;
    background-color: white;
    border: 2px solid rgb(118, 118, 118);
    width: 190px;
    text-align: left;
    border-radius: 5px;
    padding-left: 5px;
    margin-left: 1rem;
    height: 35px;
`;

export const LabelNumeroSorteo = styled.p`
    font-size: 1rem;
    width: 76px;
    color: ${({ theme, print }) =>
        print ? 'hsl(214 17% 51%)' : theme.clrHeading};
    margin-bottom: ${({ print }) => (print ? '1rem' : '')};
    margin-right: 5px;
    margin-left: 0.75rem;
`;

export const NumeroSorteo = styled.input`
    color: black;
    background-color: white;
    border: 2px solid rgb(118, 118, 118);
    border-radius: 5px;
    font-size: 1rem;
    width: 60px;
    text-align: right;
    padding-right: 5px;
`;

export const BtnIr = styled.div`
    border-radius: 20px;
    width: 75px;
    // margin: 2rem 0 2rem auto;
    padding: 0.5rem 2rem;
    // margin-left: ${({ reporte }) => (reporte ? '-40px' : '1rem')};
    margin-left: 1rem;
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.onPrimary};
    cursor: pointer;
    text-align: center;
    z-index: ${({ activeContainer }) => (activeContainer ? 1 : 0)};
    &:focus,
    &:hover {
        background-color: ${({ theme }) => theme.btnHoverBg};
    }
`;

export const Printer = styled.img`
    width: 64px;
    height: 64px;
`;

export const BtnGuardar = styled.div`
    border-radius: 30px;
    width: ${({ actualiza }) => (actualiza ? '210px' : '180px')};
    margin: ${({ cierre }) => (cierre ? 0 : '2rem')} 0 2rem auto;
    padding: 1rem 2rem;
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme, disable }) =>
        disable ? theme.onSurface2 : theme.onPrimary};
    cursor: pointer;
    text-align: center;
    font-weight: ${({ theme }) => theme.fwBold};
    &:focus,
    &:hover {
        background-color: ${({ theme }) => theme.btnHoverBg};
    }
`;

// display: flex;
//     justify-content: center;
//     align-items: center;
