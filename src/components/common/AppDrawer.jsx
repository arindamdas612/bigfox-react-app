/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react'

import { Link } from 'react-router-dom'

import WhiteLogo from '../../assets/img/white-logo.png'

import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import CircularProgress from '@material-ui/core/CircularProgress'

import { MenuCategoryContext } from '../../contexts/MenuCategoryContext'

import CenterdBox from './CenterdBox'
import ParentMenu from './NavigationMenu/ParentMenu'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'

const AppDrawer = ({ setOpen }) => {
    const { menuData, setMenuData } = useContext(MenuCategoryContext)


    const data = menuData.data

    const getMenuContent = async () => {
        if (data.length > 0) {
            return
        }
        setMenuData({
            ...menuData,
            fetching: true
        })
        const content = await menuData.fetchMenu()
        setMenuData({
            ...menuData,
            fetching: false,
            data: content === null ? [] : [...content]
        })

    }

    useEffect(() => {
        getMenuContent()
        return () => { }
    }, [])

    return (
        <div>
            <CenterdBox height="23vh">
                <img
                    src={WhiteLogo}
                    alt="BigFox logo"
                    style={{
                        objectFit: "scale-down",
                        maxWidth: '260px',
                        paddingTop: 20,
                        paddingLeft: 20
                    }} />
            </CenterdBox>
            <Divider variant="inset" />
            <List>
                <ListItem
                    button
                    component={Link}
                    onClick={(e) => setOpen(false)}
                    to="/shop/product/all"
                >
                    <ListItemText primary="All Products" />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="New Arrivals" />
                </ListItem>
                <Divider />
                <ListItem button>
                    <ListItemText primary="On Sale" />
                </ListItem>
                <Divider />
                {

                    menuData.fetching ?
                        (<CenterdBox height="20vh">
                            <CircularProgress />
                        </CenterdBox>) :
                        [
                            ...menuData.data.map((parent, index) =>
                                <ParentMenu
                                    key={`${parent.name}-${index}`}
                                    data={parent}
                                    index={index}
                                    setDrawerOpen={setOpen}
                                />
                            )
                        ]
                }
            </List>
        </div>
    )
}

export default AppDrawer
