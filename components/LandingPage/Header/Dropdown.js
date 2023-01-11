import { MenuReporte } from './headerStyles';
import MenuItems from './MenuItems';
const Dropdown = ({ submenus, dropdown, depthLevel, setDropdown0 }) => {
    depthLevel += 1;
    // const dropdownClass = depthLevel > 1 ? 'dropdownLocal-submenu' : '';
    return (
        // <ul
        //     className={`dropdownLocal ${
        //         depthLevel === 1 ? 'dropdown0' : 'dropdown1'
        //     } ${dropdownClass} ${dropdown ? 'show' : ''}`}
        // >
        //     {submenus.map((submenu, index) => (
        //         <MenuItems
        //             items={submenu}
        //             key={index}
        //             depthLevel={depthLevel}
        //         />
        //     ))}
        // </ul>

        <MenuReporte dropdownSubmenu={depthLevel > 1} dropdown={dropdown}>
            {submenus.map((submenu, index) => (
                <MenuItems
                    items={submenu}
                    key={index}
                    depthLevel={depthLevel}
                    setDropdown0={setDropdown0}
                />
            ))}
        </MenuReporte>
    );
};

export default Dropdown;
