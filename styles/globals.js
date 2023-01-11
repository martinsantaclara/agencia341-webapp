import styled, { css } from 'styled-components';

export const sharedStyleButtons = css`
    position: relative;
    color: ${({ theme, inverted, darkMode, mobile }) =>
        inverted
            ? darkMode && !mobile
                ? theme.btnDarkInvertedClr
                : theme.btnInvertedClr
            : theme.btnClr};
    background-color: ${({ theme, inverted, darkMode, mobile }) =>
        inverted
            ? darkMode && !mobile
                ? theme.btnDarkInvertedBg
                : theme.btnInvertedBg
            : theme.btnBg};
    border-radius: 0.3125rem;
    border: none;
    cursor: pointer;
    font-size: ${({ theme }) => theme.fsText_lg}rem;
    font-weight: ${({ theme }) => theme.fwBold};
    line-height: 1;
    :hover {
        background-color: ${({ theme, inverted, darkMode, mobile }) =>
            inverted
                ? darkMode && !mobile
                    ? theme.btnDarkInvertedHoverBg
                    : theme.btnInvertedHoverBg
                : theme.btnHoverBg};
        color: ${({ theme, inverted, darkMode, mobile }) =>
            inverted
                ? darkMode && !mobile
                    ? theme.btnDarkInvertedHoverClr
                    : theme.btnInvertedHoverClr
                : theme.btnHoverClr};
    }
`;

export const GlobalContainer = css`
    position: relative;
    width: 87.2%;
    margin: 0 auto;
    min-width: 17.1875rem;
    max-width: 31.25rem;
    @media screen and (min-width: 768px) {
        width: 89.71%;
        // max-width: 62.5rem;
        max-width: 69.375rem;
    }

    @media screen and (min-width: 1440px) {
        max-width: 1110px;
    }
`;

export const Container = styled.div`
    ${GlobalContainer}
    display: flex;
    flex-direction: ${({ flxdirection }) => flxdirection};
    justify-content: ${({ crud }) => (crud ? 'center' : 'space-between')};
    align-items: ${({ align }) => align};
    margin-top: ${({ crud }) => (crud ? '50px' : '')};
    max-width: ${({ print, configuracion }) =>
        print ? '1110px' : configuracion ? '600px !important' : ''};
    z-index: ${({ activeContainer, navContainer, configuracion }) =>
        activeContainer || navContainer || configuracion ? 1 : 0};
`;

export const MobileMenuContainer = styled.div`
    margin: 0 auto;
    width: 87%;
    display: flex;
    justify-content: space-between;
    top: 6.4375rem;
    position: relative;
    background-color: ${({ theme }) => theme.surface};
    flex-direction: column;
    padding: 2.5rem 0;
    max-width: 25rem;
`;

export const Button = styled.button`
    ${sharedStyleButtons}
`;

export const TitleCardHeader = styled.p``;

export const Printer = styled.img`
    width: 64px;
    height: 64px;
`;

export const HeaderPrint = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto ${({ resumen }) => (resumen ? 0 : '2rem')};
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.onPrimary};
    padding: 1rem 2rem;
    width: 100%;
    max-width: 950px;
`;

export const HeaderLeft = styled.p`
    font-size: 1rem;
    font-weight: 400;
`;

export const HeaderTitle = styled.p`
    font-size: 1.5rem;
    font-weight: 600;
`;

export const HeaderRight = styled.p`
    font-size: 0.875rem;
    font-weight: 400;
`;

export const HeaderBody = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
