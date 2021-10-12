import React, { useState, useContext } from 'react'

import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'

import Rating from '@material-ui/lab/Rating'

import FavoriteSharpIcon from '@material-ui/icons/FavoriteSharp'
// import FavoriteBorderSharpIcon from '@material-ui/icons/FavoriteBorderSharp'
import AddShoppingCartOutlinedIcon from '@material-ui/icons/AddShoppingCartOutlined'
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked'

import { CartContext } from '../../contexts/CartContext'
import { AuthContext } from '../../contexts/AuthContext'

import ProductModal from './ProductModal'

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 250,
        backgroundColor: '#ebf5f7',
        position: 'relative',
    },
    saleBadge: {
        position: 'absolute',
        top: theme.spacing(1),
        left: theme.spacing(0),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        color: 'white',
        backgroundColor: 'black',
    },
    newBadge: {
        position: 'absolute',
        top: theme.spacing(1),
        left: theme.spacing(0),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        color: 'black',
        backgroundColor: 'white',
    },
    outOfStockBadge: {
        position: 'absolute',
        top: theme.spacing(27),
        left: theme.spacing(0),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        color: 'white',
        backgroundColor: 'red',
    },
    rating: {
        position: 'absolute',
        top: theme.spacing(1),
        right: theme.spacing(0)
    },
    media: {
        height: 250,
    },
    discountedItem: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },
    sizeButton: {
        // margin: theme.spacing(0),
        // padding: theme.spacing(0),
        minHeight: 0,
        minWidth: theme.spacing(5.3),
        borderRadius: "0px"
    }
}))


