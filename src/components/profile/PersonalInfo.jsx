import React, { useState, useContext } from 'react'

import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import Alert from '@material-ui/lab/Alert'

import { AuthContext } from '../../contexts/AuthContext'


const PersonalInfo = () => {

    const { authData, setAuthData } = useContext(AuthContext)

    const [message, setMessage] = useState('')

    const [userInfo, setUserInfo] = useState({
        initial: authData.userData.initial,
        firstname: authData.userData.firstname,
        lastname: authData.userData.lastname,
        email: authData.userData.email,
        mobile: authData.userData.mobile,
        currentpassword: '',
        newpassword: '',
        confirmpassword: '',
        error: '',
        errorField: ''
    })

    const handleFormSubmit = async (e) => {
        e.preventDefault()

        setUserInfo({
            ...userInfo,
            error: null,
            errorField: null
        })
        setMessage('')

        if (
            (userInfo.initial === authData.userData.initial) &&
            (userInfo.firstname === authData.userData.firstname) &&
            (userInfo.lastname === authData.userData.lastname) &&
            (userInfo.email === authData.userData.email) &&
            (userInfo.mobile === authData.userData.mobile) &&
            (userInfo.currentpassword.length === 0) &&
            (userInfo.newpassword.length === 0) &&
            (userInfo.confirmpassword.length === 0)
        ) {
            return
        }
        if (userInfo.currentpassword !== '') {
            const resp = await authData.signIn(authData.userData.email, userInfo.currentpassword)
            setUserInfo({
                ...userInfo,
                error: resp === null ? 'Invalid current password' : null,
                errorField: resp === null ? 'password' : null
            })
            if (!resp) {
                return
            }
        }

        if (userInfo.newpassword.length === 0 && userInfo.currentpassword !== '') {
            setUserInfo({
                ...userInfo,
                error: 'New Password required',
                errorField: 'newPassword'
            })
            return
        }

        if (userInfo.confirmpassword.length === 0 && userInfo.currentpassword !== '') {
            setUserInfo({
                ...userInfo,
                error: 'Re-type new Password required',
                errorField: 'confirmPassword'
            })
            return
        }

        if (userInfo.newpassword !== userInfo.confirmpassword && userInfo.newpassword.length > 0) {
            setUserInfo({
                ...userInfo,
                error: 'Passwords do not match',
                errorField: 'newPasswords'
            })
            return
        }

        if (userInfo.currentpassword === userInfo.newpassword && userInfo.currentpassword !== '') {
            setUserInfo({
                ...userInfo,
                error: 'Cannot be the same password',
                errorField: 'newPasswords'
            })
            return
        }

        const logoutRequired = userInfo.newpassword.length > 0

        if (parseInt(userInfo.mobile) !== authData.userData.mobile) {
            const mobileCheck = await authData.checkMobile(userInfo.mobile)
            if (!mobileCheck) {
                setUserInfo({
                    ...userInfo,
                    error: 'Mobile number already exists',
                    errorField: 'mobile'
                })
            }
        }

        if (userInfo.email !== authData.userData.email) {
            const emailCheck = await authData.checkEmail(userInfo.email)
            if (!emailCheck) {
                setUserInfo({
                    ...userInfo,
                    error: 'Email already exists',
                    errorField: 'email'
                })
            }
        }

        var dataToUpdate = {}

        if (userInfo.initial !== authData.userData.initial) dataToUpdate.initial = userInfo.initial
        if (userInfo.firstname !== authData.userData.firstname) dataToUpdate.firstname = userInfo.firstname
        if (userInfo.lastname !== authData.userData.lastname) dataToUpdate.lastname = userInfo.lastname
        if (userInfo.email !== authData.userData.email) dataToUpdate.email = userInfo.email
        if (userInfo.mobile !== authData.userData.mobile) dataToUpdate.mobile = userInfo.mobile

        if (logoutRequired) {
            dataToUpdate.password = userInfo.newpassword
        }
        const response = await authData.updateProfile(dataToUpdate)

        if (response) {
            if (logoutRequired) {
                const logoutResponse = await authData.logout()
                setAuthData({
                    ...authData,
                    userData: logoutResponse ? null : { ...authData.userData },
                    isLoggedIn: logoutResponse ? false : authData.isLoggedIn
                })
            } else {
                setAuthData({
                    ...authData,
                    userData: { ...response }
                })
                setMessage('Profile Updated!!!')
            }
        } else {
            setMessage('Update Failed!!!')
        }
    }

    return (
        <form onSubmit={handleFormSubmit} style={{ padding: '20px 20px 20px 20px' }}>
            <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                    {
                        message !== '' &&
                        <Alert
                            severity={message === "Update Failed!!!" ? "error" : "success"}
                        >
                            {message}
                        </Alert>
                    }
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                    <Select
                        value={userInfo.initial}
                        onChange={(e) => setUserInfo({ ...userInfo, initial: e.target.value })}
                    >
                        <MenuItem value='Mr.'>Mr.</MenuItem>
                        <MenuItem value='Mrs.'>Mrs.</MenuItem>
                        <MenuItem value='Ms.'>Ms.</MenuItem>
                    </Select>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="First Name"
                        value={userInfo.firstname}
                        onChange={(e) => setUserInfo({ ...userInfo, firstname: e.target.value })}
                        required
                        size="small" />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Last Name"
                        value={userInfo.lastname}
                        onChange={(e) => setUserInfo({ ...userInfo, lastname: e.target.value })}
                        required
                        size="small" />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Email Address"
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        required
                        size="small" />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Mobile"
                        type="number"
                        value={userInfo.mobile}
                        onChange={(e) => setUserInfo({ ...userInfo, mobile: e.target.value })}
                        required
                        size="small" />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Current Password"
                        value={userInfo.currentpassword}
                        error={userInfo.errorField === 'password'}
                        helperText={userInfo.errorField === 'password' ? userInfo.error : ''}
                        onChange={(e) => setUserInfo({ ...userInfo, currentpassword: e.target.value })}
                        type="password"
                        size="small" />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="New Password"
                        type="password"
                        error={userInfo.errorField === 'newPassword' || userInfo.errorField === 'newPasswords'}
                        helperText={userInfo.errorField === 'newPassword' || userInfo.errorField === 'newPasswords' ? userInfo.error : ''}
                        value={userInfo.newpassword}
                        onChange={(e) => setUserInfo({ ...userInfo, newpassword: e.target.value })}
                        size="small" />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Confirm Password"
                        value={userInfo.confirmpassword}
                        error={userInfo.errorField === 'confirmPassword' || userInfo.errorField === 'newPasswords'}
                        helperText={userInfo.errorField === 'confirmPassword' || userInfo.errorField === 'newPasswords' ? userInfo.error : ''}
                        onChange={(e) => setUserInfo({ ...userInfo, confirmpassword: e.target.value })}
                        type="password"
                        size="small" />
                </Grid>
                <Grid item md={3} sm={3} xs={3}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={authData.fetching}
                        fullWidth
                    >
                        Save Changes
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default PersonalInfo
