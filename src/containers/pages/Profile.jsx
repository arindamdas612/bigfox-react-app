import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import ProfileNavigationList from '../../components/profile/ProfileNavigationList'
import Orders from '../../components/profile/Orders'
import Wishlist from '../../components/profile/Wishlist'
import PersonalInfo from '../../components/profile/PersonalInfo'
import Addresses from '../../components/profile/Addresses'

const profileItems = [
    'Orders',
    'Whishlist',
    'Personal Info',
    'Addresses',
]

const Profile = () => {

    const [itemIndex, setItemIndex] = useState(3)

    const getDisplayWidget = () => {
        switch (itemIndex) {
            case 0:
                return <Orders />
            case 1:
                return <Wishlist />
            case 2:
                return <PersonalInfo />
            case 3:
                return <Addresses />
            default:
                return <Orders />
        }
    }

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item md={12}>
                    <Typography align="center" variant="h4">
                        My Account
                    </Typography>
                </Grid>
                <Grid item md={3} xs={12}>
                    <ProfileNavigationList
                        profileItems={profileItems}
                        itemIndex={itemIndex}
                        setItemIndex={setItemIndex} />
                </Grid>
                <Grid item md={9} xs={12}>
                    {getDisplayWidget()}
                </Grid>
            </Grid>
        </div>
    )
}

export default Profile
