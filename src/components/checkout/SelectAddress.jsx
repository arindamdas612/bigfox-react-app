import React, { useState, useContext } from 'react'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import { AddressContext } from '../../contexts/AdressContext'


import AddressDialog from '../profile/AddressDialog'

const SelectAddress = ({ name, value, setValue, addrs }) => {
    const { addressData, setAddressData } = useContext(AddressContext)

    const [open, setOpen] = useState(false)

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
    const address = value > -1 ?
        addressData.addresses.filter(addr => addr.id === value)[0] :
        null

    const selectedAddress = address === null ?
        <Typography color="error">
            No {name} Address Selected. Select one to proceesd checkout
        </Typography> :
        <Paper style={{ padding: 10 }}>
            <Typography color="primary">
                c/o {address.contactName}
            </Typography>
            <Typography color="primary">
                {address.line1}
            </Typography>
            <Typography color="primary">
                {address.line2}
            </Typography>
            {
                address.line3 !== '' && (
                    <Typography color="primary">
                        {address.line3}
                    </Typography>
                )
            }
            <Typography color="primary">
                {address.landmark}
            </Typography>
            <Typography color="primary">
                {address.city}, {address.state}
            </Typography>
            <Typography color="primary">
                Pin: {address.pinCode}
            </Typography>
            <Typography color="primary">
                Contact: {address.contactNumber}
            </Typography>
        </Paper>

    return (
        <>
            <Grid container direction="column">
                <Grid item>
                    <Typography variant="h5">
                        Select {name} Address
                    </Typography>
                </Grid>
                <Grid item>
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Grid item>
                            <Select
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            >
                                <MenuItem value={-1}>
                                    <em>None</em>
                                </MenuItem>
                                {[
                                    ...addressData.addresses.map((addr, idx) =>
                                        <MenuItem key={`${name}-${idx}`} value={addr.id}>
                                            {addr.name}
                                        </MenuItem>
                                    )
                                ]}
                            </Select>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={handleClickOpen}
                            >
                                Add New
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item style={{ paddingTop: 10, paddingBottom: 10 }}>
                    {selectedAddress}
                </Grid>
            </Grid>
            <AddressDialog
                open={open}
                handleClose={handleClose}
                info={null}
                handleCloseConfirm={handleCloseConfirm}
            />
        </>
    )
}

export default SelectAddress
