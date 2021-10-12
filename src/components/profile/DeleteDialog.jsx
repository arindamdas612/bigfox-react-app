import React from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Button, Typography } from '@material-ui/core'

const DeleteDialog = ({ open, handleClose, handleCloseConfirm }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                {
                    "Delete Address"
                }
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure, you want to delete this address?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" size="small" variant="outlined">
                    <Typography>
                        No
                    </Typography>
                </Button>
                <Button onClick={handleCloseConfirm} color="secondary" size="small" variant="outlined">
                    <Typography color="error">
                        Yes
                    </Typography>
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteDialog
