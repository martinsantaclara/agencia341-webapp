import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Layout } from '../layout/Layout';
import { Container, Printer } from '../styles/globals';
import ReactTooltip from 'react-tooltip';
import toast, { Toaster } from 'react-hot-toast';
import handleNotifications from '../utils/handleNotifications';
import {
    ModalBodyStyled,
    ModalCardBody,
    ModalCardFooter,
    ModalContainer,
    ModalHeaderStyled,
    ModalTitle,
} from '../styles/modalStyles';
import {
    BgDialogBox,
    SubmitButton,
} from '../components/Commons/DialogBox/dialogStyles';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useStateContext, useVentasContext } from '../context/StateContext';
import { PageHead, PageTitle, PageWrapper } from '../styles/pageStyles';
import { useRouter } from 'next/router';
import Dialog from '../components/Commons/DialogBox/dialog';

const startConfigUpdate = (configuracion) => {
    let auxConfig = {
        ...configuracion,
        ['PorcentajeAgencia']: Number(
            (configuracion.PorcentajeAgencia * 100).toFixed(1)
        ),
        ['PorcentajeVendedores']: Number(
            (configuracion.PorcentajeVendedores * 100).toFixed(1)
        ),
        // ['vendedor']: `${configuracion.vendedor.ApellidoVendedor}  ${
        //     configuracion.vendedor.NombreVendedor || ''
        // }`,
    };
    return auxConfig;
};

