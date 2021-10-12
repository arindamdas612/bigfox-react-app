import React, { createContext, useState } from 'react'
import axios from 'axios'

const MENU_URL = 'http://127.0.0.1:8000/api/shop/menu-content/'

export const MenuCategoryContext = createContext()

export const MenuCategoryContextProvider = props => {
    const [menuData, setMenuData] = useState({
        fetching: false,
        data: [],
        fetchMenu: async () => {
            try {
                const response = await axios.get(MENU_URL)

                if (response.status === 200) {
                    return response.data
                }
                return null
            } catch (error) {
                return null
            }
        }
    })

    return (
        <MenuCategoryContext.Provider value={{ menuData, setMenuData }}>
            {props.children}
        </MenuCategoryContext.Provider>
    )
}