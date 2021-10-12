import React from 'react'

import Box from '@material-ui/core/Box'

const CenterdBox = ({ children, height }) => {
    return (
        <Box
            style={{ height: height }}
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            {children}
        </Box>
    )
}

export default CenterdBox
