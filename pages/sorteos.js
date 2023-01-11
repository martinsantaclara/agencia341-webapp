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
import {
    LinkWrapper,
    Logo,
} from '../components/LandingPage/Header/headerStyles';
import { FcCellPhone } from 'react-icons/fc';
import ReactTooltip from 'react-tooltip';
import {
    useDeviceContext,
    useSorteosContext,
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

import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import es from 'date-fns/locale/es'; // the locale you want
import { formatoFechaArgentina } from '../components/LandingPage/Datagrid/DatagridRow';
registerLocale('es', es); // register it with the name you want

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

export function formatoFecha(fecha) {
    return [
        fecha.getFullYear(),
        padTo2Digits(fecha.getMonth() + 1),
        padTo2Digits(fecha.getDate()),
    ].join('-');
}

const modeloSorteo = () => {
    return {
        id: 0,
        OrdenSorteo: 0,
        NombreSorteo: '',
        FechaSorteo: formatoFecha(new Date()),
        NumeroSorteo: 0,
    };
};

const Sorteos = () => {
    const [pendiente, setPendiente] = useState(true);
    // const [maquinas, setMaquinas] = useState([]);
    const [verModal, setVerModal] = useState(false);

    const [fecha, setFecha] = useState(formatoFecha(new Date()));
    const [datePicker, setDatePicker] = useState(new Date());

    const { darkMode, activeContainer, setActiveContainer } = useStateContext();
    const { sorteos, setSorteos } = useSorteosContext();

    const [sorteo, setSorteo] = useState(() => modeloSorteo());

    const { mobile } = useDeviceContext();
    const [dialogBox, setDialogBox] = useState(false);

    const [crud, setCrud] = useState('');

    const validationSchema = Yup.object().shape({
        OrdenSorteo: Yup.number()
            .required('Debe ingresar un valor!!!')
            .test(
                'test-ordenSorteo',
                'El orden de sorteo ya fue asignado!!!',
                (value) => checkExistSorteo(sorteos, value) < 0
            ),
        NombreSorteo: Yup.string()
            .min(3, 'El Nombre del Sorteo debe tener al menos 3 caracteres!!!')
            .max(
                50,
                'El Nombre del Sorteo debe tener como máximo 50 caracteres!!!'
            )
            .required('Debe ingresar un Nombre para el Sorteo!!!')
            .test(
                'test-nombreSorteo',
                'El nombre de sorteo ya existe!!!',
                (value) => checkExistNombre(sorteos, value) < 0
            ),
    });

    const checkExistSorteo = (sorteos, ordenSorteo) => {
        const exist = sorteos.findIndex(
            (sorteo) => sorteo.OrdenSorteo === ordenSorteo
        );
        return crud === 'create' ? exist : -1;
    };

    const checkExistNombre = (sorteos, nombreSorteo) => {
        const exist = sorteos.findIndex(
            (sorteo) => sorteo.NombreSorteo === nombreSorteo
        );
        return crud === 'create' ? exist : -1;
    };

    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState, setValue, clearErrors } =
        useForm(formOptions);
    const { errors } = formState;

    const handleChange = (e) => {
        let value = e.target.value;

        if (
            e.target.name === 'OrdenSorteo' ||
            e.target.name === 'NumeroSorteo'
        ) {
            value = parseInt(value);
        }

        if (
            e.target.name === 'OrdenSorteo' ||
            e.target.name === 'NombreSorteo'
        ) {
            clearErrors([e.target.name]);
        }
        setSorteo({
            ...sorteo,
            [e.target.name]: value,
        });
    };

    const obtenerSorteos = async () => {
        try {
            const { data } = await axios.get('api/sorteos');
            const sorteos = data;
            setSorteos(sorteos);
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
        obtenerSorteos();
        setActiveContainer(true);
    }, []);

    const columns = [
        {
            name: <div style={{ textAlign: 'center' }}>Orden</div>,
            selector: (row) => row.OrdenSorteo,
            sortable: false,
            center: true,
        },
        {
            name: 'Nombre',
            selector: (row) => row.NombreSorteo,
            sortable: false,
        },
        {
            name: 'Fecha',
            selector: (row) =>
                formatoFechaArgentina(
                    formatoFecha(
                        new Date(
                            row.FechaSorteo.replace(/-/g, '/').replace(
                                /T.+/,
                                ''
                            )
                        )
                    )
                ),
            sortable: false,
            center: true,
        },
        {
            name: 'Número',
            selector: (row) => row.NumeroSorteo,
            sortable: false,
            center: true,
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
                        data-tip="Modifica Sorteo"
                    >
                        <FaPenAlt></FaPenAlt>
                    </Button>

                    <Button
                        color="danger"
                        size="sm"
                        // onClick={() => eliminarVendedor(row.id)}
                        onClick={() => deleteSorteo(row)}
                        data-tip="Elimina Sorteo"
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

    const abrirEditarModal = (sorteo = modeloSorteo()) => {
        setSorteo(sorteo);
        setValue('id', sorteo.id);
        setValue('OrdenSorteo', sorteo.OrdenSorteo);
        setValue('NombreSorteo', sorteo.NombreSorteo);
        setValue('FechaSorteo', sorteo.FechaSorteo.substring(0, 10)),
            setValue('NumeroSorteo', sorteo.NumeroSorteo);
        setCrud(sorteo.id === 0 ? 'create' : 'update');
        setVerModal(true);
    };

    const cerrarModal = (e) => {
        e.preventDefault();
        setSorteo(() => modeloSorteo());
        setVerModal(false);
    };

    const existenSorteos = async (sorteoId) => {
        try {
            const { data } = await axios.get(
                `/api/ventasxdia/sorteo/?sorteoId=${sorteoId}`
            );
            return data.length > 0;
        } catch (error) {
            handleNotifications(
                'danger',
                'Error inesperado!',
                'Contáctese con su Administrador!!!'
            );
        }
    };

    const deleteSorteo = async (sorteo) => {
        if (await existenSorteos(sorteo.id)) {
            handleNotifications(
                'warning',
                'Elimina Sorteo',
                'Ese sorteo tiene registros. No lo puede eliminar!!!'
            );
        } else {
            setSorteo(sorteo);
            setCrud('delete');
            setDialogBox(true);
        }
    };

    const eliminaSorteo = async (id) => {
        const { data } = await axios.delete(`/api/sorteos/${id}`);
    };

    const elimina = async () => {
        const id = sorteo.id;
        const result = await toast.promise(
            eliminaSorteo(id),

            {
                loading: <b>Eliminando Sorteo...</b>,
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
                        'Elimina Sorteo',
                        'Sorteo eliminado exitosamente!!!'
                    );
                    obtenerSorteos();
                    setTimeout(() => {
                        setSorteo(() => modeloSorteo());
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

    const actualizaSorteo = async () => {
        const body = sorteo;
        const header = {
            'Content-Type': 'application/json;charset=utf-8',
        };

        if (sorteo.id == 0) {
            const { data } = await axios.post(`/api/sorteos`, body, header);
            return data;
        } else {
            const { data } = await axios.put(`/api/sorteos`, body, header);
            return data;
        }
    };

    const actualiza = async () => {
        const result = await toast.promise(
            actualizaSorteo(),

            {
                loading: (
                    <b>{`${
                        sorteo.id == 0 ? 'Agregando' : 'Actualizando'
                    } Sorteo...`}</b>
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
                    obtenerSorteos();
                    setTimeout(() => {
                        setSorteo(() => modeloSorteo());
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
                            <TitleCardHeader>Sorteos</TitleCardHeader>
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
                                    data-tip="Nuevo Sorteo"
                                    onClick={() => abrirEditarModal()}
                                    noHeader
                                >
                                    {/* <FcCellPhone size={32}></FcCellPhone> */}
                                    <Logo
                                        src={`/assets/imagenes/sorteo.png`}
                                        alt={'agrega sorteo'}
                                        sorteo
                                    />
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
                            </HeaderBody>
                            <hr></hr>
                            <DataTable
                                columns={columns}
                                data={sorteos}
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
                    <ModalTitle>Detalle Sorteo</ModalTitle>
                </ModalHeaderStyled>
                <ModalBodyStyled>
                    <div className="card">
                        <form>
                            <ModalCardHeader className="card-header">{`${
                                sorteo.id === 0 ? 'Nuevo ' : 'Actualiza '
                            }Sorteo`}</ModalCardHeader>
                            <ModalCardBody className="card-body">
                                <div className="form-group mb-3">
                                    <label>Orden</label>
                                    <input
                                        name="OrdenSorteo"
                                        type="number"
                                        {...register('OrdenSorteo')}
                                        className={`form-control ${
                                            errors.OrdenSorteo
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
                                        {errors.OrdenSorteo?.message}
                                    </div>
                                </div>
                                <div className="form-group  mb-3">
                                    <label>Nombre </label>
                                    <input
                                        name="NombreSorteo"
                                        placeholder="Nombre del sorteo"
                                        type="text"
                                        {...register('NombreSorteo')}
                                        className={`form-control ${
                                            errors.NombreSorteo
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
                                        {errors.NombreSorteo?.message}
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Fecha</label>
                                    <input
                                        name="FechaSorteo"
                                        type="date"
                                        {...register('FechaSorteo')}
                                        className={`form-control`}
                                        onChange={handleChange}
                                        style={{
                                            backgroundColor: 'transparent',
                                            color: darkMode
                                                ? 'white'
                                                : 'hsl(219 29% 14%)',
                                            marginTop: '0.3rem',
                                        }}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Número</label>
                                    <input
                                        name="NumeroSorteo"
                                        type="number"
                                        {...register('NumeroSorteo')}
                                        className={`form-control`}
                                        onChange={handleChange}
                                        style={{
                                            backgroundColor: 'transparent',
                                            color: darkMode
                                                ? 'white'
                                                : 'hsl(219 29% 14%)',
                                            marginTop: '0.3rem',
                                        }}
                                    />
                                </div>
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
                                        {sorteo.id === 0
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
                            ? 'Elimina '
                            : crud === 'create'
                            ? 'Agrega '
                            : 'Actualiza datos del '
                    } Sorteo`}
                    secondaryMessage={sorteo.NombreSorteo}
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

export default Sorteos;
