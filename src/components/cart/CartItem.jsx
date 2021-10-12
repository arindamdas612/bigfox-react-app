import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'

import CloseIcon from '@material-ui/icons/Close'

import { AuthContext } from '../../contexts/AuthContext'
import { CartContext } from '../../contexts/CartContext'

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(2),
        width: '100%'
    },
    discountedItem: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },
    productImage: {
        width: 70
    },
    productImageLarge: {
        width: 150
    }
}))

const CartItem = ({ item, isDrawer }) => {
    const classes = useStyles()

    const { authData } = useContext(AuthContext)
    const { cartData, setCartData } = useContext(CartContext)

    const total_price = item.qty * item.maximum_retail_price
    const discounted_price = item.qty * item.unit_price

    const isInSale = total_price !== discounted_price

    const changeQuantity = async (e) => {
        const newQuantity = e.target.value
        const modifyFunc = authData.isLoggedIn ? cartData.modifyUserCart : cartData.modifyGuestCart
        if (modifyFunc !== null) {
            const modifiedCartItem = await modifyFunc(item.item_id, newQuantity)
            setCartData({
                ...cartData,
                cartItems: [
                    ...cartData.cartItems.map(ci =>
                        (ci.item_id === item.item_id) && (modifiedCartItem !== null) ?
                            { ...modifiedCartItem } :
                            { ...ci }
                    )
                ]
            })
        }

    }

    const removeCartItem = async (e) => {
        const deleteFunc = authData.isLoggedIn ? cartData.deleteUserCart : cartData.deleteGuestCart
        if (deleteFunc !== null) {
            const details = await deleteFunc(item.item_id)
            setCartData({
                ...cartData,
                totalItems: details !== null ? details.total_items : cartData.totalItems,
                cartItems: details !== null ? [...details.cart_items] : [cartData.cartItems]
            })
        }
    }

    return (
        <Grid
            className={classes.root}
            container
            direction="row"
            alignItems='center'
            spacing={2}>
            <Grid item>
                <Link
                    to={`/shop/product/${item.p_sku}`}
                >
                    <img
                        className={isDrawer ? classes.productImage : classes.productImageLarge}
                        src={item.image_url}
                        alt={`${item.sku}`}
                    />
                </Link>
            </Grid>
            <Grid item>
                <Grid container direction="column">
                    <Grid item>
                        <Typography variant="body2">
                            {item.brand_name}'s
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">
                            {item.title}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Grid container direction="row" spacing={1}>
                            {
                                !isInSale ?
                                    <Grid item>
                                        <Typography variant="body2">
                                            ₹ {total_price}
                                        </Typography>
                                    </Grid> :
                                    <>
                                        <Grid item>
                                            <Typography
                                                variant="body2"
                                                color="error"
                                                className={classes.discountedItem}
                                            >
                                                ₹ {total_price}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body2">
                                                ₹ {discounted_price}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body2">
                                                ({item.discount_percent}% Off)
                                            </Typography>
                                        </Grid>
                                    </>
                            }
                        </Grid>
                    </Grid>
                    {!isDrawer && ([
                        ...item.attribute.map((at, idx) =>
                            <Grid key={`${item.sku}-attr-${idx}`} item>
                                <Typography variant="body2">
                                    {`${at.name}`} &#8594;  {`${at.value}`}
                                </Typography>
                            </Grid>
                        )
                    ])}

                    <Grid item>
                        <Grid
                            container
                            direction="row"
                            alignItems="flex-end"
                        >
                            <Grid item>
                                <Select
                                    size="small"
                                    value={item.qty}
                                    onChange={changeQuantity}
                                >
                                    <MenuItem value={1}>
                                        <Typography variant="body2">
                                            1
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={2}>
                                        <Typography variant="body2">
                                            2
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={3}>
                                        <Typography variant="body2">
                                            3
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={4}>
                                        <Typography variant="body2">
                                            4
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={5}>
                                        <Typography variant="body2">
                                            5
                                        </Typography>
                                    </MenuItem>
                                </Select>
                            </Grid>
                            <Grid item style={{ marginLeft: 10 }}>
                                <IconButton
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={removeCartItem}
                                >
                                    <CloseIcon style={{ fontSize: 15 }} />
                                    <Typography variant="caption">
                                        Remove
                                    </Typography>
                                </IconButton>

                            </Grid>

                        </Grid>

                    </Grid>

                </Grid>
            </Grid>
        </Grid>
    )
}

export default CartItem
