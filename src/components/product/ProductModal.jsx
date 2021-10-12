import React, { useState, useContext } from 'react'

import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
// import FavoriteSharpIcon from '@material-ui/icons/FavoriteSharp'
import FavoriteBorderSharpIcon from '@material-ui/icons/FavoriteBorderSharp'
import AddShoppingCartOutlinedIcon from '@material-ui/icons/AddShoppingCartOutlined'

import { CartContext } from '../../contexts/CartContext'
import { AuthContext } from '../../contexts/AuthContext'

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'scroll',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(1, 1, 1, 1),
        minWidth: 700,
        ['@media (max-width:650px)']: { // eslint-disable-line no-useless-computed-key
            minWidth: 80
        },
    },
    discountedItem: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },
    productInfo: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    sizeButton: {
        // margin: theme.spacing(0),
        // padding: theme.spacing(0),
        minHeight: 0,
        minWidth: theme.spacing(5.3),
        borderRadius: "0px",
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(1)
    }
}))

const ProductModal = ({
    open,
    handleClose,
    product
}) => {
    const classes = useStyles()

    const { authData } = useContext(AuthContext)
    const { cartData, setCartData } = useContext(CartContext)

    const [qty, setqty] = useState(1)

    const [colorDetails, setColorDetails] = useState(
        product.variations.map((vr, index) => {
            var colorImage;
            var sku;

            product.details.forEach(prd => {
                const thisColor = prd.attribute.filter(attr => attr.name === 'Color' && attr.value === vr.color).length > 0
                if (thisColor) {
                    colorImage = prd.cover_image
                    sku = prd.sku
                }
            })
            return {
                color: vr.color,
                image: colorImage,
                sku: sku,
                selected: index === 0 ? true : false,
                codes: vr.color_codes
            }
        })
    )

    const [selectedProduct, setSelectedProduct] = useState({ ...product.details[0] })

    const isInSale = selectedProduct.maximum_retail_price !== selectedProduct.selling_price
    const availableSizes = product.variations.filter(v => v.color === colorDetails.filter(clD => clD.selected)[0].color)[0].available_sizes
    const selectedSize = selectedProduct.attribute.filter(attr => attr.name.substring(0, 4) === 'Size')[0].value


    const selectProductByColor = sku => {
        const prod = product.details.filter(prd => prd.sku === sku)[0]
        const colorToBeSelected = prod.attribute.filter(attr => attr.name === 'Color')[0].value
        setSelectedProduct({ ...prod })
        setColorDetails([
            ...colorDetails.map(clr => ({
                ...clr,
                selected: clr.color === colorToBeSelected
            }))
        ])
    }

    const selectProductBySize = newSize => {
        var newIndex = 0
        for (let index = 0; index < product.details.length; index++) {
            const prd = product.details[index]
            const thisColor = prd.attribute.filter(attr => attr.name === 'Color' && attr.value === colorDetails.filter(clD => clD.selected)[0].color).length > 0
            const thisSize = prd.attribute.filter(attr => attr.name.substring(0, 4) === 'Size' && attr.value === newSize).length > 0
            if (thisColor && thisSize) {
                newIndex = index
                break
            }
        }

        setSelectedProduct({ ...product.details[newIndex] })
    }

    const addToCart = async () => {
        var data = null
        if (authData.isLoggedIn) {
            data = {
                is_guest: false,
                guest_token: null,
                email: authData.userData.email,
                sku: selectedProduct.sku,
                qty: qty
            }
        } else {
            const token = await cartData.generateGuestToken()
            data = {
                is_guest: true,
                guest_token: token,
                email: null,
                sku: selectedProduct.sku,
                qty: qty
            }
        }
        const details = await cartData.addToCart(data)
        setCartData({
            ...cartData,
            totalItems: details !== null ? details.total_items : cartData.totalItems,
            cartItems: details !== null ? [...details.cart_items] : [cartData.cartItems]
        })
    }

    return (
        <div>
            <Modal
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <Grid
                            container
                            spacing={1}
                            justifyContent="center"
                            alignItems="flex-start"
                        >
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                <Grid
                                    container
                                    direction="column"
                                    alignItems="center"
                                >
                                    <Grid item style={{ width: '100%' }}>
                                        <img
                                            style={{ objectFit: 'contain', maxWidth: 350 }}
                                            src={colorDetails.filter(det => det.selected)[0].image}
                                            alt={`${colorDetails.filter(det => det.selected)[0].sku}`}
                                        />
                                    </Grid>
                                    <Grid item style={{ width: '100%' }}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            color="primary"
                                            endIcon={<InfoOutlinedIcon />}
                                            component={Link}
                                            to={{
                                                pathname: `/shop/product/${product.parent}`,
                                                state: {
                                                    info: { ...product }
                                                }
                                            }}
                                        // to={`/shop/product/${product.parent}`}
                                        >
                                            More Product Info
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                <Grid container direction="column">
                                    <Grid item className={classes.productInfo}>
                                        <Typography variant="h6">
                                            {selectedProduct.title}
                                        </Typography>
                                    </Grid>
                                    <Grid item className={classes.productInfo}>
                                        <Grid
                                            container
                                            alignItems="flex-start"
                                            justifyContent="flex-start"
                                            direction="row"
                                            spacing={1}
                                        >
                                            <Grid item>
                                                <Typography
                                                    className={isInSale ? classes.discountedItem : ''}
                                                    variant={isInSale ? 'caption' : 'body2'}
                                                    color='primary'
                                                >
                                                    ₹ {selectedProduct.maximum_retail_price.toFixed(2)}
                                                </Typography>
                                            </Grid>
                                            {
                                                isInSale && (
                                                    <Grid item>
                                                        <Typography
                                                            variant="body2"
                                                            color='error'
                                                        >
                                                            ₹ {selectedProduct.selling_price.toFixed(2)}
                                                        </Typography>
                                                    </Grid>
                                                )
                                            }
                                            <Grid item>
                                                {
                                                    selectedProduct.in_stock === 0 ?
                                                        <Typography color="error">
                                                            (Out of Stock)
                                                        </Typography> :
                                                        <Typography>
                                                            (In Stock)
                                                        </Typography>
                                                }

                                            </Grid>

                                        </Grid>
                                    </Grid>
                                    <Grid item className={classes.productInfo}>
                                        <Typography>
                                            Color: {colorDetails.filter(clr => clr.selected)[0].color}
                                        </Typography>
                                    </Grid>
                                    <Grid item className={classes.productInfo}>
                                        <Grid container diection="row" spacing={2}>
                                            {
                                                [
                                                    ...colorDetails.map((clrDet, index) => (
                                                        <Grid item key={`${clrDet.sku}-index`}>
                                                            <div
                                                                style={{
                                                                    borderBottom: clrDet.selected ? '2px solid' : '0px'
                                                                }}
                                                                onClick={(e) => selectProductByColor(clrDet.sku)}
                                                            >
                                                                <img
                                                                    src={clrDet.image}
                                                                    alt={`${clrDet.sku}-thumb`}
                                                                    style={{ width: 50 }} />
                                                            </div>
                                                        </Grid>
                                                    ))
                                                ]
                                            }
                                        </Grid>

                                    </Grid>
                                    <Grid item className={classes.productInfo}>
                                        <Typography>
                                            Size: {selectedSize} {selectedProduct.attribute.filter(attr => attr.name.substring(0, 4) === 'Size')[0].name}
                                        </Typography>
                                    </Grid>
                                    <Grid item className={classes.productInfo}>
                                        {
                                            [
                                                ...availableSizes.map((sz, index) => (
                                                    <Button
                                                        className={classes.sizeButton}
                                                        onClick={e => selectProductBySize(sz)}
                                                        key={index}
                                                        size="small"
                                                        disabled={!product.variations.filter(vr => vr.color === colorDetails.filter(clD => clD.selected)[0].color)[0].available_sizes.includes(sz)}
                                                        variant={sz === selectedSize ? "contained" : "outlined"}
                                                        color="primary"
                                                    >
                                                        {sz}
                                                    </Button>
                                                ))
                                            ]
                                        }
                                    </Grid>
                                    <Grid item className={classes.productInfo}>
                                        <Select
                                            size="small"
                                            value={qty}
                                            onChange={(e) => setqty(e.target.value)}
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
                                    <Grid item className={classes.productInfo}>
                                        <Grid
                                            spacing={2}
                                            container
                                            alignContent="center"
                                            justifyContent="center">
                                            <Grid item style={{ width: '100%' }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    endIcon={<AddShoppingCartOutlinedIcon />}
                                                    fullWidth
                                                    onClick={addToCart}
                                                    disabled={selectedProduct.in_stock === 0}
                                                >
                                                    Add to Cart
                                                </Button>
                                            </Grid>
                                            <Grid item style={{ width: '100%' }}>
                                                <Button
                                                    endIcon={<FavoriteBorderSharpIcon />}
                                                    variant="outlined"
                                                    color="primary"
                                                    fullWidth
                                                >
                                                    Whishlist
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}

export default ProductModal
