import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import DataTable, { createTheme } from 'react-data-table-component';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';

import { FaPenAlt, FaTrashAlt, FaPowerOff, FaPlusCircle } from 'react-icons/fa';

import { Layout } from '../layout/Layout';
import {
    Container,
    HeaderBody,
    Printer,
    TitleCardHeader,
} from '../styles/globals';
import {
    ModalBodyStyled,
    ModalCardBody,
    ModalCardFooter,
    ModalCardHeader,
    ModalContainer,
    ModalHeaderStyled,
    ModalTitle,
} from '../styles/modalStyles';
import { LinkWrapper } from '../components/LandingPage/Header/headerStyles';
import { FcCellPhone } from 'react-icons/fc';
import ReactTooltip from 'react-tooltip';
import {
    useDeviceContext,
    useVentasContext,
    useStateContext,
} from '../context/StateContext';

import Dialog from '../components/Commons/DialogBox/dialog';
import {
    ImprimeCheck,
    LabelImprimeCheck,
    SubmitButton,
} from '../components/Commons/DialogBox/dialogStyles';

import toast, { Toaster } from 'react-hot-toast';
import handleNotifications from '../utils/handleNotifications';
import { LoadingText, NoDataText } from '../utils/handleTextReactTable';
import { obtenerConfiguracion } from '../services/configuracion';

// const ObtenerConfiguracion = async (setConfiguracion) => {
//     const { data } = await axios.get('/api/configuracion');
//     setConfiguracion(data[0]);
// };

const ObtenerVendedorAgencia = async (
    idVendedorAgencia,
    setNombreVendedorAgencia,
    setConfiguracion
) => {
    try {
        const { data } = await axios.get(
            `/api/vendedores/${idVendedorAgencia}`
        );
        const vendedor = data;
        setNombreVendedorAgencia(vendedor.ApellidoVendedor);
    } catch (error) {
        // handleNotifications(
        //     'danger',
        //     'Error inesperado!',
        //     'Contáctese con su Administrador!!!'
        // );
    }
};

const modeloMaquina = (
    idVendedorAgencia,
    setConfiguracion,
    nombreVendedorAgencia,
    setNombreVendedorAgencia
) => {
    if (idVendedorAgencia === undefined) {
        obtenerConfiguracion(setConfiguracion);
    }
    ObtenerVendedorAgencia(
        idVendedorAgencia,
        setNombreVendedorAgencia,
        setConfiguracion
    );
    return {
        id: 0,
        NroMaquina: '',
        Descripcion: '',
        vendedor: nombreVendedorAgencia,
        vendedorId: idVendedorAgencia,
        Activa: 1,
    };
};

