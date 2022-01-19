import { CssBaseline, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import { AuthenticatedAppBar } from '../layout/CustomAppBar';
import CustomDrawer, { facultyMenu } from '../layout/CustomDrawer';
import CustomBottomBar from '../layout/CustomBottomBar';
import { fetchFromStorage } from '../../library/utilities/Storage';
import axiosInstance from '../../library/axios';
import { SupervisedUserCircle } from '@mui/icons-material';
import { useHistory } from 'react-router';

function Notifications() {
    const user = fetchFromStorage('user')
    const {push} = useHistory()
    const [notifications, setNotifications] = React.useState([])
    const getNotifications = React.useCallback(async() => {
        const {data} = await axiosInstance.get(`/notifications?user=${user._id}`)
        console.log(data)
        setNotifications(data.notifications)
    }, [user._id])
    const handleRead = async (id) => {
        const {data} = await axiosInstance.put(`/notifications/${id}`)
        console.log(data)
        getNotifications()
    }

    useEffect(() => {
        getNotifications()
    }, [getNotifications])
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography variant="h6">Notifications</Typography>
                <List>
                    {notifications?.map((notification) => (
                        <ListItem button dense style={{background: notification.read ? '#fff' : '#cbeef3'}}
                            onClick={() => {
                                    handleRead(notification._id)
                                    if(notification.link){
                                        push(notification.link)
                                    }
                                }}   
                        >
                            <ListItemIcon><SupervisedUserCircle fontSize="large"/></ListItemIcon>
                            <ListItemText 
                                primary={
                                    <Typography variant="subtitle2" style={{fontWeight: notification.read ? 'normal' :'bold'}}>{notification.sender}</Typography>
                                } 
                                secondary={
                                    <Typography variant="caption" color="GrayText">{notification.message}</Typography>
                                } 
                                />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <CustomBottomBar menu={facultyMenu} />
        </Box>
    )
}

export default Notifications
