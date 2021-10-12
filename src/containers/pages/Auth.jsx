import React, { useContext } from 'react'

import { Redirect, useLocation } from 'react-router-dom'

import { makeStyles } from '@material-ui/styles'

import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import { AuthContext } from '../../contexts/AuthContext'
import { CartContext } from '../../contexts/CartContext'

import SignUpForm from '../../components/auth/SignUpForm'
import SignInForm from '../../components/auth/SignInForm'


const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: '10px'
    }
}))

const Auth = () => {
    const classes = useStyles()

    const { authData, setAuthData } = useContext(AuthContext)
    const { cartData, setCartData } = useContext(CartContext)

    const { state } = useLocation()

    var checkoutUrl = state?.from || '/'
    checkoutUrl = checkoutUrl === '/checkout'

    const signIn = async (email, password) => {
        setAuthData({
            ...authData,
            fetching: true,
        })
        const userData = await authData.signIn(email, password)
        setAuthData({
            ...authData,
            fetching: false,
            userData: userData !== null ? { ...userData } : null,
            isLoggedIn: userData !== null ? true : false
        })
        if (userData) {
            if (checkoutUrl) {
                const details = await cartData.transferToUserCart()
                setCartData({
                    ...cartData,
                    totalItems: details !== null ? details.total_items : cartData.totalItems,
                    cartItems: details !== null ? [...details.cart_items] : [...cartData.cartItems],
                })
            }
            return true
        }
        return false
    }

    const register = async data => {
        setAuthData({
            ...authData,
            fetching: true,
        })
        const userData = await authData.register(
            data.initial,
            data.fname,
            data.lname,
            data.email,
            data.mobile,
            data.password
        )
        setAuthData({
            ...authData,
            fetching: false,
            userData: userData !== null ? { ...userData } : null,
            isLoggedIn: userData !== null ? true : false
        })
        if (userData) {
            if (checkoutUrl) {
                const details = await cartData.transferToUserCart()
                setCartData({
                    ...cartData,
                    totalItems: details !== null ? details.total_items : cartData.totalItems,
                    cartItems: details !== null ? [...details.cart_items] : [...cartData.cartItems],
                })
            }
            return true
        }
        return false
    }


    console.log()


    return authData.isLoggedIn ?
        <Redirect to={state?.from || '/'} /> :
        (
            <Container
                maxWidth="lg"
                className={classes.root}
            >
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                >
                    <Grid
                        item
                        xs={12}
                        sm={5}
                        lg={4}>
                        <Box
                            bgcolor="white"
                            color="black" p={2}>
                            <SignInForm signIn={signIn} />
                        </Box>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={5}
                        lg={4}>
                        <Box
                            bgcolor="white"
                            color="black" p={2}>
                            <SignUpForm register={register} />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        )
}

export default Auth
