import React, { createContext, useState } from 'react'

const CategoryContext = createContext()

const CategoryContextProvidrer = props => {
    const [categoryData, setCategoryData] = useState({
        fetching: false,
        products: []
    })
    return (
        <CategoryContext.Provider
            value={{ categoryData, setCategoryData }}
        >
            {props.children}
        </CategoryContext.Provider>
    )
}

export default CategoryContextProvidrer
