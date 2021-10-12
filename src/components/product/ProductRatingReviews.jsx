/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionActions from '@material-ui/core/AccordionActions'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'

import Rating from '@material-ui/lab/Rating'

import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined'
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined'

import { AuthContext } from '../../contexts/AuthContext'
import axios from 'axios'

const REVIEW_URL = 'http://127.0.0.1:8000/api/shop/product-review/'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(1),
        marginBottom: theme.spacing(2)
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    details: {
        alignItems: 'center',
    },
    column: {
        flexBasis: '33.33%',
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: theme.spacing(1, 2),
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
}))


const ProductRatingReviews = ({ sku, rating }) => {
    const classes = useStyles()

    const [selfReview, setSelfReview] = useState(null)
    const [reviews, setReviews] = useState([])
    const [newReview, setNewReview] = useState({
        content: '',
        rating: 4
    })

    const { authData } = useContext(AuthContext)

    const fetchData = async () => {
        const url = `${REVIEW_URL}${sku}`
        const dataToPost = {
            email: authData.userData !== null ? authData.userData.email : null
        }
        try {
            const response = await axios.get(url, { params: dataToPost })
            if (response.status === 200) {
                const userEmail = authData.userData?.email || null
                var userReview = null
                var otherReviews = [...response.data]
                if (userEmail !== null) {
                    userReview = response.data.filter(review => review.email === userEmail).length > 0 ?
                        response.data.filter(review => review.email === userEmail)[0] :
                        null
                    otherReviews = response.data.filter(review => review.email !== userEmail)
                }
                setSelfReview(userReview)
                setReviews([...otherReviews])

            }
        } catch (error) { }
    }

    useEffect(() => {
        if (!authData.fetching)
            fetchData()
        return () => { }
    }, [authData.fetching])

    const postNewReview = async () => {
        if (newReview.content.length === 0) return
        const email = authData.userData.email
        const url = `${REVIEW_URL}${sku}`
        try {
            const response = await axios.post(url, {
                email: email,
                ...newReview
            })
            if (response.status === 201) {
                var userReview = null
                var otherReviews = [...response.data]
                if (email !== null) {
                    userReview = response.data.filter(review => review.email === email).length > 0 ?
                        response.data.filter(review => review.email === email)[0] :
                        null
                    otherReviews = response.data.filter(review => review.email !== email)
                }
                setSelfReview(userReview)
                setReviews([...otherReviews])
            }
        } catch (error) { }
    }

    const processReviewReaction = async (reaction, reviewIndex) => {
        const review = reviews[reviewIndex]
        const url = `${REVIEW_URL}${sku}`
        const dataToPost = {
            review_id: review.id,
            email: authData.userData.email,
            reaction: reaction
        }
        try {
            const response = await axios.put(url, dataToPost)
            if (response.status === 201) {
                const userReview = response.data.filter(review => review.email === authData.userData.email).length > 0 ?
                    response.data.filter(review => review.email === authData.userData.email)[0] :
                    null
                const otherReviews = response.data.filter(review => review.email !== authData.userData.email)
                setSelfReview(userReview)
                setReviews([...otherReviews])
            }
        } catch (error) { }
    }

    const reviewCard = (review, index, self) => review === null ? null : <Paper
        elevation={10}
        className={classes.paper}
        key={`comment-${index}`}
    >
        <Grid
            container
            spacing={2}
            alignItems="center"
        >
            <Grid item xs={12} sm={4}>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <Avatar
                            style={{
                                width: 70,
                                height: 70,
                                fontSize: 30
                            }}
                        >
                            {review.initial}
                        </Avatar>
                    </Grid>
                    <Grid item xs={12} lg={9}>
                        <Rating
                            name="read-only"
                            value={review.givenRating}
                            precision={0.5}
                            readOnly
                        />
                        <Typography variant="h5">
                            {review.name}
                        </Typography>
                        <Typography variant="caption">
                            {review.date}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={8}>
                <Typography
                    variant="body2"
                    align="justify"
                >
                    {review.content}
                </Typography>
            </Grid>
            <Grid item lg={12}>
                <Grid
                    container
                    alignItems="center"
                >
                    <Grid item>
                        <IconButton
                            disabled={!authData.isLoggedIn || self}
                            size="small"
                            onClick={e => processReviewReaction(true, index)}
                        >
                            <ThumbUpAltOutlinedIcon
                                color={review.userReaction === 1 ? "primary" : "secondary"}
                            />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography variant="caption">
                            {review.likes}
                        </Typography>
                    </Grid>
                    <Grid item style={{ marginLeft: 10 }}>
                        <IconButton
                            disabled={!authData.isLoggedIn || self}
                            size="small"
                            onClick={e => processReviewReaction(false, index)}
                        >
                            <ThumbDownAltOutlinedIcon
                                color={review.userReaction === 0 ? "primary" : "secondary"}
                            />
                        </IconButton>

                    </Grid>
                    <Grid item>
                        <Typography variant="caption">
                            {review.dislikes}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Paper>

    return (
        <>
            {
                selfReview === null && (
                    <div className={classes.root}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1c-content"
                                id="panel1c-header"
                            >
                                <div className={classes.column}>
                                    <Typography>
                                        Write a Review
                                    </Typography>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails className={classes.details}>
                                <Grid container direction="column">
                                    {
                                        !authData.isLoggedIn ?
                                            <Grid item>
                                                <Typography variant="h6">
                                                    Log in to write a review
                                                </Typography>
                                            </Grid> :
                                            <>
                                                <Grid item>
                                                    <Rating
                                                        name="userRating"
                                                        value={newReview.rating}
                                                        precision={0.5}
                                                        placeholder="Write your review"
                                                        onChange={(event, newValue) => {
                                                            setNewReview({ ...newReview, rating: newValue })
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <TextareaAutosize
                                                        style={{ width: '100%' }}
                                                        maxRows={10}
                                                        minRows={3}
                                                        value={newReview.content}
                                                        onChange={e => setNewReview({
                                                            ...newReview,
                                                            content: e.target.value
                                                        })}
                                                    />
                                                </Grid>
                                            </>
                                    }
                                </Grid>
                            </AccordionDetails>
                            <AccordionActions>
                                <Button
                                    onClick={postNewReview}
                                    size="small"
                                    color="primary"
                                    variant="contained">
                                    Post Review
                                </Button>
                            </AccordionActions>
                        </Accordion>
                    </div>
                )
            }

            <div style={{
                marginTop: 20,
                marginBottom: 20
            }}>
                {reviewCard(selfReview, -1, true)}
                {[
                    ...reviews.map((review, index) => (
                        reviewCard(review, index, false)
                    ))
                ]}
            </div>

        </>
    )
}

export default ProductRatingReviews
