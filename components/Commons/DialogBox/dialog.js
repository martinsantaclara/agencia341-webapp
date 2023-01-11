import React, { useEffect, useRef, useState } from 'react';
import {
    useDeviceContext,
    useStateContext,
} from '../../../context/StateContext';
import { Container } from '../../../styles/globals';
import {
    BgDialogBox,
    ButtonsContainer,
    DialogBox,
    DialogMessage,
    ImprimeCheck,
    LabelImprimeCheck,
    OptionsContainer,
    SecondaryMessage,
    SubmitButton,
} from './dialogStyles';
import { FaRegQuestionCircle } from 'react-icons/fa';

const Dialog = ({
    primaryMessage,
    secondaryMessage = '',
    imprime = false,
    imprimeCheck,
    setImprimeCheck,
    setDialogBox,
    clickSubmit,
}) => {
    const { darkMode } = useStateContext();
    const { mobile } = useDeviceContext();
    const refBtnConfirm = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            refBtnConfirm.current.focus();
        }, 311);
        return () => clearTimeout(timer);
    }, []);

    return (
        <BgDialogBox darkMode={darkMode}>
            <Container>
                <DialogBox mobile={mobile}>
                    <DialogMessage>
                        <FaRegQuestionCircle
                            style={{
                                display: 'block',
                                margin: '0 auto 0.5em',
                            }}
                            size={40}
                        ></FaRegQuestionCircle>
                        {primaryMessage}
                        <SecondaryMessage>{secondaryMessage}</SecondaryMessage>
                    </DialogMessage>

                    <OptionsContainer>
                        {imprime && (
                            <LabelImprimeCheck>
                                <ImprimeCheck
                                    type="checkbox"
                                    checked={imprimeCheck}
                                    onChange={() =>
                                        setImprimeCheck(!imprimeCheck)
                                    }
                                />
                                Imprime resumen
                            </LabelImprimeCheck>
                        )}

                        <ButtonsContainer>
                            <SubmitButton
                                cancel
                                onClick={() => setDialogBox(false)}
                            >
                                Cancela
                            </SubmitButton>
                            <SubmitButton
                                confirm
                                darkMode={darkMode}
                                onClick={
                                    imprime
                                        ? () => clickSubmit(imprimeCheck)
                                        : clickSubmit
                                }
                                ref={refBtnConfirm}
                                // tabIndex={0}
                                autoFocus
                            >
                                Sí
                            </SubmitButton>
                        </ButtonsContainer>
                    </OptionsContainer>
                </DialogBox>
            </Container>
        </BgDialogBox>
    );
};

export default Dialog;