const Configuracion = () => {
    const { darkMode } = useStateContext();
    const { configuracion, setConfiguracion, vendedores, setVendedores } =
        useVentasContext();
    const [dialogBox, setDialogBox] = useState(false);

    const [configUpdate, setConfigUpdate] = useState(
        startConfigUpdate(configuracion)
    );

    const router = useRouter();
    const validationSchema = Yup.object().shape({
        PorcentajeAgencia: Yup.number().positive(),
        PorcentajeVendedores: Yup.number().positive(),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState, setValue, clearErrors } =
        useForm(formOptions);
    const { errors } = formState;

    const handleChange = (e) => {
        let value;
        // if (e.target.name === 'vendedor') {
        //     console.log('ingresa vendedor');

        //     const index = e.target.options.selectedIndex;
        //     value = e.target.value;
        //     const nuevaConfiguracion = {
        //         ...configUpdate,
        //         ['vendedor']: value,
        //         ['idVendedorAgencia']: parseInt(e.target.options[index].id),
        //     };

        //     console.log(nuevaConfiguracion);

        //     setConfigUpdate(nuevaConfiguracion);
        // } else {
        if (e.target.name === 'ImprimeResumen') {
            value = parseInt(e.target.value);
        } else {
            value = parseFloat(e.target.value);
        }
        setConfigUpdate({
            ...configUpdate,
            [e.target.name]: value,
        });
        // }
    };

    // const obtenerVendedores = async () => {
    //     try {
    //         const { data } = await axios.get('/api/vendedores');
    //         const vendedores = data;
    //         setVendedores(vendedores);
    //     } catch (error) {
    //         console.log(error);
    //         handleNotifications(
    //             'danger',
    //             'Error inesperado!',
    //             'Contáctese con su Administrador!!!'
    //         );
    //     }
    // };
    useEffect(() => {
        const ObtenerConfiguracion = async () => {
            const { data } = await axios.get('/api/configuracion');
            setConfiguracion(data[0]);
            setConfigUpdate(startConfigUpdate(configuracion));
        };

        if (isNaN(configUpdate.PorcentajeAgencia)) {
            ObtenerConfiguracion();
        }

        setValue('PorcentajeAgencia', configUpdate.PorcentajeAgencia);
        setValue('PorcentajeVendedores', configUpdate.PorcentajeVendedores);
        // setValue(
        //     'vendedor',
        //     `${configUpdate.vendedor.ApellidoVendedor}  ${
        //         configUpdate.vendedor.NombreVendedor || ''
        //     }`
        // );
        // // setValue('vendedor', 'Di Tullio Miguelito');
        // setValue('idVendedorAgencia', configUpdate.idVendedorAgencia);
        setValue('ImprimeResumen', configUpdate.ImprimeResumen);
        // obtenerVendedores();
    }, [configuracion]);

    // console.log(configuracion);

    const cancelConfiguration = (e) => {
        e.preventDefault();
        router.push('/');
    };

    function onSubmit() {
        setDialogBox(true);
    }

    const actualizaConfiguracion = async () => {
        const body = {
            ...configUpdate,
            ['PorcentajeAgencia']: Number(
                (configUpdate.PorcentajeAgencia / 100).toFixed(3)
            ),
            ['PorcentajeVendedores']: Number(
                (configUpdate.PorcentajeVendedores / 100).toFixed(3)
            ),
        };
        const header = {
            'Content-Type': 'application/json;charset=utf-8',
        };
        const { data } = await axios.put(`/api/configuracion`, body, header);
        return data;
    };

    const actualiza = async () => {
        const result = await toast.promise(
            actualizaConfiguracion(),

            {
                loading: <b>Actualizando datos de Configuración</b>,
                error: (err) => {
                    const error = err.response.data;
                    handleNotifications(error.type, error.title, error.message);
                    setTimeout(() => {
                        setDialogBox(false);
                    }, 3000);
                },
                success: (data) => {
                    handleNotifications(data.type, data.title, data.message);
                    setTimeout(() => {
                        setDialogBox(false);
                    }, 3000);
                },
            },
            {
                success: {
                    duration: 1,
                },
                error: {
                    duration: 1,
                },
                loading: {
                    style: {
                        backgroundColor: '#2f96b4',
                        padding: '10px',
                        color: '#ffffff',
                    },
                },
            }
        );
    };

    return (
        <>
            <Layout>
                <BgDialogBox />

                <Container flxdirection="column" crud configuracion>
                    <ModalHeaderStyled
                        style={{ padding: '1rem', borderRadius: '5px 5px 0 0' }}
                    >
                        <ModalTitle>Configuración General</ModalTitle>
                    </ModalHeaderStyled>
                    <ModalBodyStyled style={{ borderRadius: '0 0 5px 5px' }}>
                        <div className="card" style={{ border: 'none' }}>
                            <form>
                                <ModalCardBody
                                    className="card-body"
                                    style={{
                                        paddingLeft: '6rem',
                                    }}
                                >
                                    <div
                                        className="form-group mb-4 mt-5"
                                        style={{
                                            display: 'flex',
                                            width: '60%',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '100%',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <label>Porcentaje Agencia</label>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <input
                                                    name="PorcentajeAgencia"
                                                    type="number"
                                                    step={0.1}
                                                    {...register(
                                                        'PorcentajeAgencia',
                                                        {
                                                            valueAsNumber: true,
                                                        }
                                                    )}
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    style={{
                                                        backgroundColor:
                                                            'transparent',
                                                        color: darkMode
                                                            ? 'white'
                                                            : 'hsl(219 29% 14%)',
                                                        margin: '0 0.5rem 0 1rem',
                                                        width: '85px',
                                                    }}
                                                />
                                                <div>%</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="form-group mb-4"
                                        style={{
                                            display: 'flex',
                                            width: '60%',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '100%',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <label>Porcentaje Vendedores</label>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <input
                                                    name="PorcentajeVendedores"
                                                    type="number"
                                                    step={0.1}
                                                    {...register(
                                                        'PorcentajeVendedores'
                                                    )}
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    style={{
                                                        backgroundColor:
                                                            'transparent',
                                                        color: darkMode
                                                            ? 'white'
                                                            : 'hsl(219 29% 14%)',
                                                        margin: '0 0.5rem 0 1rem',
                                                        width: '85px',
                                                    }}
                                                />
                                                <div>%</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="form-group mb-5"
                                        style={{
                                            display: 'flex',
                                            width: '60%',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '100%',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <label>
                                                Imprime Resumen por Defecto?
                                            </label>
                                            <select
                                                {...register(
                                                    'ImprimeResumen',
                                                    {}
                                                )}
                                                name="ImprimeResumen"
                                                onChange={handleChange}
                                                style={{
                                                    width: '63px',
                                                    textAlign: 'center',
                                                    padding: '0.2rem',
                                                    borderRadius: '5px',
                                                    color: darkMode
                                                        ? 'white'
                                                        : 'hsl(219 29% 14%)',
                                                    backgroundColor:
                                                        'transparent',
                                                    marginLeft: '1rem',
                                                }}
                                            >
                                                <option
                                                    value={1}
                                                    style={{
                                                        color: darkMode
                                                            ? 'white'
                                                            : 'hsl(219 29% 14%)',
                                                        backgroundColor:
                                                            darkMode
                                                                ? 'hsl(219 29% 14%)'
                                                                : 'white',
                                                    }}
                                                >
                                                    Sí
                                                </option>
                                                <option
                                                    value={0}
                                                    style={{
                                                        color: darkMode
                                                            ? 'white'
                                                            : 'hsl(219 29% 14%)',
                                                        backgroundColor:
                                                            darkMode
                                                                ? 'hsl(219 29% 14%)'
                                                                : 'white',
                                                    }}
                                                >
                                                    No
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </ModalCardBody>
                                <ModalCardFooter
                                    className="card-footer"
                                    style={{ textAlign: 'right' }}
                                >
                                    <SubmitButton
                                        cancel
                                        onClick={cancelConfiguration}
                                        className="btn btn-secondary"
                                    >
                                        Salir
                                    </SubmitButton>
                                    <SubmitButton
                                        type="submit"
                                        disabled={formState.isSubmitting}
                                        className="btn btn-primary"
                                        style={{ marginLeft: '15px' }}
                                        crud
                                        onClick={handleSubmit(onSubmit)}
                                    >
                                        {formState.isSubmitting && (
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                        )}{' '}
                                        <p
                                            style={{
                                                display: 'inline-block',
                                            }}
                                        >
                                            Actualiza
                                        </p>
                                    </SubmitButton>
                                </ModalCardFooter>
                            </form>
                        </div>
                    </ModalBodyStyled>
                </Container>
                <Toaster />
                <ReactTooltip type="info" />
            </Layout>
            {dialogBox && (
                <Dialog
                    primaryMessage={'Actualiza datos de Configuración?'}
                    imprime={false}
                    imprimeCheck={null}
                    setImprimeCheck={null}
                    setDialogBox={setDialogBox}
                    clickSubmit={() => actualiza()}
                />
            )}
        </>
    );
};

export default Configuracion;
