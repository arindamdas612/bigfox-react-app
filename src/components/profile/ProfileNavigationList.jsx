import React from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'

const ProfileNavigationList = ({ profileItems, itemIndex, setItemIndex }) => {
    return (
        <List>
            {
                [
                    ...profileItems.map((item, index) => (
                        <div key={index}>
                            {
                                index === 0 && <Divider />
                            }
                            <ListItem
                                button
                                onClick={(e) => setItemIndex(index)}
                                selected={index === itemIndex}
                            >
                                <ListItemText primary={item} />
                                <KeyboardArrowRightIcon />
                            </ListItem>
                            <Divider />
                        </div>
                    ))
                ]
            }
        </List>
    )
}

export default ProfileNavigationList
