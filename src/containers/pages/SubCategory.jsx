import React, { useEffect, useState } from 'react'

import axios from 'axios'

import { useLocation } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

import CenterdBox from '../../components/common/CenterdBox'
import ProductCard from '../../components/product/ProductCard'
import ProductFilterPane from '../../components/product/ProductFilterPane'

const SubCategory = () => {
    const { pathname } = useLocation()

    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([])

    const subCategorySlug = pathname.split('/')[pathname.split('/').length - 1]

    const fetchSubCategoryDetails = async (slug) => {
        const fetchURL = `http://127.0.0.1:8000/api/shop/sub-category/${slug}`
        setLoading(true)
        try {
            const response = await axios.get(fetchURL)
            if (response.status === 200) {
                setProducts([...response.data])
                setLoading(false)
            } else
                setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubCategoryDetails(subCategorySlug)
        return () => { }
    }, [subCategorySlug])
    return loading ?

        (
            <CenterdBox height="50vh">
                <CircularProgress size={200} />
            </CenterdBox>
        ) :
        (
            <Grid container spacing={2}>
                <Grid item sm={3} xs={12}>
                    <ProductFilterPane />
                </Grid>
                <Grid item sm={9} xs={12}>
                    <Grid container direction="column">
                        <Grid item>
                            <Typography variant="h6">
                                {
                                    products.length > 0 ?
                                        `${products[0].details[0].category_name}` :
                                        subCategorySlug
                                }
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Grid
                                container
                                spacing={3}
                                justifyContent="center"
                                alignItems="center"
                            >
                                {
                                    [
                                        ...products.map((prd, index) => (
                                            <Grid item key={index}>
                                                <ProductCard product={prd} />
                                            </Grid>

                                        ))
                                    ]
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        )
}

export default SubCategory
