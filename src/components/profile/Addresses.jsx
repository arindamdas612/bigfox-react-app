/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

import AddressCard from './AddressCard'
import CenterdBox from '../common/CenterdBox'
import AddressDialog from './AddressDialog'

import { AddressContext } from '../../contexts/AdressContext'

const Addresses = () => {
    const { addressData, setAddressData } = useContext(AddressContext)
    const [open, setOpen] = useState(false)

    const getAddress = async () => {
        setAddressData({
            ...addressData,
            fetching: true
        })
        const result = await addressData.fetchAddresses()
        setAddressData({
            ...addressData,
            fetching: false,
            addresses: result !== null ? [...result] : []
        })
    }

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleCloseConfirm = async data => {
        setAddressData({
            ...addressData,
            fetching: true
        })
        const result = await addressData.addAddress(data)
        setAddressData({
            ...addressData,
            fetching: false,
            addresses: result !== null ?
                [...addressData.addresses, { ...result }] :
                [...addressData.addresses]
        })
        handleClose()
    }

    useEffect(() => {
        getAddress()
        return () => { }
    }, [])

    return (
        <div>
            <Grid container alignItems="center" justifyContent="center" spacing={2}>
                {
                    addressData.fetching ?
                        <CenterdBox height="40vh">
                            <CircularProgress />
                        </CenterdBox> :
                        <>
                            {
                                addressData.addresses.length === 0 ?
                                    <Grid item>
                                        <CenterdBox height="40vh">
                                            <Typography variant="h6">
                                                No Address to display, add one
                                            </Typography>
                                        </CenterdBox>

                                    </Grid> :
                                    [
                                        ...addressData.addresses.map(addr => (
                                            <Grid item key={addr.id}>
                                                <AddressCard address={addr} getAddress={getAddress} />
                                            </Grid>
                                        ))
                                    ]
                            }
                            <Grid item sm={12} xs={12} md={12} lg={12}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleClickOpen}>
                                    Add New Address
                                </Button>
                            </Grid>
                        </>
                }
            </Grid>
            <AddressDialog
                open={open}
                handleClose={handleClose}
                info={null}
                handleCloseConfirm={handleCloseConfirm} />
        </div>
    )
}

export default Addresses
