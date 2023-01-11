import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    Links,
    LinkWrapper,
    MenuItem,
    MenuReporte,
    MenuReporteWrapper,
    NavLink,
    SubLink,
    SubMenuReport,
    SubMenuReport1,
    SubMenuReport2,
} from './headerStyles';
import {
    FcBusinessman,
    FcBarChart,
    FcCellPhone,
    FcDocument,
} from 'react-icons/fc';
import { IoSettingsSharp } from 'react-icons/io5';
import { useStateContext } from '../../../context/StateContext';
import Dropdown from './Dropdown';

function useOutsideAlerter(ref, setDropdown0) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setDropdown0(false);
            }
        }
        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);
}

const submenuReportes = [
    {
        title: 'Resumen',
        submenu: [
            {
                title: 'Mensual',
                url: '/reportes/resumen/mensual',
            },
            {
                title: 'Por Fecha',
                url: '/reportes/resumen/porfecha',
            },
        ],
    },
    {
        title: 'Ventas',
        submenu: [
            {
                title: 'Mensual',
                url: '/reportes/ventas/mensual',
            },
            {
                title: 'Por Fecha',
                url: '/reportes/ventas/porfecha',
            },
        ],
    },
    {
        title: 'Vendedor',
        url: '/reportes/vendedor',
        // submenu: [
        //     {
        //         title: 'Por Fecha',
        //         submenu: [
        //             {
        //                 title: 'Por Fecha',
        //                 url: '/reportes/vendedor',
        //             },
        //             {
        //                 title: 'Por Fecha',
        //                 url: '/reportes/vendedor',
        //             },
        //         ],
        //     },
        // ],
    },
    {
        title: 'Máquina',
        url: '/reportes/maquina',
    },
];

const submenuCierres = [
    {
        title: 'Diario',
        url: '/cierrediario',
    },
    {
        title: 'Mensual',
        submenu: [
            {
                title: 'Cierre',
                url: '/cierremensual',
            },
            {
                title: 'Reporte',
                url: '/cierremensual/reporte',
            },
        ],
    },
];

const submenuConfiguracion = [
    {
        title: 'General',
        url: '/configuracion',
    },
    {
        title: 'Sorteos',
        url: '/sorteos',
    },
];

