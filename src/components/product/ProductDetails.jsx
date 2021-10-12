import React, { useState } from 'react'

import Tabs from '@material-ui/core/Tabs'
import Box from '@material-ui/core/Box'
import Tab from '@material-ui/core/Tab'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`description-tabpanel-${index}`}
            aria-labelledby={`description-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const ProductDetails = ({ selectedProduct }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                <Tab label="Description" />
                <Tab label="Size & fit" />
            </Tabs>
            <TabPanel value={value} index={0}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography variant="subtitle1" align="justify">
                            {selectedProduct.description}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography variant="caption" gutterBottom>
                            SKU: {selectedProduct.sku}
                        </Typography>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    spacing={3}
                >
                    <Grid item>
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="flex-end"
                        >
                            {[
                                ...selectedProduct.attribute.map((attr, index) => (
                                    <Grid item key={`name-${index}`}>
                                        <Typography variant="body2">
                                            {attr.name}
                                        </Typography>
                                    </Grid>
                                ))
                            ]}
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="flex-start"
                        >
                            {[
                                ...selectedProduct.attribute.map((attr, index) => (
                                    <Grid item key={`value-${index}`}>
                                        <Typography variant="body2">
                                            {attr.value}
                                        </Typography>
                                    </Grid>
                                ))
                            ]}
                        </Grid>
                    </Grid>

                </Grid>
            </TabPanel>
        </>
    )
}

export default ProductDetails
