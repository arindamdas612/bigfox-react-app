import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'

import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import CategoryMenu from './CategoryMenu'

const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

const ParentMenu = ({ data, setDrawerOpen }) => {
    const classes = useStyles()
    const [open, setOpen] = useState(false)

    const handleOpen = (e) => setOpen(!open)
    return (
        <>
            <ListItem button onClick={handleOpen}>
                <ListItemText
                    primary={data.name}
                />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        [
                            ...data.categories.map((category, index) => (
                                <CategoryMenu
                                    className={classes.nested}
                                    key={`${data.name}-${category.name}-${index}`}
                                    parent={data.name}
                                    data={category}
                                    setDrawerOpen={() => setDrawerOpen(false)} />
                            ))
                        ]
                    }
                </List>
            </Collapse>
            <Divider />
        </>
    )
}

export default ParentMenu
