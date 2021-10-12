/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'

import { useLocation } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import Rating from '@material-ui/lab/Rating'

import FavoriteBorderSharpIcon from '@material-ui/icons/FavoriteBorderSharp'
import AddShoppingCartOutlinedIcon from '@material-ui/icons/AddShoppingCartOutlined'

import CenterdBox from '../../components/common/CenterdBox'
import ProductDetails from '../../components/product/ProductDetails'
import ProductRatingReviews from '../../components/product/ProductRatingReviews'


import { CartContext } from '../../contexts/CartContext'
import { AuthContext } from '../../contexts/AuthContext'


const useStyles = makeStyles((theme) => ({
    paper: {
        flexGrow: 1,
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

const Product = () => {
    const classes = useStyles()
    const location = useLocation()

    const parent_sku = location.pathname.split('/')[location.pathname.split('/').length - 1]

    const { authData } = useContext(AuthContext)
    const { cartData, setCartData } = useContext(CartContext)

    const [product, setProduct] = useState(location.state?.info || null)
    const [loading, setLoading] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [colorDetails, setColorDetails] = useState(null)
    const [pictureIndex, setPictureIndex] = useState(0)
    const [qty, setqty] = useState(1)

    const isInSale = selectedProduct !== null ? selectedProduct.maximum_retail_price !== selectedProduct.selling_price : false
    const availableSizes = product !== null && colorDetails !== null ? product.variations.filter(v => v.color === colorDetails.filter(clD => clD.selected)[0].color)[0].available_sizes : []
    const selectedSize = selectedProduct !== null ? selectedProduct.attribute.filter(attr => attr.name.substring(0, 4) === 'Size')[0].value : -1



    const setPageDetails = (productInfo) => {
        setSelectedProduct({ ...productInfo.details[0] })
        setColorDetails(
            productInfo.variations.map((vr, index) => {
                var colorImages
                var sku

                productInfo.details.forEach(prd => {
                    const thisColor = prd.attribute.filter(attr => attr.name === 'Color' && attr.value === vr.color).length > 0
                    if (thisColor) {
                        colorImages = [prd.cover_image, ...prd.other_images]
                        sku = prd.sku
                    }
                })
                return {
                    color: vr.color,
                    images: colorImages,
                    sku: sku,
                    selected: index === 0 ? true : false,
                    codes: vr.color_codes
                }
            })
        )
    }

    const getProductInfo = async () => {
        if (product !== null) {
            setPageDetails({ ...product })
            return
        }
        const fetchURL = `http://127.0.0.1:8000/api/shop/product/${parent_sku}`
        try {
            setLoading(true)
            const response = await axios.get(fetchURL)
            if (response.status === 200 && response.data.length > 0) {
                const productInfo = { ...response.data[0] }
                setProduct({ ...productInfo })
                setPageDetails({ ...productInfo })
            }
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    useEffect(() => {
        getProductInfo()
    }, [])

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

    const imageGroup = colorDetails !== null ?
        colorDetails.filter(det => det.selected)[0].images :
        []

    const imageGroupElem =
        <Grid
            container
            spacing={1}
            directon="column"
            justifyContent="center"
            alignItems="center"
        >
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <div
                    style={{
                        width: '100%',

                    }}>
                    <Paper style={{
                        width: '350px',
                        margin: 'auto',
                        maxHeight: '400px',
                    }}>
                        <img
                            src={imageGroup[pictureIndex]}
                            alt="main"
                            style={{ width: '100%', maxHeight: '400px', objectFit: 'scale-down' }} />
                    </Paper>
                </div>


            </Grid>
            {
                imageGroup.map((image, index) => (
                    <Grid
                        item
                        key={`${selectedProduct.sku}-${index}`}
                        onClick={e => setPictureIndex(index)}
                    >
                        <img
                            src={image}
                            alt={`${selectedProduct.sku}-${index}`}
                            style={{ width: 70 }} />
                    </Grid>
                ))
            }
        </Grid>

    const productSpecificationElem = (selectedProduct !== null) && (colorDetails !== null) ?
        <Grid
            container
            direction="column"
        >
            <Grid item className={classes.productInfo}>
                <Grid
                    container
                    alignItems="center"
                    spacing={1}
                >
                    <Grid item>
                        <Typography variant="h6">
                            {selectedProduct.title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Rating
                            name="read-only"
                            value={product.rating}
                            precision={0.5}
                            readOnly
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item className={classes.productInfo}>
                <Grid
                    container
                    alignItems="flex-end"
                    justifyContent="flex-start"
                    direction="row"
                    spacing={1}
                >
                    <Grid item>
                        <Typography
                            className={isInSale ? classes.discountedItem : ''}
                            variant={isInSale ? 'h6' : 'h5'}
                        >
                            ₹ {selectedProduct.maximum_retail_price.toFixed(2)}
                        </Typography>
                    </Grid>
                    {
                        isInSale && (
                            <Grid item>
                                <Typography
                                    variant="h5"
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
                                            src={clrDet.images[0]}
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
                    <Grid item style={{ width: '100%' }} xs={12} sm={12} md={6} lg={6}>
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
                    <Grid item style={{ width: '100%' }} xs={12} sm={12} md={6} lg={6}>
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
        </Grid> :
        null

    return loading ?
        (
            <CenterdBox height="50vh">
                <CircularProgress size={200} />
            </CenterdBox>
        ) : selectedProduct === null || colorDetails === null ?
            (
                <CenterdBox height="70vh">
                    <Typography color="error" variant="h4">
                        Invalid Product, no details found.
                    </Typography>
                </CenterdBox>
            ) : (
                <div>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            Bread Crumb
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Grid container>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    {imageGroupElem}
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    {productSpecificationElem}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            {
                                selectedProduct !== null ?
                                    <ProductDetails
                                        selectedProduct={selectedProduct}
                                    /> :
                                    null
                            }
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            Related Products
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <ProductRatingReviews
                                sku={parent_sku}
                                rating={product.rating}
                            />
                        </Grid>
                    </Grid>
                </div>
            )
}

export default Product
