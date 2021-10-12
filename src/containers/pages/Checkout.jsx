/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'

import { Link as RouterLink } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { AddressContext } from '../../contexts/AdressContext'
import { CartContext } from '../../contexts/CartContext'
import { AuthContext } from '../../contexts/AuthContext'

import Logo from '../../assets/img/white-logo.png'

import SelectAddress from '../../components/checkout/SelectAddress'

const Checkout = () => {
    const { addressData, setAddressData } = useContext(AddressContext)
    const { cartData, setCartData } = useContext(CartContext)
    const { authData } = useContext(AuthContext)

    const [billAddress, setBillAddress] = useState(-1)
    const [shipAddress, setShipAddress] = useState(-1)
    const [notes, setNotes] = useState('')
    const [error, setError] = useState([])
    const [checkOut, setCheckOut] = useState(false)

    const itemTotal = cartData.cartItems.reduce((total, item) => (item.qty * item.maximum_retail_price) + total, 0)
    const subTotal = cartData.cartItems.reduce((total, item) => (item.qty * item.unit_price) + total, 0)
    const discountTotal = itemTotal - subTotal
    const taxTotal = cartData.cartItems.reduce((total, item) => (item.qty * item.unit_tax) + total, 0)
    const total = subTotal + taxTotal

    const getAddress = async () => {
        if (!authData.isLoggedIn) return
        if (addressData.addresses.length > 0) return
        setAddressData({
            ...addressData,
            fetching: true
        })
        const result = await addressData.fetchAddresses()
        setAddressData({
            ...addressData,
            fetching: false,
            addresses: result !== null ? [...result] : []
        })
    }

    const validateCart = async () => {
        if (!authData.isLoggedIn) return
        const result = await cartData.validateCart()
        if (result === null)
            return
        if (result.valid) {
            setError([])
            return true
        }
        setError([...result.items])
        return false
    }

    const capturePayment = async postData => {
        const captureUrl = 'http://127.0.0.1:8000/api/order/payment/capture/'
        const options = {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        }
        const captureResponse = await axios.post(captureUrl, postData, options)
        if (captureResponse.status === 200) return true
        else return false
    }

    const placeOrder = async (e) => {
        if (!validateCart()) return
        setCheckOut(true)
        const checkoutURL = 'http://127.0.0.1:8000/api/order/create/'
        const postData = {
            ship_addr_id: shipAddress,
            bill_addr_id: billAddress,
            notes
        }
        const options = {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        }
        const createResponse = await axios.post(checkoutURL, postData, options)
        if (createResponse.status !== 201) {
            setCheckOut(false)
            return
        }

        const script_loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
        if (!script_loaded) {
            alert('Could not connect to Razorpay, make sure you are online.')
            return
        }
        const rpOptions = {
            ...createResponse.data,
            key: "rzp_test_SrbG27vnZni92A",
            image: Logo,
            handler: async (response) => {
                const postData = {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    order_id: createResponse.data.notes.id,
                    status: true,
                    status_reason: "Payment succesful"
                }
                const capture = await capturePayment(postData)
                setCheckOut(false)
                if (capture) {
                    console.log('payment complete')
                }
            },
        }

        const paymentObject = new window.Razorpay(rpOptions)
        paymentObject.on('payment.failed', async (response) => {
            const postData = {
                razorpay_payment_id: response.error.metadata.payment_id,
                razorpay_order_id: response.error.metadata.order_id,
                razorpay_signature: '',
                order_id: createResponse.data.notes.id,
                status: false,
                status_reason: `${response.error.description} - ${response.error.reason}`
            }
            const capture = await capturePayment(postData)
            setCheckOut(false)
            if (capture) {
                console.log('payment failed')
            }
        })
        paymentObject.open()
    }

    const changeQuantity = async (item_id, qty) => {
        const modifiedCartItem = await cartData.modifyUserCart(item_id, qty)
        validateCart()
        setCartData({
            ...cartData,
            cartItems: [
                ...cartData.cartItems.map(ci =>
                    (ci.item_id === item_id) && (modifiedCartItem !== null) ?
                        { ...modifiedCartItem } :
                        { ...ci }
                )
            ]
        })

    }

    const removeCartItem = async (item_id) => {
        const details = await cartData.deleteUserCart(item_id)
        validateCart()
        setCartData({
            ...cartData,
            totalItems: details !== null ? details.total_items : cartData.totalItems,
            cartItems: details !== null ? [...details.cart_items] : [cartData.cartItems]
        })
    }

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            }
            script.onerror = () => {
                resolve(false);
            }
            document.body.appendChild(script);
        })
    }

    useEffect(() => {
        getAddress()
        validateCart()

        return () => { }
    }, [])


    const products = <Grid container direction="column">
        <Grid item>
            <Typography variant="h5" gutterBottom>
                Order Items ({cartData.totalItems})
            </Typography>
            <Divider />
        </Grid>
        {[
            ...cartData.cartItems.map((ci, index) => {
                const invalidItem = error.length > 0 ?
                    error.filter(err => err.id === ci.item_id).length > 0 ?
                        error.filter(err => err.id === ci.item_id)[0] :
                        null :
                    null
                return <Grid item key={ci.sku}>
                    <Paper style={{ padding: 10, marginTop: 10 }}>
                        <Grid container direction="row" spacing={2}>
                            <Grid item>
                                <RouterLink
                                    to={`/shop/product/${ci.p_sku}`}
                                >
                                    <img
                                        style={{ width: 80 }}
                                        src={ci.image_url}
                                        alt={`${ci.sku}`} />
                                </RouterLink>
                            </Grid>
                            <Grid item>
                                <Grid container direction="column">
                                    <Grid item>
                                        <Typography variant="body2" align="justify" gutterBottom>
                                            {ci.title}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant="subtitle1"
                                            color="textSecondary"
                                            gutterBottom
                                        >
                                            ₹ {(ci.qty * ci.unit_price).toFixed(2)}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant="caption"
                                            gutterBottom
                                        >
                                            QTY: {ci.qty}
                                        </Typography>
                                    </Grid>
                                    {[
                                        ...ci.attribute.map((attr, index) => <Grid item key={`${ci.sku}-${index}`}>
                                            <Typography variant="body2">
                                                {attr.name}: {attr.value}
                                            </Typography>
                                        </Grid>
                                        )
                                    ]}
                                </Grid>
                            </Grid>
                        </Grid>
                        {
                            invalidItem !== null &&
                            (
                                <Grid
                                    container
                                    direction="column"
                                    spacing={1}
                                >
                                    <Grid item>
                                        <Typography variant="body2" color="error">
                                            {
                                                invalidItem.recomeded === 0 ?
                                                    `The Product is unavlailable` :
                                                    `Only ${invalidItem.recomeded} unit(s) are available.`
                                            }
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Grid
                                            container
                                            direction="row"
                                            spacing={2}
                                        >
                                            <Grid item>
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    variant="contained"
                                                    disabled={invalidItem.recomeded === 0}
                                                    onClick={(e) => changeQuantity(invalidItem.id, invalidItem.recomeded)}
                                                >
                                                    Accept
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                    onClick={(e) => removeCartItem(invalidItem.id)}
                                                >
                                                    Remove
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )
                        }
                    </Paper>
                </Grid>
            }
            )
        ]}
    </Grid>

    const totals = <Paper>
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
    </Paper>

    const orderNotes =
        <>
            <Divider style={{ marginBottom: 10 }} />
            <TextareaAutosize
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                minRows={3}
                placeholder="Order Notes"
                style={{ width: '100%' }}
            />
        </>

    const disclaimer =
        <Typography variant="caption" align="justify" gutterBottom>
            Your personal data will be used to process your order,
            support your experience throughout this website, and
            for other purposes described in our privacy policy.
        </Typography>

    return (
        <div>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" component={RouterLink} to="/">
                    Home
                </Link>
                <Typography color="textPrimary">Checkout</Typography>
            </Breadcrumbs>
            <Divider
                style={{ marginTop: 5, marginBottom: 10 }} />
            <Typography variant="h4" align="center">
                Checkout
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8} md={8} lg={8}>
                    <Grid container direction="column">
                        <Grid item>
                            <SelectAddress
                                name="Billing"
                                value={billAddress}
                                setValue={setBillAddress}
                            />
                        </Grid>
                        <Grid item>
                            <Divider />
                        </Grid>
                        <Grid item>
                            <SelectAddress
                                name="Shipping"
                                value={shipAddress}
                                setValue={setShipAddress}
                            />
                        </Grid>
                        <Grid item>
                            <Divider />
                        </Grid>
                        <Grid item>
                            {orderNotes}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            {products}
                        </Grid>
                        <Grid item>
                            {totals}
                        </Grid>
                        <Grid item>
                            {disclaimer}
                            {
                                error.length > 0 &&
                                <Typography variant="body2" color="error" gutterBottom>
                                    Cart contains error, please verify and proceed.
                                </Typography>
                            }
                        </Grid>
                        <Grid item>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={placeOrder}
                                disabled={billAddress === -1 || shipAddress === -1 || error.length > 0 || checkOut}
                            >
                                Place Order
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default Checkout
