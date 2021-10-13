import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'

import FacebookIcon from '@material-ui/icons/Facebook'
import InstagramIcon from '@material-ui/icons/Instagram'
import YouTubeIcon from '@material-ui/icons/YouTube'

const useStyles = makeStyles((theme) => ({
    footer: {
        marginTop: 'auto',
        backgroundColor: theme.palette.primary.main,
        padding: theme.spacing(6, 0),
        marginTop: theme.spacing(5)
    },
    content: {
        paddingBottom: theme.spacing(3),
        background: theme.palette.primary.main
    },
    text: {
        color: theme.palette.primary.contrastText
    },
    divider: {
        background: '#ffffff'
    },
    header: {
        marginBottom: theme.spacing(3)
    }
}))

const Copyright = () => {
    const classes = useStyles();
    return (
        <Typography variant="caption" className={classes.text} align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Big Fox
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}


const Footer = () => {
    const classes = useStyles()

    return (
        <Box
            component="footer"
            className={classes.footer}
            // sx={{
            //     py: 3,
            //     px: 2,
            //     mt: 'auto',
            //     backgroundColor: (theme) =>
            //         theme.palette.mode === 'light'
            //             ? theme.palette.grey[200]
            //             : theme.palette.grey[800],
            // }}
        >
            <Container>
            <Grid container className={classes.content} spacing={3} justifyContent="center">
                    <Grid item xs={12} sm={2}>
                        <Typography variant="h4" className={classes.text}>
                            BigFox
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item>
                                <Link href="https://facebook.com">
                                    <FacebookIcon color="secondary" />
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="https://instagram.com">
                                    <InstagramIcon color="secondary" />
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="https://youtube.com">
                                    <YouTubeIcon color="secondary" />
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <Grid container direction="column">
                            <Grid item className={classes.header}>
                                <Typography variant="subtitle1" className={classes.text}>
                                    Support
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" className={classes.text}>
                                    Contact Us
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" className={classes.text}>
                                    FAQ
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <Grid container direction="column">
                            <Grid item className={classes.header}>
                                <Typography variant="subtitle1" className={classes.text}>
                                    Shop
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" className={classes.text}>
                                    Men's Shopping
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" className={classes.text}>
                                    Women's Shopping
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" className={classes.text}>
                                    Kid's Shopping
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <Grid container direction="column">
                            <Grid item className={classes.header}>
                                <Typography variant="subtitle1" className={classes.text}>
                                    Company
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" className={classes.text}>
                                    Our Story
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" className={classes.text}>
                                    Terms & Conditions
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" className={classes.text}>
                                    Privacy & Cookie policy
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <Grid container direction="column">
                            <Grid item className={classes.header}>
                                <Typography variant="subtitle1" className={classes.text}>
                                    Contact
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" className={classes.text}>
                                    +91 999 999 9999
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" className={classes.text}>
                                    +91 999 999 9999
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" className={classes.text}>
                                    support@bigfox.co
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider className={classes.divider} />
                <Copyright />
            </Container>
        </Box>
    )
}



export default Footer
