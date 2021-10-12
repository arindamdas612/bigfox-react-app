import React, { useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'

import Alert from '@material-ui/lab/Alert'

import { AuthContext } from '../../contexts/AuthContext'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}))

const SignUpForm = ({ register }) => {
    const classes = useStyles()

    const { authData } = useContext(AuthContext)

    const [formData, setFormData] = useState({
        initial: "Mr.",
        fname: '',
        lname: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        error: null,
        errorField: null,
    })


    const handleMobileChange = async (e) => {
        const newMobile = e.target.value
        setFormData({
            ...formData,
            mobile: newMobile,
            error: null,
            errorField: null,
        })
        const check = await authData.checkMobile(newMobile)
        setFormData({
            ...formData,
            mobile: newMobile,
            error: check ? null : 'Mobile number taken',
            errorField: check ? null : 'mobile'
        })
    }

    const authSignIn = async (e) => {
        e.preventDefault()

        if (formData.error) {
            return
        }

        setFormData({
            ...formData,
            error: null,
            errorField: null,
        })

        if (formData.mobile.length < 10 || formData.mobile.length > 15) {
            setFormData({
                ...formData,
                error: 'Invalid Mobile',
                errorField: 'mobile',
            })
        }

        if (formData.password !== formData.confirmPassword) {
            setFormData({
                ...formData,
                error: 'Passwords do not match',
                errorField: 'password',
            })
            return
        }

        const check = await authData.checkEmail(formData.email)
        if (!check) {
            setFormData({
                ...formData,
                error: check ? null : 'Email already taken',
                errorField: check ? null : 'email'
            })
            return
        }

        const success = await register(formData)

        if (!success) setFormData({
            ...formData,
            error: 'Registration Failed'
        })

    }

    return (
        <div className={classes.paper}>
            <Typography component="h1" variant="h5">
                New Customer
            </Typography>
            {
                formData.error !== null &&
                formData.errorField === null &&
                <Alert severity="error">{formData.error}</Alert>
            }
            <form className={classes.form} onSubmit={authSignIn}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Initial</FormLabel>
                    <RadioGroup
                        row aria-label="initial"
                        name="initial"
                        defaultValue={formData.initial}
                        onChange={(e, value) => setFormData({ ...formData, initial: value })}
                    >
                        <FormControlLabel
                            value="Mr."
                            control={<Radio color="primary" />}
                            label="Mr."
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value="Mrs."
                            control={<Radio color="primary" />}
                            label="Mrs."
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value="Ms."
                            control={<Radio color="primary" />}
                            label="Ms."
                            labelPlacement="start"
                        />
                    </RadioGroup>
                </FormControl>
                <TextField
                    variant="standard"
                    margin="normal"
                    required
                    fullWidth
                    id="firstname"
                    label="First Name"
                    name="firstname"
                    value={formData.fname}
                    onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                />
                <TextField
                    variant="standard"
                    margin="normal"
                    required
                    fullWidth
                    id="lastname"
                    label="Last Name"
                    name="lastname"
                    value={formData.lname}
                    onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                />
                <TextField
                    variant="standard"
                    margin="normal"
                    required
                    fullWidth
                    id="mobile"
                    label="Mobile Number"
                    type="number"
                    name="mobile"
                    error={formData.errorField === 'mobile'}
                    helperText={formData.errorField === 'mobile' ? formData.error : ''}
                    value={formData.mobile}
                    onChange={handleMobileChange}
                />
                <TextField
                    variant="standard"
                    margin="normal"
                    required
                    fullWidth
                    id="semail"
                    label="Email Address"
                    name="semail"
                    type="email"
                    error={formData.errorField === 'email'}
                    helperText={formData.errorField === 'email' ? formData.error : ''}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Grid container spacing={1}>
                    <Grid item lg={6} xs={12}>
                        <TextField
                            variant="standard"
                            margin="normal"
                            required
                            fullWidth
                            name="spassword"
                            label="Password"
                            type="password"
                            id="spassword"
                            error={formData.errorField === 'password'}
                            helperText={formData.errorField === 'password' ? formData.error : ''}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </Grid>
                    <Grid item lg={6} xs={12}>
                        <TextField
                            variant="standard"
                            margin="normal"
                            required
                            fullWidth
                            name="cpassword"
                            label="Confirm Password"
                            type="password"
                            id="cpassword"
                            error={formData.errorField === 'password'}
                            helperText={formData.errorField === 'password' ? formData.error : ''}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </Grid>
                </Grid>

                <Button
                    type="submit"
                    disabled={authData.fetching}
                    fullWidth
                    variant="contained"
                    color="primary"

                    className={classes.submit}
                >
                    Sign Up
                </Button>
            </form>
        </div>
    )
}

export default SignUpForm
