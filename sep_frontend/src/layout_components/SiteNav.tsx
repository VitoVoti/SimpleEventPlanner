/*
Most of this code was taken from the examples in the MUI documentation.
https://mui.com/material-ui/react-app-bar/
*/
'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { AccountCircle, CalendarMonth, Logout } from '@mui/icons-material';
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation';
import Link from './Link';
import MainLogo from './sitenav_components/MainLogo';

// For now we only have 2 pages
const pages = [
    {
        name: 'My Planner',
        href: '/planner',
    },
    {
        name: 'About',
        href: '/about',
    },
];

function SiteNav() {

    // States
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const {data: session, status} = useSession();

    // Router
    const router = useRouter();
    const goToUrl = (url: string) => {
        router.push(url);
    }

    // Handlers for menus and stuff
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };



    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    
                    <Link href="/" sx={{ 
                        color: 'white', 
                        textDecoration: 'none', 
                        display: { 
                            xs: 'none', md: 'flex' 
                        },
                        flexGrow: 1,
                    }}>
                        <MainLogo />
                    </Link>
                    

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem 
                                    key={page.name}
                                    onClick={() => goToUrl(page.href)}
                                >
                                    <Typography textAlign="center">{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    
                    <Link href="/" sx={{ 
                        color: 'white', 
                        textDecoration: 'none', 
                        display: { 
                            xs: 'flex', md: 'none' 
                        },
                        flexGrow: 1,
                    }}>
                        <MainLogo />
                        
                    </Link>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={() => goToUrl(page.href)}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <AccountCircle sx={{color: "white"}} fontSize='large' />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            { /* For now, it's just Log Out */ }
                            {
                                session?.user ?
                                <MenuItem onClick={() => signOut({
                                    callbackUrl: "/"
                                })}>
                                    <Typography textAlign="center">Sign Out</Typography>
                                </MenuItem>
                                :
                                <MenuItem onClick={() => goToUrl("/")}>
                                    <Typography textAlign="center">Sign In</Typography>
                                </MenuItem>
                            }
                            
                            
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default SiteNav;