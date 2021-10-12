import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'

import { AuthContext } from '../../contexts/AuthContext'

const PrivateRoute = ({ children, ...rest }) => {
    const { authData } = useContext(AuthContext)

    return (
        <Route
            {...rest} render={({ location }) => {
                return authData.isLoggedIn ?
                    children :
                    <Redirect to={{
                        pathname: '/auth',
                        state: { from: location }
                    }} />
            }}
        />
    )
}

export default PrivateRoute