function NavLinks() {
    const [activeMenu, setActiveMenu] = useState(false);
    const [subReport1, setSubReport1] = useState(true);
    const [subReport2, setSubReport2] = useState(true);

    const [pointer, setPointer] = useState(false);

    const { activeContainer, setActiveContainer } = useStateContext();

    const wrapperRef = useRef(null);
    const wrapCierreRef = useRef(null);
    const wrapConfigRef = useRef(null);

    const handleClickMenu = () => {
        setDropdown0((prev) => !prev);
        setActiveContainer(false);
    };

    const handleClickCierre = () => {
        setDropdown1((prev) => !prev);
        setActiveContainer(false);
    };

    const handleClickConfiguracion = () => {
        setDropdown2((prev) => !prev);
        setActiveContainer(false);
    };

    const handleSubReport1 = () => {
        setSubReport1(true);
        setSubReport2(false);
    };

    const handleSubReport2 = () => {
        setSubReport1(false);
        setSubReport2(true);
    };

    const handleSubReport3 = () => {
        setSubReport1(false);
        setSubReport2(false);
    };

    const handleMouseHover = () => {
        setActiveMenu(true);
        setPointer(true);
    };
    const handleMouseLeave = () => {
        setActiveMenu(false);
        // setPointer(false);
    };

    // const handleSubReport = () => {
    //     setSubReport;
    // };
    const depthLevel = 0;
    const [dropdown0, setDropdown0] = useState(false);
    const [dropdown1, setDropdown1] = useState(false);
    const [dropdown2, setDropdown2] = useState(false);

    const [menu, setMenu] = useState('');

    useOutsideAlerter(
        menu === 'Reportes'
            ? wrapperRef
            : menu === 'Cierres'
            ? wrapCierreRef
            : wrapConfigRef,
        menu === 'Reportes'
            ? setDropdown0
            : menu === 'Cierres'
            ? setDropdown1
            : setDropdown2
    );

    return (
        <Links>
            {/* <li
                className="menu-items"
                // ref={ref}
                // onMouseEnter={onMouseEnter}
                // onMouseLeave={onMouseLeave}
            >
                <button
                    // type="button"
                    // aria-haspopup="menu"
                    // aria-expanded={dropdown0 ? 'true' : 'false'}
                    onClick={() => setDropdown0((prev) => !prev)}
                >
                    Services
                </button>
                {dropdown0 &&
                        submenuServices.map((menu, index) => {
                            return (
                                <MenuItems
                                    items={menu}
                                    key={index}
                                    depthLevel={depthLevel}
                                />
                            );
                        })} 
                <Dropdown
                    submenus={submenuReportes}
                    dropdown={dropdown0}
                    depthLevel={depthLevel}
                    setDropdown={setDropdown0}
                />
            </li> */}
            <LinkWrapper
                left
                // onClick={handleClickWrapper}
                ref={wrapperRef}
                // onMouseEnter={handleMouseHover}
                // onMouseLeave={handleMouseLeave}
                onClick={() => setMenu('Reportes')}
            >
                <FcBarChart size={32}></FcBarChart>
                <p
                    style={{
                        color: 'white',
                        fontWeight: '600',
                        marginLeft: '0.5rem',
                        fontSize: '14px',
                        cursor: 'pointer',
                    }}
                    // onClick={() => setDropdown0((prev) => !prev)}
                    onClick={handleClickMenu}
                >
                    Reportes
                </p>
                {/* <ul className={`menu ${activeMenu ? 'show' : ''}`}>
                    {menuItems.map((menu, index) => {
                        return (
                            <MenuItems
                                items={menu}
                                key={index}
                                depthLevel={depthLevel}
                            />
                        );
                    })}
                </ul> */}
                <Dropdown
                    submenus={submenuReportes}
                    dropdown={dropdown0}
                    depthLevel={depthLevel}
                    setDropdown0={setDropdown0}
                />
            </LinkWrapper>
            <LinkWrapper ref={wrapCierreRef} onClick={() => setMenu('Cierres')}>
                <FcDocument size={32}></FcDocument>
                <p
                    style={{
                        color: 'white',
                        fontWeight: '600',
                        marginLeft: '0.5rem',
                        fontSize: '14px',
                        cursor: 'pointer',
                    }}
                    // onClick={() => setDropdown0((prev) => !prev)}
                    onClick={handleClickCierre}
                >
                    Cierres
                </p>
                {/* <ul className={`menu ${activeMenu ? 'show' : ''}`}>
                    {menuItems.map((menu, index) => {
                        return (
                            <MenuItems
                                items={menu}
                                key={index}
                                depthLevel={depthLevel}
                            />
                        );
                    })}
                </ul> */}
                <Dropdown
                    submenus={submenuCierres}
                    dropdown={dropdown1}
                    depthLevel={depthLevel}
                    setDropdown0={setDropdown1}
                />
            </LinkWrapper>

            <Link href="/vendedores">
                <LinkWrapper right>
                    {/* <NavLink> */}
                    <FcBusinessman size={32}></FcBusinessman>
                    {/* </NavLink> */}
                    <p
                        style={{
                            color: 'white',
                            fontWeight: '600',
                            marginLeft: '0.5rem',
                            fontSize: '14px',
                        }}
                    >
                        Vendedores
                    </p>
                </LinkWrapper>
            </Link>
            <Link href="/maquinas">
                <LinkWrapper>
                    {/* <NavLink> */}
                    <FcCellPhone size={32}></FcCellPhone>
                    {/* </NavLink> */}
                    <p
                        style={{
                            color: 'white',
                            fontWeight: '600',
                            marginLeft: '0.5rem',
                            fontSize: '14px',
                        }}
                    >
                        Máquinas
                    </p>
                </LinkWrapper>
            </Link>

            <LinkWrapper
                ref={wrapConfigRef}
                onClick={() => setMenu('Configuracion')}
            >
                <IoSettingsSharp size={32} color="white"></IoSettingsSharp>
                <p
                    style={{
                        color: 'white',
                        fontWeight: '600',
                        marginLeft: '0.5rem',
                        fontSize: '14px',
                    }}
                    onClick={handleClickConfiguracion}
                >
                    Configuración
                </p>

                <Dropdown
                    submenus={submenuConfiguracion}
                    dropdown={dropdown2}
                    depthLevel={depthLevel}
                    setDropdown0={setDropdown2}
                />
            </LinkWrapper>
        </Links>
    );
}

export default NavLinks;

// <Link href="/configuracion">
// <LinkWrapper>
//     <IoSettingsSharp size={32} color="white"></IoSettingsSharp>
//     <p
//         style={{
//             color: 'white',
//             fontWeight: '600',
//             marginLeft: '0.5rem',
//             fontSize: '14px',
//         }}
//     >
//         Configuración
//     </p>
// </LinkWrapper>
// </Link>
