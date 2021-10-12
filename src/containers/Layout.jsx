/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext } from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import { makeStyles } from '@material-ui/styles'

import Container from '@material-ui/core/Container'

import BxAppBar from '../components/common/BxAppBar'
import Footer from '../components/common/Footer'

import { AuthContext } from '../contexts/AuthContext'

import Home from './pages/Home'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import Category from './pages/Category'
import SubCategory from './pages/SubCategory'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'

import PrivateRoute from '../components/common/PrivateRoute'

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: '10px',
        paddingBottom: '10px'
    }
}))

const Layout = () => {
    const classes = useStyles()

    const { authData, setAuthData } = useContext(AuthContext)

    const autoSignIn = async () => {
        setAuthData({
            ...authData,
            fetching: true
        })
        const userData = await authData.autoSignIn()
        setAuthData({
            ...authData,
            fetching: false,
            userData: userData !== null ? { ...userData } : null,
            isLoggedIn: userData !== null ? true : false
        })
    }


    useEffect(() => {
        if (!authData.isLoggedIn) autoSignIn()
        return () => { }
    }, [])

    return (
        <Router>
            <BxAppBar />
            <Container
                maxWidth="lg"
                className={classes.root}
            >
                <Route path="/auth" exact component={Auth} />
                <Route path="/" exact component={Home} />
                <PrivateRoute path="/profile" exact>
                    <Profile />
                </PrivateRoute>
                <Route path="/shop/category" component={Category} />
                <Route path="/shop/sub-category" component={SubCategory} />
                <Route path="/shop/product" component={Product} />
                <Route path="/cart" exact component={Cart} />
                <PrivateRoute path="/checkout" exact>
                    <Checkout />
                </PrivateRoute>
            </Container>
            <Footer />
        </Router>
    )
}

export default Layout
