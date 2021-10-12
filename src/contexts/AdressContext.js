import React, { createContext, useState } from 'react'
import axios from 'axios'

const ADDR_URL = 'http://localhost:8000/api/user/address/'

export const AddressContext = createContext()

const convertFromAPI = data => ({
    id: data.id,
    name: data.name,
    type: data.type === 'Rs' ?
        'Residence' : data.type === 'Of' ?
            'Office' : 'Others',
    contactName: data.contact_name,
    contactNumber: data.contact_mobile,
    line1: data.line1,
    line2: data.line2,
    line3: data.line3,
    landmark: data.landmark,
    city: data.district,
    state: data.state,
    pinCode: data.pincode,
    created: new Date(data.created),
    modified: new Date(data.modified),
})

const convetToAPI = data => ({
    name: data.name,
    contact_name: data.contactName,
    contact_mobile: data.contactNumber,
    type: data.type === 'Residence' ?
        'Rs' : data.type === 'Office' ?
            'Of' : 'Ot',
    line1: data.line1,
    line2: data.line2,
    line3: data.line3,
    landmark: data.landmark,
    district: data.city,
    state: data.state,
    pincode: data.pinCode
})

export const AddressContextProvider = props => {
    const [addressData, setAddressData] = useState({
        fetching: false,
        addresses: [],
        fetchAddresses: async () => {
            const token = localStorage.getItem('token') || ''
            try {
                const response = await axios.get(ADDR_URL, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                })
                if (response.status === 200) {
                    const addrs = response.data.addresses.map(addr => convertFromAPI(addr))
                    return addrs
                } else {
                    return null
                }
            } catch (error) {
                console.log(error)
                return null
            }
        },
        addAddress: async (data) => {
            const token = localStorage.getItem('token') || ''
            const dataToAdd = convetToAPI(data)
            try {
                const response = await axios.post(ADDR_URL, dataToAdd, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                })

                if (response.status === 201) {
                    const newAddress = convertFromAPI(response.data.address)
                    return newAddress
                }
                return null
            } catch (error) {
                return null
            }
        },
        modifyAddress: async (id, data) => {
            const token = localStorage.getItem('token') || ''
            const dataToPost = {
                id: id,
                data_to_update: { ...data }
            }
            try {
                const response = await axios.put(ADDR_URL, dataToPost, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                })

                if (response.status === 202) {
                    const updatedAddress = convertFromAPI(response.data.address_data)
                    return updatedAddress
                }
                return null
            } catch (error) {
                return null
            }
        },
        deleteAddress: async (id) => {
            const token = localStorage.getItem('token') || ''
            try {
                const response = await axios.delete(ADDR_URL, {
                    headers: {
                        Authorization: `Token ${token}`
                    },
                    data: {
                        id: id,
                    }
                })
                if (response.status === 200) return true
                return false
            } catch (error) {
                return false
            }
        }
    })
    return (
        <AddressContext.Provider value={{ addressData, setAddressData }}>
            {props.children}
        </AddressContext.Provider>
    )
}