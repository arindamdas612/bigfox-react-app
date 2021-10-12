import React, { useState } from 'react'

import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'


import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    subNested: {
        paddingLeft: theme.spacing(8),
    },
}));

const CategoryMenu = ({ data, parent, setDrawerOpen }) => {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const handleOpen = (e) => setOpen(!open)
    return (
        <>
            <ListItem button onClick={handleOpen} className={classes.nested}>
                <ListItemText
                    primary={data.name}
                />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        [
                            ...data.subCategories.map((scat, index) => (
                                <div key={`${parent}-${data.name}-${scat}-${index}`}>
                                    <ListItem
                                        className={classes.subNested}
                                        button
                                        onClick={setDrawerOpen}
                                        component={Link}
                                        to={
                                            scat.includes("All ") ?
                                                `/shop/category/${data.subCategoryslugs[data.subCategories.indexOf(scat)]}` :
                                                `/shop/sub-category/${data.subCategoryslugs[data.subCategories.indexOf(scat)]}`
                                        }
                                    >
                                        <ListItemText
                                            primary={scat}
                                        />
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))
                        ]
                    }
                </List>
            </Collapse>
            <Divider />
        </>
    )
}

export default CategoryMenu
