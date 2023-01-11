import styled from 'styled-components';

export const HeaderContainer = styled.header`
    padding: 1.5rem 0 0;
    position: relative;

    @media ${({ theme }) => theme.breakpoints.md} {
        // padding: 2.625rem 0 5.375rem;
    }

    ::before {
        content: '';
        position: absolute;
        top: 0;
        background: url(/assets/bg-pattern-header-mobile.svg) no-repeat center
            center;
        background-size: cover;
        width: 100%;
        height: 100px;
        @media ${({ theme }) => theme.breakpoints.md} {
            background: url(/assets/bg-pattern-header-tablet.svg) no-repeat
                center center;
            background-size: cover;
        }

        @media ${({ theme }) => theme.breakpoints.xxl} {
            background: url(/assets/bg-pattern-header-desktop.svg) no-repeat
                center center;
            background-size: cover;
        }
    }
`;

export const Logo = styled.img`
    position: relative;
    top: -2px;
    width: ${({ sorteo }) => (sorteo ? '35px' : '64px')};
    height: ${({ sorteo }) => (sorteo ? '32px' : '50px')};
`;

export const MenuReporteWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 130%;
`;

export const SubLinkWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 130%;
`;

export const MenuItem = styled.div`
    position: relative;
    width: 110%;
`;

export const MenuReporte = styled.div`
    position: absolute;
    left: ${({ dropdownSubmenu }) => (dropdownSubmenu ? '102%' : '30px')};
    top: ${({ dropdownSubmenu }) => (dropdownSubmenu ? '-3px' : '123%')};
    // top: 55px;
    // left: 15px;
    display: ${({ dropdown }) => (dropdown ? 'block' : 'none')};
    flex-direction: column;
    background-color: ${({ theme }) => theme.onSurface1};
    box-shadow: 5px 5px 5px 0px rgb(66, 66, 66, 1);
    border-radius: 5px;
    // padding: 1rem 1rem 0.5rem 1.5rem;
    min-width: 10rem;
    // width: 130px;
    z-index: 1;

    // position: absolute;
    // left: 30px;
    // top: 123%;
    // box-shadow: 0 10px 15px -3px rgba(46, 41, 51, 0.08),
    //     0 4px 6px -2px rgba(71, 63, 79, 0.16);
    // font-size: 0.875rem;
    // z-index: 9999;
    // min-width: 10rem;
    // padding: 0.5rem 0;
    // list-style: none;
    // background-color: #fff;
    // border-radius: 0.5rem;
    // display: none;

    &:before {
        position: absolute;
        top: ${({ dropdownSubmenu }) => (dropdownSubmenu ? '10px' : '-5px')};
        left: ${({ dropdownSubmenu }) => (dropdownSubmenu ? '-5px' : '10px')};
        content: '';
        display: block;
        height: 10px;
        width: 10px;
        background-color: ${({ theme }) => theme.onSurface1};
        transform: rotate(45deg);
    }
`;

// pointer-events: ${({ pointer }) => (pointer ? 'initial' : '')};

export const NavLink = styled.a`
    display: 'inline-block';
    font-size: ${({ theme }) => theme.fsText_md}rem;
    font-weight: ${({ theme }) => theme.fwMedium};
    line-height: 1.5;
    color: ${({ theme }) => theme.surface};
    cursor: pointer;
    // margin-bottom: 0.5rem;
    &:hover {
        color: ${({ theme }) => theme.secondary};
    }
`;

export const Links = styled.nav`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
`;

export const DesktopMenu = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1;
`;

export const DarkLightTheme = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 7rem;
    height: 1.25rem;
`;
export const Sun = styled.img`
    width: 1.25rem;
`;
export const ThemeToggle = styled.div`
    display: flex;
    align-items: center;
    width: 3rem;
    height: 1.5rem;
    background-color: ${({ theme }) => theme.btnClr};
    border-radius: 0.75rem;
    position: relative;
    cursor: pointer;
`;
export const SwitchTheme = styled.button`
    position: absolute;
    left: ${({ darkMode }) => (darkMode ? '' : '5px')};
    right: ${({ darkMode }) => (darkMode ? '5px' : '')};
    width: 0.875rem;
    height: 0.875rem;
    background-color: ${({ theme }) => theme.btnBg};
    border: none;
    border-radius: 50%;
    cursor: pointer;
    :hover {
        background-color: ${({ theme }) => theme.btnHoverBg};
    }
`;
export const Moon = styled.img`
    width: 0.75rem;
`;

export const WrapperMenuItems = styled.ul`
    width: 120%;
    padding: 0.75rem 2rem 0.75rem;
    // color: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.background};
    margin-bottom: 0;

    &:first-child {
        padding-top: 1.5rem;
    }

    &:last-child {
        padding-bottom: 1.5rem;
    }

    // &:before {
    //     content: '';
    //     width: 10px;
    //     height: 10px;
    //     background-color: #fff;
    //     position: absolute;
    //     top: 10px;
    //     left: -5px;
    //     transform: rotate(45deg);
    // }
`;

export const MenuItemSub = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 87.5%;
    &:hover {
        color: ${({ theme }) => theme.secondary};
    }
`;

export const LinkWrapper = styled.div`
    // width: 145px;
    position relative;
    border: 1px solid
        ${({ theme, noHeader }) =>
            noHeader ? theme.onBackground : theme.onPrimary};
    display: flex;
    // flex-direction: column;
    // justify-content: center;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 30px;
    cursor: pointer;
    margin-left: ${({ left, right }) => (left ? '' : right ? '5rem' : '.5rem')};
    &:focus {
        background-color: red;
    }
`;

export const SubLink = styled.div`
    font-size: ${({ theme }) => theme.fsText_md}rem;
    font-weight: ${({ theme }) => theme.fwMedium};
    line-height: 1.5;
    color: ${({ theme }) => theme.surface};
    cursor: pointer;
    // margin-bottom: 0.5rem;
    padding: 1rem 0rem 0rem 1rem;
    &:hover {
        color: ${({ theme }) => theme.secondary};
    }
`;

export const SubMenuReport1 = styled.div`
    position: absolute;
    top: 10px;
    left: 144px;
    display: ${({ subReport1 }) => (subReport1 ? 'flex' : 'none')};
    flex-direction: column;
    background-color: ${({ theme }) => theme.onSurface1};
    box-shadow: 5px 5px 5px 0px rgb(66, 66, 66, 1);
    border-radius: 5px;
    padding: 1rem 1rem 0.5rem 1.5rem;
    width: 130px;
    z-index: 1;
    &:before {
        position: absolute;
        top: 10px;
        left: -5px;
        content: '';
        display: block;
        height: 10px;
        width: 10px;
        background-color: ${({ theme }) => theme.onSurface1};
        transform: rotate(45deg);
    }
`;

export const SubMenuReport2 = styled.div`
    position: absolute;
    top: -4px;
    left: 117px;
    display: ${({ subReport2 }) => (subReport2 ? 'flex' : 'none')};
    flex-direction: column;
    background-color: ${({ theme }) => theme.onSurface1};
    box-shadow: 5px 5px 5px 0px rgb(66, 66, 66, 1);
    border-radius: 5px;
    padding: 1rem 1rem 0.5rem 1.5rem;
    width: 130px;
    z-index: 1;
    &:before {
        position: absolute;
        top: 10px;
        left: -5px;
        content: '';
        display: block;
        height: 10px;
        width: 10px;
        background-color: ${({ theme }) => theme.onSurface1};
        transform: rotate(45deg);
    }
`;
