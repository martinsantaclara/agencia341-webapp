import styled from 'styled-components';
import { FcPlus } from 'react-icons/fc';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

export const IconPlus = styled(FcPlus).attrs((props) => ({}))`
    color: 'black';
    background-color: ${({ theme }) => theme.secondary};
`;

export const ModalHeaderStyled = styled(ModalHeader)`
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.onPrimary};
`;

export const ModalTitle = styled.p`
    font-size: 1.25rem;
    font-weight: 600;
`;

export const ModalBodyStyled = styled(ModalBody)`
    background-color: ${({ theme }) => theme.background1};
`;

export const ModalCardHeader = styled.p`
    font-size: 1rem;
    font-weight: 600;
    color: hsla(0 0% 0% / 0.87);
    background-color: hsl(0, 0%, 93%);
`;

export const ModalCardBody = styled.div`
    color: ${({ theme }) => theme.onSurface1};
    background-color: ${({ theme }) => theme.surface};
`;

export const ModalCardFooter = styled.div`
    display: flex;
    justify-content: right;
`;

export const ModalContainer = styled(Modal)`
    z-index: ${({ hide }) => (hide ? 0 : '')};
`;

export const Message = styled.p`
    font-size: 1.5rem;
    font-weight: 400;
`;
