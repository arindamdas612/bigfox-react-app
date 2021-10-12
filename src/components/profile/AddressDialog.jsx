import React, { useState, useContext } from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import DialogTitle from '@material-ui/core/DialogTitle'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'


import { AuthContext } from '../../contexts/AuthContext'
import { getStateCity } from '../../helpers'

const AddressDialog = ({ open, handleClose, handleCloseConfirm, info }) => {

    const { authData } = useContext(AuthContext)

    const [selfSelected, setSelfSelected] = useState(false)
    const [fetching, setFetching] = useState(false)

    const [addrInfo, setAddrInfo] = useState({
        id: info === null ? null : info.id,
        name: info === null ? '' : info.name,
        contactName: info === null ? '' : info.contactName,
        type: info === null ? 'Residence' : info.type,
        contactNumber: info === null ? '' : info.contactNumber,
        line1: info === null ? '' : info.line1,
        line2: info === null ? '' : info.line2,
        line3: info === null ? '' : info.line3,
        landmark: info === null ? '' : info.landmark,
        city: info === null ? '' : info.city,
        state: info === null ? '' : info.state,
        pinCode: info === null ? '' : info.pinCode,
    })

    const [prevDetails, setPrevDetails] = useState({
        name: '',
        number: ''
    })

    const handleFormSubmit = (e) => {
        e.preventDefault()

        if (addrInfo.pinCode.length > 1 &&
            addrInfo.state === '' &&
            addrInfo.city === '') return

        if (
            addrInfo.contactNumber.length > 0 &&
            (
                addrInfo.contactNumber.length < 9 ||
                addrInfo.contactNumber.lenght > 15
            )
        ) return
        const { id, ...dataToUpdate } = addrInfo
        handleCloseConfirm(dataToUpdate)
    }

    const handleThisClose = () => {
        setSelfSelected(false)
        setAddrInfo({
            id: info === null ? null : info.id,
            name: info === null ? '' : info.name,
            type: info === null ? 'Residence' : info.type,
            contactName: info === null ? '' : info.contactName,
            contactNumber: info === null ? '' : info.contactNumber,
            line1: info === null ? '' : info.line1,
            line2: info === null ? '' : info.line2,
            line3: info === null ? '' : info.line3,
            landmark: info === null ? '' : info.landmark,
            city: info === null ? '' : info.city,
            state: info === null ? '' : info.state,
            pinCode: info === null ? '' : info.pinCode,
        })
        handleClose()
    }

    const handleSwitchChange = selected => {
        setSelfSelected(selected)
        if (selected)
            setPrevDetails({
                name: addrInfo.contactName,
                number: addrInfo.contactNumber,
            })
        setAddrInfo({
            ...addrInfo,
            contactName: !selected ? prevDetails.name : `${authData.userData.initial} ${authData.userData.firstname} ${authData.userData.lastname}`,
            contactNumber: !selected ? prevDetails.number : authData.userData.mobile
        })
    }

    const checkPin = async pinCode => {
        if (pinCode.length !== 6) {
            setAddrInfo({
                ...addrInfo,
                state: '',
                city: '',
                pinCode: pinCode
            })
            return null

        }
        setFetching(true)
        const result = await getStateCity(pinCode)
        setFetching(false)
        return result

    }

    const handlePinCodeChange = async (e) => {
        var state = addrInfo.state
        var city = addrInfo.city
        const pinCode = e.target.value

        setAddrInfo({
            ...addrInfo,
            pinCode: pinCode
        })

        const result = await checkPin(pinCode)
        if (result === null) return
        setAddrInfo({
            ...addrInfo,
            state: result !== null ? result.state : state,
            city: result !== null ? result.city : city,
            pinCode: pinCode
        })
    }

    return (
        <Dialog open={open} onClose={handleThisClose}>
            <DialogTitle>
                {
                    info === null ? "Add New Address" : "Edit Address"
                }
            </DialogTitle>
            <form onSubmit={handleFormSubmit}>
                <DialogContent>

                    <Grid container spacing={2} alignContent="center">
                        <Grid item lg={3} md={3} sm={6} xs={6}>
                            <Typography>
                                Self
                                <Switch color="primary" onChange={(e, value) => handleSwitchChange(value)} />
                            </Typography>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={6}>
                            <Select
                                fullWidth
                                value={addrInfo.type}
                                onChange={(e) => setAddrInfo({ ...addrInfo, type: e.target.value })}
                            >
                                <MenuItem value='Residence'>Residence</MenuItem>
                                <MenuItem value='Office'>Office</MenuItem>
                                <MenuItem value='Other'>Other</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                variant="outlined"
                                label="Name"
                                required
                                size="small"
                                margin="dense"
                                type="text"
                                value={addrInfo.name}
                                onChange={(e) => setAddrInfo({ ...addrInfo, name: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                variant="outlined"
                                label="Contact Name"
                                required
                                size="small"
                                margin="dense"
                                disabled={selfSelected}
                                value={addrInfo.contactName}
                                onChange={(e) => setAddrInfo({ ...addrInfo, contactName: e.target.value })}
                                type="text"
                                fullWidth
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                margin="dense"
                                required
                                disabled={selfSelected}
                                size="small"
                                variant="outlined"
                                label="Contact Mobile"
                                type="number"
                                error={(
                                    addrInfo.contactNumber.length > 0 &&
                                    (
                                        addrInfo.contactNumber.length < 9 ||
                                        addrInfo.contactNumber.lenght > 15
                                    )
                                )}
                                helperText={(
                                    addrInfo.contactNumber.length > 0 &&
                                    (
                                        addrInfo.contactNumber.length < 9 ||
                                        addrInfo.contactNumber.lenght > 15
                                    )
                                ) ? 'Invalid Mobile Number' : ''}
                                fullWidth
                                value={addrInfo.contactNumber}
                                onChange={(e) => setAddrInfo({ ...addrInfo, contactNumber: e.target.value })}
                            />
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <TextField
                                margin="dense"
                                required
                                size="small"
                                variant="outlined"
                                label="Address Line 1"
                                type="text"
                                fullWidth
                                value={addrInfo.line1}
                                onChange={(e) => setAddrInfo({ ...addrInfo, line1: e.target.value })}
                            />
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <TextField
                                margin="dense"
                                required
                                size="small"
                                variant="outlined"
                                label="Address Line 2"
                                type="text"
                                fullWidth
                                value={addrInfo.line2}
                                onChange={(e) => setAddrInfo({ ...addrInfo, line2: e.target.value })}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                margin="dense"
                                size="small"
                                variant="outlined"
                                label="Address Line 3"
                                type="text"
                                fullWidth
                                value={addrInfo.line3}
                                onChange={(e) => setAddrInfo({ ...addrInfo, line3: e.target.value })}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                margin="dense"
                                size="small"
                                required
                                variant="outlined"
                                label="Landmark"
                                type="text"
                                fullWidth
                                value={addrInfo.landmark}
                                onChange={(e) => setAddrInfo({ ...addrInfo, landmark: e.target.value })}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                margin="dense"
                                size="small"
                                required
                                disabled
                                variant="outlined"
                                label="City/District"
                                type="text"
                                fullWidth
                                value={addrInfo.city}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                margin="dense"
                                size="small"
                                required
                                disabled
                                variant="outlined"
                                label="State"
                                type="text"
                                fullWidth
                                value={addrInfo.state}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                margin="dense"
                                size="small"
                                required
                                variant="outlined"
                                label="Pin Code"
                                type="number"
                                max="6"
                                fullWidth
                                error={(
                                    addrInfo.pinCode.length > 1 &&
                                    addrInfo.state === '' &&
                                    addrInfo.city === '') && !fetching
                                }
                                helperText={(
                                    addrInfo.pinCode.length > 1 &&
                                    addrInfo.state === '' &&
                                    addrInfo.city === '') && !fetching ? 'Invalid Pin Code.' : ''
                                }
                                value={addrInfo.pinCode}
                                onChange={handlePinCodeChange}
                                disabled={fetching}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleThisClose} size="small" color="secondary" variant="contained">
                        Cancel
                    </Button>
                    <Button type="submit" size="small" color="primary" variant="outlined">
                        {info === null ? "Add" : "Save"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AddressDialog
