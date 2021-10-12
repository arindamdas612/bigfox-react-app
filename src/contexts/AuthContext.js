import React, { createContext, useState } from 'react'
import axios from 'axios'

const LOGIN_URL = 'http://localhost:8000/api/login/'
const LOGOUT_URL = 'http://localhost:8000/api/logout/'
const PROFILE_URL = 'http://127.0.0.1:8000/api/user/profile/'
const REGISTER_URL = 'http://127.0.0.1:8000/api/users/register/'
const VAL_MOBILE_URL = 'http://127.0.0.1:8000/api/users/validate-mobile/'
const VAL_EMAIL_URL = 'http://127.0.0.1:8000/api/users/validate-email/'

export const AuthContext = createContext()

export const AuthContextProvider = props => {
    const [authData, setAuthData] = useState({
        fetching: false,
        userData: null,
        isLoggedIn: false,
        autoSignIn: async () => {
            const token = localStorage.getItem('token') || ''
            try {
                if (token.length > 0) {
                    const profile = await axios.get(PROFILE_URL, {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    })
                    if (profile.status === 200) {
                        return profile.data.user
                    } else {
                        return null
                    }
                } else {
                    return null
                }
            } catch (error) {
                return null
            }
        },
        signIn: async (email, password) => {
            const dataToPost = {
                username: email,
                password: password
            }
            try {
                const response = await axios.post(LOGIN_URL, dataToPost)
                if (response.status === 200) {
                    const profile = await axios.get(PROFILE_URL, {
                        headers: {
                            Authorization: `Token ${response.data.token}`
                        }
                    })
                    if (profile.status === 200) {
                        localStorage.setItem('token', response.data.token)
                        return profile.data.user
                    } else {
                        return null
                    }
                } else {
                    return null
                }
            } catch (error) {
                return null
            }
        },
        register: async (
            initial,
            firstname,
            lastname,
            email,
            mobile,
            password
        ) => {
            const dataToPost = {
                initial: initial,
                firstname: firstname,
                lastname: lastname,
                email: email,
                mobile: mobile,
                password: password
            }
            try {
                const response = await axios.post(REGISTER_URL, dataToPost)
                if (response.status === 201) {
                    console.log(response.data)
                    localStorage.setItem('token', response.data.token)
                    return response.data.user_data
                } else {
                    return null
                }
            } catch (error) {
                return null
            }
        },
        updateProfile: async (data) => {
            const token = localStorage.getItem('token') || ''
            try {
                const response = await axios.post(PROFILE_URL, data,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    },
                )
                if (response.status === 202)
                    return response.data.user_data
                return null
            } catch (error) {
                return null
            }
        },
        logout: async () => {
            try {
                const token = localStorage.getItem('token') || ''
                const response = await axios.get(LOGOUT_URL, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                })
                if (response.status === 200) {
                    localStorage.removeItem('token')
                    return true
                } else {
                    return false
                }
            } catch (error) {
                return false
            }
        },
        checkMobile: async (mobile) => {
            const token = localStorage.getItem('token') || ''
            const dataToPost = {
                'mobile': mobile
            }
            try {
                const response = await axios.post(
                    VAL_MOBILE_URL,
                    dataToPost,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    },
                )
                if (response.status === 200) return true
                return false
            } catch (error) {
                return false
            }
        },
        checkEmail: async (email) => {
            const dataToPost = {
                'email': email
            }
            try {
                const response = await axios.post(
                    VAL_EMAIL_URL,
                    dataToPost
                )
                if (response.status === 200) return true
                return false
            } catch (error) {
                return false
            }
        }
    })

    return (
        <AuthContext.Provider
            value={{ authData, setAuthData }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}