import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';
import classnames from 'classnames';

import { FaPenAlt, FaTrashAlt } from 'react-icons/fa';

import { Layout } from '../layout/Layout';
import {
    Container,
    Printer,
    TitleCardHeader,
    HeaderBody,
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
import { FcBusinessman } from 'react-icons/fc';
import ReactTooltip from 'react-tooltip';
import { FaPlusCircle } from 'react-icons/fa';
import { useStateContext, useVentasContext } from '../context/StateContext';

import Dialog from '../components/Commons/DialogBox/dialog';
import {
    ImprimeCheck,
    LabelImprimeCheck,
    SubmitButton,
} from '../components/Commons/DialogBox/dialogStyles';
import toast, { Toaster } from 'react-hot-toast';
import handleNotifications from '../utils/handleNotifications';
import { LoadingText, NoDataText } from '../utils/handleTextReactTable';

const modeloVendedor = {
    id: 0,
    ApellidoVendedor: '',
    NombreVendedor: '',
    // Agencia: 0,
    Activo: 1,
    Domicilio: '',
    localidad: { id: 1, NombreLocalidad: 'Puerto Piray' },
    localidadId: 1,
    Telefono: '',
};

const Vendedores = () => {
    const [vendedor, setVendedor] = useState(modeloVendedor);
    const [pendiente, setPendiente] = useState(true);
    const [verModal, setVerModal] = useState(false);

    const { darkMode, activeContainer, setActiveContainer } = useStateContext();
    const { vendedores, setVendedores, localidades, setLocalidades } =
        useVentasContext();

    const [dialogBox, setDialogBox] = useState(false);

    const [crud, setCrud] = useState('');
    const [todos, setTodos] = useState(false);

    const [ApeyNom, setApeyNom] = useState('');
    const validationSchema = Yup.object().shape({
        ApellidoVendedor: Yup.string().required('Debe ingresar el Apellido!!!'),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState, setValue, clearErrors } =
        useForm(formOptions);
    const { errors } = formState;

    const [activeTab, setActiveTab] = useState('1');

    const handleChange = (e) => {
        let value;
        if (e.target.name === 'localidad') {
            const index = e.target.options.selectedIndex;
            value = e.target.value;
            const nuevoVendedor = {
                ...vendedor,
                ['localidad']: {
                    id: parseInt(e.target.options[index].id),
                    NombreLocalidad: value,
                },
                ['localidadId']: parseInt(e.target.options[index].id),
            };
            setVendedor(nuevoVendedor);
        } else {
            if (e.target.name === 'Activo') {
                value = parseInt(e.target.value);
            } else {
                value = e.target.value;
                if (e.target.name === 'ApellidoVendedor')
                    clearErrors(['ApellidoVendedor']);
            }

            setVendedor({
                ...vendedor,
                [e.target.name]: value,
            });
        }
    };

    const obtenerVendedores = async (todos) => {
        try {
            const { data } = await axios.get(
                `/api/vendedores${todos ? '/todos' : ''}`
            );

            const vendedores = data;

            // const nuevosVendedores = vendedores.map((vendedor) => {
            //     return {
            //         ...vendedor,
            //         ['localidad']: vendedor.localidad.NombreLocalidad,
            //     };
            // });
            setVendedores(vendedores);
        } catch (error) {
            handleNotifications(
                'danger',
                'Error inesperado!',
                'Contáctese con su Administrador!!!'
            );
        }
    };
    const obtenerLocalidades = async () => {
        try {
            const { data } = await axios.get('/api/localidades');
            setLocalidades(data);
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
        obtenerVendedores(todos);
        obtenerLocalidades();
        setActiveContainer(true);
    }, []);

    const columns = [
        {
            name: 'Apellido',
            selector: (row) => row.ApellidoVendedor,
            sortable: true,
            cell: (row) => {
                return (
                    <span style={{ paddingLeft: '30px' }}>
                        {row.ApellidoVendedor}
                    </span>
                );
            },
        },
        {
            name: 'Nombre',
            selector: (row) => row.NombreVendedor,
            sortable: true,
            cell: (row) => {
                return (
                    <span style={{ paddingLeft: '30px' }}>
                        {row.NombreVendedor}
                    </span>
                );
            },
        },
        {
            name: <div style={{ paddingLeft: '25px' }}>Activo?</div>,
            selector: (row) => row.Activo,
            sortable: true,
            center: true,
            cell: (row) => {
                let clase;
                clase = row.Activo
                    ? 'badge bg-info p-2'
                    : 'badge bg-success p-2';
                return (
                    <span className={clase}>{row.Activo ? 'Sí' : 'No'}</span>
                );
            },
        },
        // {
        //     name: <div style={{ paddingLeft: '25px' }}>Es Agencia?</div>,
        //     selector: (row) => row.Agencia,
        //     sortable: true,
        //     center: true,
        //     cell: (row) => {
        //         let clase;
        //         clase = row.Agencia
        //             ? 'badge bg-info p-2'
        //             : 'badge bg-success p-2';
        //         return (
        //             <span className={clase}>{row.Agencia ? 'Sí' : 'No'}</span>
        //         );
        //     },
        // },
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
                        data-tip="Modifica Vendedor"
                    >
                        <FaPenAlt></FaPenAlt>
                    </Button>

                    <Button
                        color="danger"
                        size="sm"
                        onClick={() => deleteVendedor(row)}
                        data-tip="Elimina Vendedor"
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
                backgroundColor: darkMode ? '' : '#eee',
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

    const abrirEditarModal = (vendedor = modeloVendedor) => {
        clearErrors(['ApellidoVendedor']);
        setVendedor(vendedor);
        setValue('id', vendedor.id);
        setValue('ApellidoVendedor', vendedor.ApellidoVendedor);
        setValue('NombreVendedor', vendedor.NombreVendedor);
        setValue('Activo', vendedor.Activo);
        // setValue('Agencia', vendedor.Agencia);
        setValue('Domicilio', vendedor.Domicilio);
        setValue('localidad', vendedor.localidad?.NombreLocalidad || '');
        setValue('localidadId', vendedor.localidadId || 0);
        setValue('Telefono', vendedor.Telefono);
        setVerModal(true);
    };

    const cerrarModal = (e) => {
        e.preventDefault();
        setVendedor(modeloVendedor);
        setVerModal(false);
    };

    const tieneMovimientosVendedor = async (id) => {
        try {
            const { data } = await axios.get(
                `/api/vendedores/ventasxvendedor/${id}`
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

    const deleteVendedor = async (vendedor) => {
        if (await tieneMovimientosVendedor(vendedor.id)) {
            handleNotifications(
                'warning',
                'Elimina Vendedor',
                'Ese vendedor tiene ventas. No lo puede eliminar!!!'
            );
        } else {
            setApeyNom(
                `${vendedor.ApellidoVendedor}  ${vendedor.NombreVendedor || ''}`
            );
            setVendedor(vendedor);
            setCrud('delete');
            setDialogBox(true);
        }
    };

    const eliminaVendedor = async (id) => {
        const { data } = await axios.delete(`/api/vendedores/${id}`);
    };

    const elimina = async (id) => {
        const result = await toast.promise(
            eliminaVendedor(id),

            {
                loading: <b>Eliminando Vendedor...</b>,
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
                        'Elimina Vendedor',
                        'Vendedor eliminado exitosamente!!!'
                    );
                    obtenerVendedores(todos);
                    setVendedor(modeloVendedor);
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

    function onSubmit(vendedor) {
        setApeyNom(
            `${vendedor.ApellidoVendedor}  ${vendedor.NombreVendedor || ''}`
        );
        setCrud(vendedor.id === 0 ? 'create' : 'update');
        setVerModal(false);
        setDialogBox(true);
    }

    const actualizaVendedor = async (vendedor) => {
        const body = vendedor;

        const header = {
            'Content-Type': 'application/json;charset=utf-8',
        };

        if (vendedor.id == 0) {
            const { data } = await axios.post(`/api/vendedores`, body, header);
            return data;
        } else {
            const { data } = await axios.put(`/api/vendedores`, body, header);
            return data;
        }
    };

    const actualiza = async (vendedor) => {
        const result = await toast.promise(
            actualizaVendedor(vendedor),

            {
                loading: (
                    <b>{`${
                        vendedor.id == 0 ? 'Agregando' : 'Actualizando'
                    } Vendedor...`}</b>
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
                    obtenerVendedores(todos);
                    setVendedor(modeloVendedor);
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

    const handleCheck = () => {
        setTodos(!todos);
        obtenerVendedores(!todos);
    };

    const ExpandableComponent = ({ data }) => {
        return (
            <>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '80%',
                        margin: '1rem auto 0',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p
                            style={{
                                fontSize: '14px',
                                fontWeight: '800',
                                marginRight: '0.5rem',
                            }}
                        >
                            Domicilio:
                        </p>
                        <p style={{ fontSize: '14px' }}>{data.Domicilio}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p
                            style={{
                                fontSize: '14px',
                                fontWeight: '800',
                                marginLeft: '2rem',
                                marginRight: '0.5rem',
                            }}
                        >
                            Localidad:
                        </p>
                        <p style={{ fontSize: '14px' }}>
                            {data.localidad.NombreLocalidad}
                        </p>
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '80%',
                        margin: '0.5rem auto 1rem',
                    }}
                >
                    <p
                        style={{
                            fontSize: '14px',
                            fontWeight: '800',
                            marginRight: '0.5rem',
                        }}
                    >
                        Teléfono/s:
                    </p>
                    <p style={{ fontSize: '14px' }}>{data.Telefono}</p>
                </div>
            </>
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
                            <TitleCardHeader>
                                Lista de Vendedores
                            </TitleCardHeader>
                            <Link
                                href={`/printer/vendedores`}
                                passHref
                                prefetch={false}
                            >
                                <a>
                                    <Printer
                                        src="/assets/imagenes/print-icon.png"
                                        alt="imprime vendedores"
                                        data-tip="Imprime vendedores"
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
                                    data-tip="Nuevo Vendedor"
                                    onClick={() => abrirEditarModal()}
                                    noHeader
                                >
                                    <FcBusinessman size={32}></FcBusinessman>
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
                                    Mostrar Todos
                                </LabelImprimeCheck>
                            </HeaderBody>
                            {/* <input
                                name="Todos"
                                type="checkbox"
                                onChange={handleCheck}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: darkMode
                                        ? 'white'
                                        : 'hsl(219 29% 14%)',
                                }}
                            />
                            <label>Mostrar Todos</label> */}
                            <hr></hr>
                            <DataTable
                                columns={columns}
                                data={vendedores}
                                progressPending={pendiente}
                                progressComponent={<LoadingText />}
                                noDataComponent={<NoDataText />}
                                pagination
                                paginationComponentOptions={
                                    paginationComponentOptions
                                }
                                customStyles={customStyles}
                                expandableRows
                                expandableRowsComponent={ExpandableComponent}
                                theme={darkMode ? 'dark' : 'default'}
                            />
                        </CardBody>
                    </Card>
                </Container>
                <Toaster />
                <ReactTooltip type="info" />
            </Layout>

            <ModalContainer isOpen={verModal} hide={dialogBox}>
                <ModalHeaderStyled>
                    <ModalTitle>Detalle Vendedor</ModalTitle>
                </ModalHeaderStyled>
                <ModalBodyStyled>
                    <div className="card">
                        <form>
                            <ModalCardHeader className="card-header">{`${
                                vendedor.id === 0 ? 'Nuevo ' : 'Actualiza '
                            }Vendedor`}</ModalCardHeader>
                            <ModalCardBody className="card-body">
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active: activeTab === '1',
                                            })}
                                            onClick={() => setActiveTab('1')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Datos
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active: activeTab === '2',
                                            })}
                                            onClick={() => setActiveTab('2')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Contacto
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent
                                    activeTab={activeTab}
                                    style={{ marginTop: '1rem' }}
                                >
                                    <TabPane tabId="1">
                                        <div className="form-group mb-3">
                                            <label>Apellido</label>
                                            <input
                                                name="ApellidoVendedor"
                                                type="text"
                                                {...register(
                                                    'ApellidoVendedor'
                                                )}
                                                className={`form-control ${
                                                    errors.ApellidoVendedor
                                                        ? 'is-invalid'
                                                        : ''
                                                }`}
                                                onChange={handleChange}
                                                style={{
                                                    backgroundColor:
                                                        'transparent',
                                                    color: darkMode
                                                        ? 'white'
                                                        : 'hsl(219 29% 14%)',
                                                }}
                                            />
                                            <div className="invalid-feedback">
                                                {
                                                    errors.ApellidoVendedor
                                                        ?.message
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group  mb-4">
                                            <label>Nombre</label>
                                            <input
                                                name="NombreVendedor"
                                                type="text"
                                                {...register('NombreVendedor')}
                                                className="form-control"
                                                onChange={handleChange}
                                                style={{
                                                    backgroundColor:
                                                        'transparent',
                                                    color: darkMode
                                                        ? 'white'
                                                        : 'hsl(219 29% 14%)',
                                                }}
                                            />
                                        </div>
                                        <div
                                            className="form-group"
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                width: '80%',
                                                margin: '0 auto',
                                            }}
                                        >
                                            <div>
                                                <label>Activo ?</label>
                                                <select
                                                    {...register('Activo', {})}
                                                    name="Activo"
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
                                                        marginLeft: '8px',
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
                                            {/* <div>
                                                <label>Agencia ?</label>
                                                <select
                                                    {...register('Agencia', {})}
                                                    name="Agencia"
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
                                                        marginLeft: '8px',
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
                                            </div> */}
                                        </div>
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <div className="form-group mb-3">
                                            <label>Domicilio</label>
                                            <input
                                                name="Domicilio"
                                                type="text"
                                                {...register('Domicilio')}
                                                className="form-control"
                                                onChange={handleChange}
                                                style={{
                                                    backgroundColor:
                                                        'transparent',
                                                    color: darkMode
                                                        ? 'white'
                                                        : 'hsl(219 29% 14%)',
                                                }}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label>Localidad</label>
                                            <select
                                                {...register('localidad')}
                                                name="localidad"
                                                onChange={handleChange}
                                                style={{
                                                    width: '250px',
                                                    textAlign: 'left',
                                                    padding: '0.5rem',
                                                    borderRadius: '5px',
                                                    color: darkMode
                                                        ? 'white'
                                                        : 'hsl(219 29% 14%)',
                                                    backgroundColor:
                                                        'transparent',
                                                    marginLeft: '8px',
                                                }}
                                                value={
                                                    vendedor.localidad
                                                        .NombreLocalidad
                                                }
                                            >
                                                {localidades.map(
                                                    (localidad) => {
                                                        return (
                                                            <option
                                                                key={
                                                                    localidad.id
                                                                }
                                                                value={
                                                                    localidad.NombreLocalidad
                                                                }
                                                                id={parseInt(
                                                                    localidad.id
                                                                )}
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
                                                                {
                                                                    localidad.NombreLocalidad
                                                                }
                                                            </option>
                                                        );
                                                    }
                                                )}
                                            </select>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label>Teléfono/s</label>
                                            <input
                                                name="Telefono"
                                                type="text"
                                                {...register('Telefono')}
                                                className="form-control"
                                                onChange={handleChange}
                                                style={{
                                                    backgroundColor:
                                                        'transparent',
                                                    color: darkMode
                                                        ? 'white'
                                                        : 'hsl(219 29% 14%)',
                                                }}
                                            />
                                        </div>
                                    </TabPane>
                                </TabContent>
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
                                        {vendedor.id === 0
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
                            ? 'Elimina al '
                            : crud === 'create'
                            ? 'Agrega al '
                            : 'Actualiza datos del '
                    } Vendedor`}
                    secondaryMessage={`${ApeyNom}`}
                    imprime={false}
                    imprimeCheck={null}
                    setImprimeCheck={null}
                    setDialogBox={setDialogBox}
                    clickSubmit={() =>
                        crud === 'delete'
                            ? elimina(vendedor.id)
                            : actualiza(vendedor)
                    }
                />
            )}
        </>
    );
};

export default Vendedores;
