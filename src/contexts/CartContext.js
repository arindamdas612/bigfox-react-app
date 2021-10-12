import React, { createContext, useState } from 'react'
import axios from 'axios'

const GENERATE_TOKEN_URL = 'http://localhost:8000/api/cart/generate-guest-token/'

const ADD_TO_CART = 'http://localhost:8000/api/cart/add/'

const USER_CART = 'http://127.0.0.1:8000/api/cart/user/'
const MODIFY_USER_CART = 'http://127.0.0.1:8000/api/cart/user/modify/'
const DELETE_USER_CART = 'http://127.0.0.1:8000/api/cart/user/item/'
const VALIDATE_USER_CART = 'http://127.0.0.1:8000/api/cart/user/validate/'
const TRANSFER_USER_CART = 'http://127.0.0.1:8000/api/cart/user/transfer/'

const GUEST_CART = 'http://127.0.0.1:8000/api/cart/guest/'
const MODIFY_GUEST_CART = 'http://127.0.0.1:8000/api/cart/guest/modify/'
const DELETE_GUEST_CART = 'http://127.0.0.1:8000/api/cart/guest/item/'



export const CartContext = createContext()

export const CartContextProvider = props => {
    const [cartData, setCartData] = useState({
        guestToken: localStorage.getItem('guestToken' || null),
        totalItems: 0,
        cartItems: [],
        fetchGuestCart: async () => {
            const guestToken = localStorage.getItem('guestToken') || null
            if (guestToken === null) return null
            try {
                const response = await axios.get(`${GUEST_CART}${guestToken}`)
                if (response.status === 200)
                    return response.data
                return null
            } catch (error) {
                return null
            }

        },
        fetchUserCart: async () => {
            const token = localStorage.getItem('token')
            try {
                const response = await axios.get(USER_CART, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                })
                if (response.status === 200) {
                    return { ...response.data }
                }
                return null
            } catch (error) {
                return null
            }
        },
        modifyUserCart: async (id, qty) => {
            const token = localStorage.getItem('token')
            try {
                const response = await axios.post(`${MODIFY_USER_CART}${id}`,
                    {
                        'qty': qty
                    },
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    })
                if (response.status === 200) {
                    return { ...response.data }
                }
                return null
            } catch (error) {
                return null
            }
        },
        modifyGuestCart: async (id, qty) => {
            const token = localStorage.getItem('guestToken')
            try {
                const response = await axios.post(`${MODIFY_GUEST_CART}${id}`,
                    {
                        qty: qty,
                        token: token
                    },
                )
                if (response.status === 200) {
                    return { ...response.data }
                }
                return null
            } catch (error) {
                return null
            }
        },
        deleteUserCart: async (id) => {
            const token = localStorage.getItem('token')
            try {
                const response = await axios.delete(`${DELETE_USER_CART}${id}`,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    })
                if (response.status === 200) {
                    return { ...response.data }
                }
                return null
            } catch (error) {
                return null
            }
        },
        deleteGuestCart: async (id) => {
            try {
                const response = await axios.delete(`${DELETE_GUEST_CART}${id}`)
                if (response.status === 200) {
                    return { ...response.data }
                }
                return null
            } catch (error) {
                return null
            }
        },
        generateGuestToken: async () => {
            const token = localStorage.getItem('guestToken') || null
            if (token !== null) return token
            try {
                const response = await axios.get(GENERATE_TOKEN_URL)
                if (response.status === 200) {
                    const token = response.data.guest_token
                    localStorage.setItem('guestToken', token)
                    return response.data.guest_token
                }
                return null
            } catch (error) {
                return null
            }
        },
        addToCart: async (data) => {
            try {
                const response = await axios.post(ADD_TO_CART, data)
                // console.log(response.status, response.data)
                if (response.status === 200) {
                    return response.data
                }
                return null
            } catch (error) {
                return null
            }
        },
        validateCart: async () => {
            const token = localStorage.getItem('token')
            try {
                const response = await axios.get(VALIDATE_USER_CART, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                })
                if (response.status === 200)
                    return response.data
                return null
            } catch (error) {
                return null
            }
        },
        transferToUserCart: async () => {
            const guestCode = localStorage.getItem('guestToken') || null
            if (guestCode === null) return
            const token = localStorage.getItem('token')
            const config = {
                headers: {
                    Authorization: `Token ${token}`
                }
            }
            try {
                const response = await axios.get(`${TRANSFER_USER_CART}${guestCode}`, config)
                if (response.status === 200) {
                    localStorage.removeItem('guestToken')
                    return response.data
                }
                return null
            } catch (error) {
                return null
            }
        }
    })

    return (
        <CartContext.Provider value={{ cartData, setCartData }}>
            {props.children}
        </CartContext.Provider>
    )
}