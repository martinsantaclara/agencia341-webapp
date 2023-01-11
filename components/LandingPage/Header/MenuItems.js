import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Dropdown from './Dropdown';
import { IoIosArrowForward } from 'react-icons/io';
import { MdPlayArrow } from 'react-icons/md';
import { MenuItemSub, NavLink, WrapperMenuItems } from './headerStyles';

const MenuItems = ({ items, depthLevel, setDropdown0 }) => {
    const [dropdown, setDropdown] = useState(false);
    let ref = useRef();
    // useEffect(() => {
    //     const handler = (event) => {
    //         if (
    //             dropdown &&
    //             ref.current &&
    //             !ref.current.contains(event.target)
    //         ) {
    //             setDropdown(false);
    //         }
    //     };
    //     document.addEventListener('mousedown', handler);
    //     document.addEventListener('touchstart', handler);
    //     return () => {
    //         // Cleanup the event listener
    //         document.removeEventListener('mousedown', handler);
    //         document.removeEventListener('touchstart', handler);
    //     };
    // }, [dropdown]);

    const onMouseEnter = () => {
        window.innerWidth > 960 && setDropdown(true);
    };

    const onMouseLeave = () => {
        window.innerWidth > 960 && setDropdown(false);
    };

    return (
        <WrapperMenuItems ref={ref}>
            <li
                className="menu-items"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {items.submenu ? (
                    <>
                        <button
                            type="button"
                            aria-haspopup="menu"
                            aria-expanded={dropdown ? 'true' : 'false'}
                            onClick={() => setDropdown((prev) => !prev)}
                        >
                            <MenuItemSub>
                                {items.title} <MdPlayArrow />
                            </MenuItemSub>
                            {/* {items.title} <IoIosArrowForward /> */}
                        </button>
                        <Dropdown
                            submenus={items.submenu}
                            dropdown={dropdown}
                            depthLevel={depthLevel}
                            setDropdown0={setDropdown0}
                        />
                    </>
                ) : (
                    <Link href={items.url} passHref prefetch={false}>
                        <NavLink onClick={() => setDropdown0(false)}>
                            {items.title}
                        </NavLink>
                        {/* <a>{items.title}</a> */}
                    </Link>
                )}
            </li>
        </WrapperMenuItems>
    );
};

export default MenuItems;
