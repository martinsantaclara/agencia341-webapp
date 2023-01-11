import styled from 'styled-components';
export const BgDialogBox = styled.div`
    position: fixed;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    background: ${({ darkMode }) =>
        !darkMode
            ? `linear-gradient(
        hsla(0, 0%, 0%, 0.8),
        hsla(0, 0%, 0%, 0.4),
        hsla(0, 0%, 0%, 0.8)
    )`
            : `linear-gradient(
        hsla(0, 0%, 0%, 0.8),
        hsla(255, 100%, 100%, 0.7),
        hsla(255, 100%, 100%, 0.1)
    )`};
    z-index: 1;
`;

export const DialogBox = styled.div`
    width: ${({ mobile }) => (mobile ? '75%' : '50%')};
    min-width: ${({ mobile }) => (mobile ? '300px' : '350px')};
    max-width: 405px;
    border-radius: 0.375rem;
    padding: 1.5rem;
    margin: 0 auto;
    background-color: ${({ theme }) => theme.surface};
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.5rem;
    box-shadow: 10px 10px 35px 0 rgba(0, 0, 0, 1);
`;

export const DialogMessage = styled.div`
    font-size: 1em;
    text-align: center;
    font-weight: 900;
    color: ${({ theme }) => theme.onSurface1};
    background-color: ${({ theme }) => theme.surface};
`;

export const SecondaryMessage = styled.p`
    font-size: 1.5rem;
    font-weight: 400;
`;

export const OptionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 3rem;
`;

export const LabelImprimeCheck = styled.label`
    font-size: 0.75em;
    margin-right: ${({ resumen }) => (resumen ? '1rem' : '')};
`;

export const ImprimeCheck = styled.input`
    width: 1.25em;
    height: 1.25em;
    accent-color: ${({ theme }) => theme.primary};
    margin-right: ${({ resumen }) => (resumen ? '0.5rem' : '1rem')};
    position: relative;
    top: 3px;
`;

export const ButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-self: end;
    margin-top: 0.75rem;
`;

export const SubmitButton = styled.button`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme, cancel }) => (cancel ? theme.onSurface2 : theme.btnClr)};

    background-color: ${({ theme, cancel }) =>
        cancel ? 'transparent' : theme.btnBg};
    border-radius: 0.3125rem;
    border: ${({ cancel, theme }) =>
        cancel ? `1px solid ${theme.onSurface2}` : 'none'};
    cursor: pointer;
    width: ${({ crud }) => (crud ? '125px' : '100px')};
    font-size: ${({ theme }) => theme.fsText_lg}rem;
    font-weight: ${({ theme }) => theme.fwBold};
    line-height: 1;
    padding: 0.75em 0;
    margin-left: ${({ confirm }) => (confirm ? '1rem' : '')};
    :hover,
    :focus {
        background-color: ${({ theme, cancel }) =>
            cancel ? theme.onSurface2 : theme.btnHoverBg};
        color: ${({ theme }) => theme.btnHoverClr};
    }

    :focus {
        border: 1px solid ${({ darkMode }) => (darkMode ? 'black' : 'white')};
        outline: 1px solid ${({ darkMode }) => (darkMode ? 'white' : 'black')} !important;
    }
`;