const Maquinas = () => {
    const [pendiente, setPendiente] = useState(true);
    // const [maquinas, setMaquinas] = useState([]);
    const [verModal, setVerModal] = useState(false);

    // const [vendedores, setVendedores] = useState([]);

    const [nombreVendedorAgencia, setNombreVendedorAgencia] = useState('');

    const { darkMode, activeContainer, setActiveContainer } = useStateContext();
    const {
        maquinas,
        setMaquinas,
        vendedores,
        setVendedores,
        configuracion,
        setConfiguracion,
    } = useVentasContext();

    const idVendedorAgencia = configuracion.idVendedorAgencia;
    const [maquina, setMaquina] = useState(() =>
        modeloMaquina(
            idVendedorAgencia,
            setConfiguracion,
            nombreVendedorAgencia,
            setNombreVendedorAgencia
        )
    );

    const { mobile } = useDeviceContext();
    const [dialogBox, setDialogBox] = useState(false);

    const [crud, setCrud] = useState('');
    const [todos, setTodos] = useState(false);

    const validationSchema = Yup.object().shape({
        NroMaquina: Yup.string()
            .required('Debe ingresar un número de máquina!!!')
            .max(
                3,
                'El número de máquina debe tener como máximo 3 caracteres!!!'
            )
            .test(
                'test-nroMaquina',
                'El número de máquina ya existe!!!',
                (value) => checkExistMaquina(maquinas, value) < 0
            ),
        Descripcion: Yup.string()
            .min(3, 'La descripción debe tener al menos 3 caracteres!!!')
            .max(50, 'La descripción debe tener como máximo 50 caracteres!!!')
            .required('Debe ingresar una descripción!!!'),
    });

    const checkExistMaquina = (maquinas, nroMaquina) => {
        const exist = maquinas.findIndex(
            (maquina) => maquina.NroMaquina === nroMaquina
        );
        return crud === 'create' ? exist : -1;
    };

    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState, setValue, clearErrors } =
        useForm(formOptions);
    const { errors } = formState;

    const handleChange = (e) => {
        let value;
        if (e.target.name === 'vendedor') {
            const index = e.target.options.selectedIndex;
            value = e.target.value;
            const nuevaMaquina = {
                ...maquina,
                ['vendedor']: value,
                ['vendedorId']: parseInt(e.target.options[index].id),
            };
            setMaquina(nuevaMaquina);
        } else {
            if (e.target.name === 'Activa') {
                value = parseInt(e.target.value);
            } else {
                value = e.target.value;
                if (e.target.name === 'NroMaquina') {
                    clearErrors(['NroMaquina']);
                } else if (e.target.name === 'Descripcion') {
                    clearErrors(['Descripcion']);
                }
            }
            setMaquina({
                ...maquina,
                [e.target.name]: value,
            });
        }
    };

    const obtenerMaquinas = async (todos) => {
        try {
            const { data } = await axios.get(
                `/api/maquinas${todos ? '/todas' : ''}`
            );
            const maquinas = data;
            const nuevasMaquinas = maquinas.map((maquina) => {
                let apeynom = '';
                const seller = apeynom
                    .concat(
                        maquina.vendedor.ApellidoVendedor,
                        ' ',
                        maquina.vendedor.NombreVendedor || ''
                    )
                    .trim();
                return { ...maquina, ['vendedor']: seller };
            });

            setMaquinas(nuevasMaquinas);
        } catch (error) {
            handleNotifications(
                'danger',
                'Error inesperado!',
                'Contáctese con su Administrador!!!'
            );
        }
    };
    const obtenerVendedores = async () => {
        try {
            const { data } = await axios.get('/api/vendedores');

            const vendedores = data;
            const nuevosVendedores = vendedores.map((vendedor) => {
                let apeynom = '';
                const seller = apeynom
                    .concat(
                        vendedor.ApellidoVendedor,
                        ' ',
                        vendedor.NombreVendedor || ''
                    )
                    .trim();
                return { id: vendedor.id, ApeyNom: seller };
            });
            setVendedores(nuevosVendedores);
            setPendiente(false);
        } catch (error) {
            handleNotifications(
                'danger',
                'Error inesperado!',
                'Contáctese con su Administrador!!!'
            );
        }
    };

    useEffect(() => {
        obtenerMaquinas(todos);
        obtenerVendedores();
        setActiveContainer(true);
    }, []);

    const columns = [
        {
            name: <div style={{ textAlign: 'center' }}>Número de Maquina</div>,
            selector: (row) => row.NroMaquina,
            sortable: true,
            center: true,
            width: '150px',
        },
        {
            name: 'Descripción',
            selector: (row) => row.Descripcion,
            sortable: true,
        },
        {
            name: 'Vendedor',
            selector: (row) => row.vendedor,
            sortable: true,
        },
        {
            name: 'Activa?',
            selector: (row) => row.Agencia,
            sortable: true,
            center: true,
            cell: (row) => {
                let clase;
                clase = row.Activa
                    ? 'badge bg-info p-2'
                    : 'badge bg-success p-2';
                return (
                    <span className={clase}>{row.Activa ? 'Sí' : 'No'}</span>
                );
            },
        },
        {
            name: '',
            center: true,
            cell: (row) => (
                <>
                    <Button
                        color="primary"
                        size="sm"
                        className="me-2"
                        onClick={() => abrirEditarModal(row)}
                        data-tip="Modifica Máquina"
                    >
                        <FaPenAlt></FaPenAlt>
                    </Button>

                    <Button
                        color="danger"
                        size="sm"
                        // onClick={() => eliminarVendedor(row.id)}
                        onClick={() => deleteMaquina(row)}
                        data-tip="Elimina Máquina"
                    >
                        <FaTrashAlt></FaTrashAlt>
                    </Button>
                    <ReactTooltip type="info" />
                </>
            ),
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                fontSize: '16px',
                fontWeight: 800,
                justifyContent: 'center',
            },
        },
        headRow: {
            style: {
                backgroundColor: '#eee',
                flexWrap: 'wrap',
            },
        },
        rows: {
            style: {
                backgroundColor: darkMode
                    ? 'hsl(219 29% 14%)'
                    : 'hsl(0 0% 100%)',
                color: darkMode ? 'hsl(0 0% 100%)' : 'hsl(219 29% 14%)',
                border: '1px solid hsl(214 17% 51%)', // override the row height
            },
        },
    };

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };

    const abrirEditarModal = (
        maquina = modeloMaquina(
            idVendedorAgencia,
            setConfiguracion,
            nombreVendedorAgencia,
            setNombreVendedorAgencia
        )
    ) => {
        clearErrors(['NroMaquina']);
        clearErrors(['Descripcion']);
        setMaquina(maquina);
        setValue('id', maquina.id);
        setValue('NroMaquina', maquina.NroMaquina);
        setValue('Descripcion', maquina.Descripcion);
        setValue('vendedor', maquina.vendedor);
        setValue('vendedorId', maquina.vendedorId);
        setValue('Activa', maquina.Activa);
        setCrud(maquina.id === 0 ? 'create' : 'update');
        setVerModal(true);
    };

    const cerrarModal = (e) => {
        e.preventDefault();
        setMaquina(() =>
            modeloMaquina(
                idVendedorAgencia,
                setConfiguracion,
                nombreVendedorAgencia,
                setNombreVendedorAgencia
            )
        );
        setVerModal(false);
    };

    const tieneMovimientosMaquina = async (id) => {
        try {
            const { data } = await axios.get(`/api/ventas/${id}`);
            return data.length > 0;
        } catch (error) {
            handleNotifications(
                'danger',
                'Error inesperado!',
                'Contáctese con su Administrador!!!'
            );
        }
    };

    const deleteMaquina = async (maquina) => {
        if (await tieneMovimientosMaquina(maquina.id)) {
            handleNotifications(
                'warning',
                'Elimina Máquina',
                'Esa máquina tiene ventas. No la puede eliminar!!!'
            );
        } else {
            setMaquina(maquina);
            setCrud('delete');
            setDialogBox(true);
        }
    };

    const eliminaMaquina = async (id) => {
        const { data } = await axios.delete(`/api/maquinas/${id}`);
    };

    const elimina = async () => {
        const id = maquina.id;
        const result = await toast.promise(
            eliminaMaquina(id),

            {
                loading: <b>Eliminando Máquina...</b>,
                error: (err) => {
                    handleNotifications(
                        'danger',
                        'Error inesperado!',
                        'Contáctese con su Administrador!!!'
                    );
                    setTimeout(() => {
                        setDialogBox(false);
                    }, 3000);
                },
                success: (data) => {
                    handleNotifications(
                        'success',
                        'Elimina Máquina',
                        'Máquina eliminada exitosamente!!!'
                    );
                    obtenerMaquinas(todos);
                    setTimeout(() => {
                        setMaquina(() =>
                            modeloMaquina(
                                idVendedorAgencia,
                                setConfiguracion,
                                nombreVendedorAgencia,
                                setNombreVendedorAgencia
                            )
                        );
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

    function onSubmit() {
        setVerModal(false);
        setDialogBox(true);
    }

    const actualizaMaquina = async () => {
        const body = maquina;
        const header = {
            'Content-Type': 'application/json;charset=utf-8',
        };

        if (maquina.id == 0) {
            const { data } = await axios.post(`/api/maquinas`, body, header);
            return data;
        } else {
            const { data } = await axios.put(`/api/maquinas`, body, header);
            return data;
        }
    };

    const actualiza = async () => {
        const result = await toast.promise(
            actualizaMaquina(),

            {
                loading: (
                    <b>{`${
                        maquina.id == 0 ? 'Agregando' : 'Actualizando'
                    } Máquina...`}</b>
                ),
                error: (err) => {
                    const error = err.response.data;
                    handleNotifications(error.type, error.title, error.message);
                    setTimeout(() => {
                        setDialogBox(false);
                    }, 3000);
                },
                success: (data) => {
                    handleNotifications(data.type, data.title, data.message);
                    obtenerMaquinas(todos);
                    setTimeout(() => {
                        setMaquina(() =>
                            modeloMaquina(
                                idVendedorAgencia,
                                setConfiguracion,
                                nombreVendedorAgencia,
                                setNombreVendedorAgencia
                            )
                        );
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

    const handleCheck = () => {
        setTodos(!todos);
        obtenerMaquinas(!todos);
    };

    return (
        <>
            <Layout>
                <Container crud activeContainer={activeContainer}>
                    <Card
                        style={{
                            maxWidth: '950px',
                            minWidth: '500px',
                            width: '100%',
                        }}
                    >
                        <CardHeader
                            style={{
                                backgroundColor: 'hsl(235 69% 61%)',
                                color: 'hsl(0 0% 100%)',
                                fontSize: '1rem',
                                fontWeight: '600',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.25rem 2rem',
                            }}
                        >
                            <TitleCardHeader>Lista de Máquinas</TitleCardHeader>
                            <Link
                                href={`/printer/maquinas`}
                                passHref
                                prefetch={false}
                            >
                                <a>
                                    <Printer
                                        src="/assets/imagenes/print-icon.png"
                                        alt="imprime máquinas"
                                        data-tip="Imprime máquinas"
                                    />
                                </a>
                            </Link>
                        </CardHeader>
                        <CardBody
                            style={{
                                backgroundColor: darkMode
                                    ? 'hsl(219 29% 10%)'
                                    : 'hsl(210 22% 82%)',
                            }}
                        >
                            <HeaderBody>
                                <LinkWrapper
                                    style={{
                                        position: 'relative',
                                        width: '80px',
                                    }}
                                    data-tip="Nueva Máquina"
                                    onClick={() => abrirEditarModal()}
                                    noHeader
                                >
                                    <FcCellPhone size={32}></FcCellPhone>
                                    <FaPlusCircle
                                        size={32}
                                        color="hsl(333 69% 56%)"
                                        style={{
                                            position: 'absolute',
                                            right: '-7px',
                                            zIndex: '1',
                                        }}
                                    ></FaPlusCircle>
                                </LinkWrapper>
                                <LabelImprimeCheck>
                                    <ImprimeCheck
                                        type="checkbox"
                                        checked={todos}
                                        onChange={handleCheck}
                                    />
                                    Mostrar Todas
                                </LabelImprimeCheck>
                            </HeaderBody>
                            <hr></hr>
                            <DataTable
                                columns={columns}
                                data={maquinas}
                                progressPending={pendiente}
                                progressComponent={<LoadingText />}
                                noDataComponent={<NoDataText />}
                                pagination
                                paginationComponentOptions={
                                    paginationComponentOptions
                                }
                                customStyles={customStyles}
                            />
                        </CardBody>
                    </Card>
                </Container>
                <Toaster />
                <ReactTooltip type="info" />
            </Layout>

            <ModalContainer isOpen={verModal} hide={dialogBox}>
                <ModalHeaderStyled>
                    <ModalTitle>Detalle Máquina</ModalTitle>
                </ModalHeaderStyled>
                <ModalBodyStyled>
                    <div className="card">
                        <form>
                            <ModalCardHeader className="card-header">{`${
                                maquina.id === 0 ? 'Nueva ' : 'Actualiza '
                            }Máquina`}</ModalCardHeader>
                            <ModalCardBody className="card-body">
                                <div className="form-group mb-3">
                                    <label>Número de Máquina</label>
                                    <input
                                        name="NroMaquina"
                                        type="text"
                                        {...register('NroMaquina')}
                                        className={`form-control ${
                                            errors.NroMaquina
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                        onChange={handleChange}
                                        style={{
                                            backgroundColor: 'transparent',
                                            color: darkMode
                                                ? 'white'
                                                : 'hsl(219 29% 14%)',
                                            marginTop: '0.3rem',
                                        }}
                                    />
                                    <div className="invalid-feedback">
                                        {errors.NroMaquina?.message}
                                    </div>
                                </div>
                                <div className="form-group  mb-3">
                                    <label>Descripción</label>
                                    <input
                                        name="Descripcion"
                                        type="text"
                                        {...register('Descripcion')}
                                        className={`form-control ${
                                            errors.Descripcion
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                        onChange={handleChange}
                                        style={{
                                            backgroundColor: 'transparent',
                                            color: darkMode
                                                ? 'white'
                                                : 'hsl(219 29% 14%)',
                                            marginTop: '0.3rem',
                                        }}
                                    />
                                    <div className="invalid-feedback">
                                        {errors.Descripcion?.message}
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Vendedor</label>
                                    <select
                                        {...register('vendedor', {})}
                                        name="vendedor"
                                        onChange={handleChange}
                                        style={{
                                            width: '250px',
                                            textAlign: 'left',
                                            padding: '0.5rem',
                                            borderRadius: '5px',
                                            color: darkMode
                                                ? 'white'
                                                : 'hsl(219 29% 14%)',
                                            backgroundColor: 'transparent',
                                            marginLeft: '8px',
                                        }}
                                        value={maquina.vendedor}
                                        // defaultValue={
                                        //     maquina.vendedor?.ApellidoVendedor
                                        // }
                                    >
                                        {vendedores.map((vendedor) => {
                                            return (
                                                <option
                                                    key={vendedor.id}
                                                    value={vendedor.ApeyNom}
                                                    id={parseInt(vendedor.id)}
                                                    style={{
                                                        color: darkMode
                                                            ? 'white'
                                                            : 'hsl(219 29% 14%)',
                                                        backgroundColor:
                                                            darkMode
                                                                ? 'hsl(219 29% 14%)'
                                                                : 'white',
                                                    }}
                                                    selected
                                                >
                                                    {vendedor.ApeyNom}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <label>Activa ?</label>
                                <select
                                    {...register('Activa', {})}
                                    name="Activa"
                                    onChange={handleChange}
                                    style={{
                                        width: '63px',
                                        textAlign: 'center',
                                        padding: '0.2rem',
                                        borderRadius: '5px',
                                        color: darkMode
                                            ? 'white'
                                            : 'hsl(219 29% 14%)',
                                        backgroundColor: 'transparent',
                                        marginLeft: '8px',
                                    }}
                                >
                                    <option
                                        value={1}
                                        style={{
                                            color: darkMode
                                                ? 'white'
                                                : 'hsl(219 29% 14%)',
                                            backgroundColor: darkMode
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
                                            backgroundColor: darkMode
                                                ? 'hsl(219 29% 14%)'
                                                : 'white',
                                        }}
                                    >
                                        No
                                    </option>
                                </select>
                            </ModalCardBody>
                            <ModalCardFooter
                                className="card-footer"
                                style={{ textAlign: 'right' }}
                            >
                                <SubmitButton
                                    cancel
                                    onClick={cerrarModal}
                                    className="btn btn-secondary"
                                >
                                    Cancelar
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
                                        {maquina.id === 0
                                            ? 'Agrega'
                                            : 'Actualiza'}
                                    </p>
                                </SubmitButton>
                            </ModalCardFooter>
                        </form>
                    </div>
                </ModalBodyStyled>
            </ModalContainer>
            {dialogBox && (
                <Dialog
                    primaryMessage={`${
                        crud === 'delete'
                            ? 'Elimina la '
                            : crud === 'create'
                            ? 'Agrega la '
                            : 'Actualiza datos de la '
                    } Máquina`}
                    secondaryMessage={maquina.NroMaquina}
                    imprime={false}
                    imprimeCheck={null}
                    setImprimeCheck={null}
                    setDialogBox={setDialogBox}
                    clickSubmit={() =>
                        crud === 'delete' ? elimina() : actualiza()
                    }
                />
            )}
        </>
    );
};

export default Maquinas;
