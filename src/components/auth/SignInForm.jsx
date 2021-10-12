import React, { useState, useContext } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

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
}));


const SignInForm = ({ signIn }) => {
    const classes = useStyles()

    const { authData } = useContext(AuthContext)

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        error: null,
    })

    const authSignIn = async (e) => {
        e.preventDefault()
        setFormData({
            ...formData,
            error: null,
        })
        const result = await signIn(formData.email, formData.password)

        setFormData({
            ...formData,
            error: result ? null : 'Login Failed',
        })
    }


    return (
        <div className={classes.paper}>

            <Typography component="h1" variant="h5">
                Returning Customer
            </Typography>
            {
                formData.error !== null &&
                <Alert severity="error">{formData.error}</Alert>
            }
            <form className={classes.form} onSubmit={authSignIn}>
                <TextField
                    variant="standard"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <TextField
                    variant="standard"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Grid container>
                    <Grid item xs>
                        <Link href="#" variant="body2">
                            Forgot password?
                        </Link>
                    </Grid>
                </Grid>
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={authData.fetching}
                    className={classes.submit}
                >
                    Sign In
                </Button>
            </form>
        </div>
    )
}

export default SignInForm
