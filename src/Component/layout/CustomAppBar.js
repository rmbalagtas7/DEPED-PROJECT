import { AccountCircle, Logout, Notifications, Settings, SupervisedUserCircle } from '@mui/icons-material'
import { AppBar, Badge, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Popover, Toolbar, Typography} from '@mui/material'
import { Box } from '@mui/system'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import axiosInstance from '../../library/axios'
import { fetchFromStorage } from '../../library/utilities/Storage'

function CustomAppBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" style = {{background: '#034F8B', height: '10vh', display: 'flex', justifyContent: "center"}}>
                <Toolbar>
                    <img src = "../depedicon.png" alt="logo" style={{height: '8vh'}}/>
                </Toolbar>
            </AppBar>
        </Box>
    )
}


export const AuthenticatedAppBar = () => {
    const user = fetchFromStorage('user')
    const {push} = useHistory()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [notificationSection, setNotificationSection] = React.useState(null);
    const [notifications, setNotifications] = React.useState([])
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleNotificationClick = (event) => {
        setNotificationSection(notificationSection ? null : event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    const logOut = () => {
        sessionStorage.clear()
        push('/')
    }

    const getNotifications = React.useCallback(async() => {
        const {data} = await axiosInstance.get(`/notifications?user=${user._id}`)
        console.log(data)
        setNotifications(data.notifications)
    }, [user._id])
    useEffect(() => {
        getNotifications()
    }, [getNotifications])

    const handleRead = async (id) => {
        const {data} = await axiosInstance.put(`/notifications/${id}`)
        console.log(data)
        getNotifications()
    }

    const allNotificationLink = (access_level) => {
        let access_level_string = ""
        switch (access_level) {
            case 2048:
                access_level_string = '/admin/notifications'
                break;
            case 4096:
                access_level_string = '/control-panel/notifications'
                break;
            case 2:
                access_level_string = '/faculty/notifications'
                break;
            default:
                access_level_string = '/student/notifications'
                break;
        }
        return access_level_string
    }
    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} style = {{background: '#034F8B', zIndex: 1}}>
            <Toolbar>
                <img src = "../depedicon.png" alt="logo" style={{height: '50px', }}/>
                <Box sx={{flexGrow: 1}} />
                <IconButton
                    size="large"
                    color="inherit"
                    onClick={handleNotificationClick}
                >
                <Badge badgeContent={notifications?.filter(a => a.read === false).length} color="error">
                    <Notifications />
                </Badge>
                </IconButton>
                <Popover 
                    open={Boolean(notificationSection)}
                    anchorEl={notificationSection}
                    onClose={handleNotificationClick}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    >
                    <List>
                        {notifications?.slice(0,4).map((notification, index) => (
                            <ListItem key={index} button dense style={{background: notification.read ? '#fff' : '#cbeef3'}}
                                onClick={() => {
                                        handleRead(notification._id)
                                        if(notification.link){
                                            push(notification.link)
                                        }
                                        setNotificationSection(null)
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
                        <Divider />
                        <ListItem button dense component={Link} to={allNotificationLink(user.access_level)} >
                            <ListItemText 
                                primary={
                                    <Typography variant="caption" color="GrayText">View all notifications</Typography>
                                } 
                            />     
                        </ListItem>

                    </List>
                </Popover>
                <IconButton color="inherit" onClick={handleClick}>
                    <AccountCircle />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuList dense sx={{width: 200}}>
                        <MenuItem onClick={() => push('/student/profile')}>
                            <ListItemIcon>
                                <AccountCircle fontSize="small" />
                            </ListItemIcon>
                            Profile
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={logOut}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Toolbar>
        </AppBar> 
    )
}
export default CustomAppBar
