/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react'

import { Link } from 'react-router-dom'

import Cover from '../../assets/img/cover.png'

import { makeStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import Drawer from '@material-ui/core/Drawer'
import Grid from '@material-ui/core/Grid'

import SearchIcon from '@material-ui/icons/Search'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MoreIcon from '@material-ui/icons/MoreVert'
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'

import { AuthContext } from '../../contexts/AuthContext'
import { CartContext } from '../../contexts/CartContext'
import { MenuCategoryContextProvider } from '../../contexts/MenuCategoryContext'

import AppDrawer from './AppDrawer'
import { Button, Divider, Typography } from '@material-ui/core'
import CartItem from '../cart/CartItem'

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    logo: {
        marginRight: theme.spacing(2),
        maxWidth: '150px'
    },
    drawerPaper: {
        width: 300
    },
    cartDrawerPaper: {
        width: 330
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}))

const BxAppBar = () => {
    const classes = useStyles()

    const { authData, setAuthData } = useContext(AuthContext)
    const { cartData, setCartData } = useContext(CartContext)

    const [anchorEl, setAnchorEl] = useState(null)
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null)
    const [open, setOpen] = useState(false)
    const [cartOpen, setCartOpen] = useState(false)

    const isMenuOpen = Boolean(anchorEl)
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

    const cartCount = cartData.totalItems

    const fetchCartData = async () => {
        const fetchFunction = authData.isLoggedIn ? cartData.fetchUserCart : cartData.fetchGuestCart
        const details = await fetchFunction()
        if (details) {
            setCartData({
                ...cartData,
                totalItems: details !== null ? details.total_items : cartData.totalItems,
                cartItems: details !== null ? [...details.cart_items] : [...cartData.cartItems],
            })
        }
    }

    useEffect(() => {
        fetchCartData()
        return () => { }
    }, [authData.isLoggedIn])

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null)
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose()
    }

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    }

    const logout = async () => {
        const logoutResponse = await authData.logout()
        setAuthData({
            ...authData,
            userData: logoutResponse ? null : { ...authData.userData },
            isLoggedIn: logoutResponse ? false : authData.isLoggedIn
        })
        handleMenuClose()
    }

    const toggleDrawer = () => setOpen(!open)
    const toggleCartDrawer = () => setCartOpen(!cartOpen)

    const menuId = 'primary-search-account-menu'
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >

            {
                authData.isLoggedIn ?
                    (
                        [
                            <MenuItem key="profile" onClick={handleMenuClose}>
                                <Link
                                    to="/profile"
                                    style={{ textDecoration: 'none', color: 'black' }}
                                >
                                    Profile
                                </Link>
                            </MenuItem>,
                            <MenuItem key="logout" onClick={logout}>Logout</MenuItem>
                        ]
                    ) :
                    (
                        <MenuItem onClick={handleMenuClose}>
                            <Link
                                to="/auth"
                                style={{ textDecoration: 'none', color: 'black' }}
                            >
                                SignIn/SignUp
                            </Link>
                        </MenuItem>
                    )
            }

        </Menu>
    )

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton color="inherit">
                    <SearchIcon />
                </IconButton>
                <p>Search</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
            <MenuItem onClick={toggleCartDrawer}>
                <IconButton
                    aria-label="show 4 new mails"
                    color="inherit"
                    onClick={toggleCartDrawer}
                >
                    {
                        cartCount > 0 ?
                            <Badge badgeContent={cartCount} color="secondary">
                                <ShoppingCartOutlinedIcon />
                            </Badge> :
                            <ShoppingCartOutlinedIcon />
                    }
                </IconButton>
                <p>Cart</p>
            </MenuItem>
        </Menu>
    )

    const cartDrawer = (
        <Grid
            // style={{ minHeight: '100vh' }}
            container
            direction="column"
            justifyContent="space-between"
            alignItems="center"
        >
            <Grid item>
                <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    spacing={6}>
                    <Grid item>
                        <Typography variant="h6">
                            Your Cart ({cartCount})
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={toggleCartDrawer}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>

                </Grid>
                <Divider style={{ marginTop: 10, border: '1px solid' }} />
                <Grid
                    container
                    direction="column"
                    justifyContent="space-between"
                    alignItems="stretch"
                >

                    {
                        [
                            ...cartData.cartItems.map(ci =>
                                <Grid item key={ci.sku} >
                                    <CartItem item={ci} isDrawer={true} />
                                </Grid>
                            )
                        ]
                    }

                </Grid>
            </Grid>
            <Grid item style={{ width: '100%', paddingLeft: 10, paddingRight: 10 }}>
                <Grid
                    container
                    direction="column"
                    // justifyContent="flex-start"
                    // alignItems="stretch"
                    spacing={2}>
                    <Grid item>
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-start"
                            spacing={4}

                        >
                            <Grid item>
                                <Typography variant="h6">
                                    Subtotal
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6">
                                    ₹ {cartData.cartItems.reduce((sum, ci) => sum + (ci.qty * ci.unit_price), 0)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        {
                            authData.isLoggedIn ?
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    component={Link}
                                    to='/checkout'
                                    onClick={toggleCartDrawer}
                                >
                                    Proceed to Checkout
                                </Button> :
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    component={Link}
                                    to={{
                                        pathname: '/auth',
                                        state: { from: '/checkout' }
                                    }}
                                    onClick={toggleCartDrawer}
                                >
                                    Login/Register to Checkout
                                </Button>
                        }
                    </Grid>
                    <Grid item>
                        <Button
                            fullWidth
                            color="secondary"
                            variant="contained"
                            component={Link}
                            to="/cart"
                            onClick={(e) => setCartOpen(false)}
                            disabled={cartData.cartItems.length === 0}
                        >
                            view Cart
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )

    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        onClick={toggleDrawer}
                        color="inherit"
                        aria-label="open drawer"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Link to="/">
                        <img src={Cover} alt="Big Fox Logo" className={classes.logo} />
                    </Link>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <IconButton color="inherit">
                            <SearchIcon />
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <IconButton
                            aria-label="show 4 new mails"
                            color="inherit"
                            onClick={toggleCartDrawer}
                        >
                            {
                                cartCount > 0 ?
                                    <Badge badgeContent={cartCount} color="secondary">
                                        <ShoppingCartOutlinedIcon />
                                    </Badge> :
                                    <ShoppingCartOutlinedIcon />
                            }
                        </IconButton>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer}
                classes={{
                    paper: classes.drawerPaper
                }}
            >
                <MenuCategoryContextProvider>
                    <AppDrawer setOpen={setOpen} />
                </MenuCategoryContextProvider>
            </Drawer>
            <Drawer
                anchor="right"
                open={cartOpen}
                onClose={toggleCartDrawer}
                classes={{
                    paper: classes.cartDrawerPaper
                }}
            >
                {cartDrawer}
            </Drawer>
            {renderMobileMenu}
            {renderMenu}
        </div>
    )
}

export default BxAppBar