const ProductCard = ({ product }) => {
    const classes = useStyles()

    const [variationIdx, setVariationIdx] = useState(0)

    const [open, setOpen] = React.useState(false);

    const { authData } = useContext(AuthContext)
    const { cartData, setCartData } = useContext(CartContext)

    const productToDisplay = { ...product.details[variationIdx] }

    const coverImage = productToDisplay.cover_image
    const secondaryImage = productToDisplay.other_images[Math.floor(Math.random() * productToDisplay.other_images.length)]

    const selectedColor = productToDisplay.attribute.filter(attr => attr.name === 'Color')[0].value
    const selectedSize = productToDisplay.attribute.filter(attr => attr.name.substring(0, 4) === 'Size')[0].value

    const [cardMediaImage, setCardMediaImage] = useState(coverImage)

    const isInSale = productToDisplay.maximum_retail_price !== productToDisplay.selling_price
    const availableSizes = product.variations.filter(v => v.color === selectedColor)[0].available_sizes

    const createdDay = Math.round(Math.abs(new Date() - new Date(productToDisplay.created_ts)) / 86400000)
    const isNew = createdDay < 30

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const addToCart = async () => {
        var data = null
        if (authData.isLoggedIn) {
            data = {
                is_guest: false,
                guest_token: null,
                email: authData.userData.email,
                sku: productToDisplay.sku,
                qty: 1
            }
        } else {
            const token = await cartData.generateGuestToken()
            data = {
                is_guest: true,
                guest_token: token,
                email: null,
                sku: productToDisplay.sku,
                qty: 1
            }
        }
        const details = await cartData.addToCart(data)
        setCartData({
            ...cartData,
            totalItems: details !== null ? details.total_items : cartData.totalItems,
            cartItems: details !== null ? [...details.cart_items] : [cartData.cartItems]
        })
    }

    const selectProductBySize = newSize => {
        var newIndex = 0
        for (let index = 0; index < product.details.length; index++) {
            const prd = product.details[index]
            const thisColor = prd.attribute.filter(attr => attr.name === 'Color' && attr.value === selectedColor).length > 0
            const thisSize = prd.attribute.filter(attr => attr.name.substring(0, 4) === 'Size' && attr.value === newSize).length > 0
            if (thisColor && thisSize) {
                newIndex = index
                break
            }
        }

        setVariationIdx(newIndex)
    }

    const selectProductByColor = color => {
        var newIndex = 0
        for (let index = 0; index < product.details.length; index++) {
            const prd = product.details[index]
            const thisColor = prd.attribute.filter(attr => attr.name === 'Color' && attr.value === color).length > 0
            if (thisColor) {
                newIndex = index
                break
            }
        }
        setVariationIdx(newIndex)
    }

    return (
        <>
            <Card
                elevation={10}
                className={classes.root}>
                <CardActionArea
                    component={Link}
                    to={{
                        pathname: `/shop/product/${product.parent}`,
                        state: {
                            info: { ...product }
                        }
                    }}
                >
                    <CardMedia
                        className={classes.media}
                        image={cardMediaImage}
                        onMouseEnter={(e) => setCardMediaImage(secondaryImage)}
                        onMouseOut={(e) => setCardMediaImage(coverImage)}
                        title="Sample Image" />
                </CardActionArea>
                <CardContent>
                    <Grid
                        container
                        direction="column"
                    >
                        <Grid item>
                            <Typography variant="caption">
                                {productToDisplay.title}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                size="small"
                                variant="text"
                                color="primary"
                                component={Link}
                                to={`/shop/category/${productToDisplay.primary_category_slug}`}
                            >
                                <Typography variant="caption">
                                    {`${productToDisplay.for_gender}'s ${productToDisplay.primary_category_name}`}
                                </Typography>
                            </Button>
                            /
                            <Button
                                size="small"
                                variant="text"
                                color="primary"
                                component={Link}
                                to={`/shop/sub-category/${productToDisplay.category_slug}`}
                            >
                                <Typography variant="caption">
                                    {productToDisplay.category_name}
                                </Typography>
                            </Button>
                        </Grid>
                        <Grid item>
                            <Grid
                                container
                                alignItems="flex-end"
                                justifyContent="flex-end"
                                direction="row"
                                spacing={2}
                            >
                                <Grid item>
                                    <Typography
                                        className={isInSale ? classes.discountedItem : ''}
                                        variant={isInSale ? 'body2' : 'subtitle1'}
                                        color='primary'
                                    >
                                        ₹ {productToDisplay.maximum_retail_price.toFixed(2)}
                                    </Typography>
                                </Grid>
                                {
                                    isInSale && (
                                        <Grid item>
                                            <Typography
                                                variant="subtitle1"
                                                color='error'
                                            >
                                                ₹ {productToDisplay.selling_price.toFixed(2)}
                                            </Typography>
                                        </Grid>
                                    )
                                }

                            </Grid>
                        </Grid>
                        <Grid item>
                            {
                                [
                                    ...product.variations.map((variation, index) => {
                                        return (
                                            <IconButton
                                                key={index}
                                                size="small"
                                                onClick={e => selectProductByColor(variation.color)}
                                            >
                                                {selectedColor === variation.color ?
                                                    <RadioButtonCheckedIcon style={{ color: variation.color_codes[0] }} /> :
                                                    <FiberManualRecordIcon style={{ color: variation.color_codes[0], fontSize: '30px' }} />}
                                            </IconButton>
                                        )
                                    })
                                ]
                            }
                        </Grid>
                        <Grid item>
                            {
                                [
                                    ...availableSizes.map((sz, index) => (
                                        <Button
                                            className={classes.sizeButton}
                                            onClick={e => selectProductBySize(sz)}
                                            key={index}
                                            size="small"
                                            disabled={!product.variations.filter(vr => vr.color === selectedColor)[0].available_sizes.includes(sz)}
                                            variant={sz === selectedSize ? "contained" : "outlined"}
                                            color="primary"
                                        >
                                            {sz}
                                        </Button>
                                    ))
                                ]
                            }
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <IconButton size='small' onClick={handleClickOpen}>
                        <VisibilityOutlinedIcon />
                    </IconButton>
                    <IconButton size='small' onClick={addToCart} disabled={productToDisplay.in_stock === 0}>
                        <AddShoppingCartOutlinedIcon />
                    </IconButton>
                    <IconButton size='small' style={{ marginLeft: 'auto' }}>
                        <FavoriteSharpIcon />
                    </IconButton>
                </CardActions>
                {
                    (isInSale || isNew) && (
                        <>
                            {
                                isInSale ?
                                    (
                                        <div className={classes.saleBadge}>
                                            <Typography variant="caption">
                                                SALE
                                            </Typography>
                                        </div>
                                    ) : (
                                        <div className={classes.newBadge}>
                                            <Typography variant="caption">
                                                NEW
                                            </Typography>
                                        </div>
                                    )
                            }
                        </>
                    )
                }
                {
                    productToDisplay.in_stock === 0 &&
                    <div className={classes.outOfStockBadge}>
                        <Typography variant="caption">
                            Out Of Stock
                        </Typography>
                    </div>
                }
                <div className={classes.rating}>
                    <Rating
                        name="read-only"
                        value={product.rating}
                        precision={0.5}
                        readOnly
                        size="small"
                    />
                </div>
            </Card>

            <ProductModal
                open={open}
                handleClose={handleClose}
                product={product} />
        </>
    )
}

export default ProductCard
