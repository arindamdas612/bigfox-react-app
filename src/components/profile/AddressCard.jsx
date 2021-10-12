import React, { useState, useContext } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'

import EditSharpIcon from '@material-ui/icons/EditSharp'
import DeleteOutlineSharpIcon from '@material-ui/icons/DeleteOutlineSharp'

import AddressDialog from './AddressDialog'
import DeleteDialog from './DeleteDialog'

import { AddressContext } from '../../contexts/AdressContext'

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
        background: theme.palette.secondary.main
    },
    pos: {
        marginBottom: 12,
    },
    avatar: {
        backgroundColor: theme.palette.primary.dark,
    },
}))

const AddressCard = ({ address, getAddress }) => {
    const classes = useStyles()

    const { addressData } = useContext(AddressContext)

    const [open, setOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const handleDeleteClickOpen = () => {
        setDeleteOpen(true)
    }
    const handleDeleteClose = () => {
        setDeleteOpen(false)
    }

    const handleDeleteConfirmClose = async () => {
        console.log(address.id)
        await addressData.deleteAddress(address.id)
        await getAddress()
        handleDeleteClose()
    }

    const updateAddress = async (data) => {
        const dataToUpdate = {}
        if (data.name !== address.name) dataToUpdate.name = data.name
        if (data.contactName !== address.contactName) dataToUpdate.contact_name = data.contactName
        if (data.contactNumber !== address.contactNumber) dataToUpdate.contact_mobile = data.contactNumber
        if (data.type !== address.type)
            dataToUpdate.type = data.type === 'Residence' ?
                'Rs' : data.type === 'Office' ?
                    'Of' :
                    'Ot'
        if (data.line1 !== address.line1) dataToUpdate.line1 = data.line1
        if (data.line2 !== address.line2) dataToUpdate.line2 = data.line2
        if (data.line3 !== address.line3) dataToUpdate.line3 = data.line3
        if (data.landmark !== address.landmark) dataToUpdate.landmark = data.landmark
        if (data.city !== address.city) dataToUpdate.district = data.city
        if (data.state !== address.state) dataToUpdate.state = data.state
        if (data.pinCode !== address.pinCode) dataToUpdate.pincode = data.pinCode

        if (Object.keys(dataToUpdate).length === 0) {
            handleClose()
            return
        }
        // setAddressData({
        //     ...addressData,
        //     fetching: true
        // })
        await addressData.modifyAddress(address.id, dataToUpdate)
        await getAddress()
        // setAddressData({
        //     ...addressData,
        //     fetching: false,
        //     addresses: result === null ?
        //         addressData.addresses :
        //         [
        //             ...addressData.addresses.map(addr => addr.id === address.id ? result : addr)
        //         ]
        // })
        handleClose()



    }

    return (
        <>
            <Card className={classes.root} variant="outlined">
                <CardHeader
                    avatar={
                        <Avatar className={classes.avatar}>
                            {address.name.substr(0, 1)}
                        </Avatar>
                    }
                    title={address.name}
                    subheader={address.type}
                    action={
                        <>
                            <IconButton aria-label="edit" onClick={handleClickOpen}>
                                <EditSharpIcon color="primary" />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={handleDeleteClickOpen}>
                                <DeleteOutlineSharpIcon color="primary" />
                            </IconButton>
                        </>
                    } />
                <CardContent>
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
                    <Typography className={classes.pos} color="primary">
                        Pin: {address.pinCode}
                    </Typography>
                    <Typography color="primary">
                        Contact: {address.contactNumber}
                    </Typography>
                </CardContent>
            </Card>
            <AddressDialog
                open={open}
                handleClose={handleClose}
                info={address}
                handleCloseConfirm={updateAddress} />
            <DeleteDialog
                open={deleteOpen}
                handleClose={handleDeleteClose}
                handleCloseConfirm={handleDeleteConfirmClose} />
        </>
    )
}

export default AddressCard
