import React from 'react';
import Link from 'next/link';
import { useStateContext } from '../../../context/StateContext';
import { Container } from '../../../styles/globals';
import {
    DarkLightTheme,
    DesktopMenu,
    HeaderContainer,
    Logo,
    Moon,
    Sun,
    SwitchTheme,
    ThemeToggle,
} from './headerStyles';
import NavLinks from './navlinks';

function Header() {
    const { darkMode, setDarkmode, setThemeLocalStorage } = useStateContext();

    const handleThemeToggle = () => {
        setDarkmode(!darkMode);
        setThemeLocalStorage();
    };

    return (
        <HeaderContainer>
            <Container flxdirection={'row'} align={'center'} navContainer>
                <Link href={'/'} passHref prefetch={false}>
                    <a>
                        <Logo
                            src={`/assets/logos/logo112.png`}
                            alt={'logo agencia'}
                        />
                    </a>
                </Link>
                <DesktopMenu>
                    <NavLinks />
                </DesktopMenu>
                <DarkLightTheme>
                    <Sun
                        src={`/assets/icon-sun.svg`}
                        alt={'Light Theme Icon'}
                    />
                    <ThemeToggle onClick={handleThemeToggle}>
                        <SwitchTheme
                            darkMode={darkMode}
                            aria-label="switch theme"
                        ></SwitchTheme>
                    </ThemeToggle>
                    <Moon
                        src={`/assets/icon-moon.svg`}
                        alt={'Dark Theme Icon'}
                    />
                </DarkLightTheme>
            </Container>
        </HeaderContainer>
    );
}

export default Header;
