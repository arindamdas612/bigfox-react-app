import axios from 'axios'


export const getStateCity = async pin => {
    try {
        const requestUrl = `https://api.postalpincode.in/pincode/${pin}`
        const response = await axios.get(requestUrl)
        if (response.status === 200) {
            const data = response.data[0]
            const totalRecords = parseInt(data.Message.split(':')[1])
            if (totalRecords > 0) {
                const pinDetails = data.PostOffice[0]
                return {
                    state: pinDetails.State,
                    city: pinDetails.District
                }
            }
            return null
        }
        return null
    } catch (error) {
        return null
    }
}