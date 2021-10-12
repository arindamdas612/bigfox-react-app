import React, { useContext } from 'react'

import { Link as RouterLink } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

import { CartContext } from '../../contexts/CartContext'
import { AuthContext } from '../../contexts/AuthContext'
import CartItem from '../../components/cart/CartItem'

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
    },
}))


const Cart = () => {
    const classes = useStyles()

    const { cartData } = useContext(CartContext)
    const { authData } = useContext(AuthContext)

    const itemTotal = cartData.cartItems.reduce((total, item) => (item.qty * item.maximum_retail_price) + total, 0)
    const subTotal = cartData.cartItems.reduce((total, item) => (item.qty * item.unit_price) + total, 0)
    const discountTotal = itemTotal - subTotal
    const taxTotal = 0
    const total = subTotal + taxTotal

    const cartProducts = [
        ...cartData.cartItems.map((ci, index) =>
            <div
                className={classes.root}
                key={`cart-page-${ci.sku}`}
            >
                <CartItem
                    item={ci}
                    isDrawer={false}
                />
            </div>
        )
    ]

    const totals = <div className={classes.root}>
        <List aria-label="main mailbox folders">
            <ListItem>
                <ListItemText primary="Item Total" />
                <Typography>
                    ₹ {itemTotal.toFixed(2)}
                </Typography>
            </ListItem>
            <Divider variant="inset" />
            <ListItem>
                <ListItemText primary="Discount" />
                <Typography color="error">
                    - ₹ {discountTotal.toFixed(2)}
                </Typography>
            </ListItem>
            <Divider variant="inset" />
            <ListItem>
                <ListItemText primary="SubTotal" />
                <Typography>
                    ₹ {subTotal.toFixed(2)}
                </Typography>
            </ListItem>
            <Divider variant="inset" />
            <ListItem>
                <ListItemText primary="Tax" />
                <Typography>
                    ₹ {taxTotal.toFixed(2)}
                </Typography>
            </ListItem>
            <Divider variant="inset" />
            <ListItem>
                <ListItemText primary="Total" />
                <Typography variant="h6">
                    ₹ {total.toFixed(2)}
                </Typography>
            </ListItem>
        </List>
    </div>

    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" component={RouterLink} to="/">
                    Home
                </Link>
                <Typography color="textPrimary">Cart</Typography>
            </Breadcrumbs>
            <Divider
                style={{ marginTop: 5, marginBottom: 10 }} />
            <Typography variant="h4" align="center">
                Shopping Cart
            </Typography>
            {
                cartData.cartItems.length === 0 ?
                    <Typography variant="h6" color="error" align="center">
                        No items int the Cart
                    </Typography> :
                    <Grid
                        container
                        spacing={2}
                    >
                        <Grid item xs={12} md={7} lg={8}>
                            {cartProducts}
                        </Grid>
                        <Grid item xs={12} md={5} lg={4}>
                            <Grid
                                container
                                direction="column"
                                spacing={2}
                            >
                                <Grid item>
                                    {totals}
                                </Grid>
                                <Grid item>
                                    {
                                        authData.isLoggedIn ?
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                component={RouterLink}
                                                to='/checkout'
                                            >
                                                Proceed to Checkout
                                            </Button> :
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                component={RouterLink}
                                                to={{
                                                    pathname: '/auth',
                                                    state: { from: '/checkout' }
                                                }}
                                            >
                                                Login/Register to Checkout
                                            </Button>
                                    }
                                </Grid>
                                <Grid item>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<KeyboardBackspaceIcon />}
                                        component={RouterLink}
                                        to='/'
                                    >
                                        Continue Shoping
                                    </Button>
                                </Grid>
                            </Grid>


                        </Grid>
                    </Grid>
            }

        </>
    )
}

export default Cart
