import { AccountBalance, AccountCircle, Book, Campaign, Description, DescriptionOutlined, Event, History, Home, ListAlt, PermIdentity, Person, Poll, Settings, SupervisedUserCircle} from '@mui/icons-material';
import { Avatar, Divider, Drawer, IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system';
import SchoolIcon from '@mui/icons-material/School';
import React from 'react'
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
const drawerWidth = 300;

export const superadminMenu = [
    {
        name: 'Home', 
        icon: <Home />,
        link: '/control-panel'
    },
    {
        name: 'User Accounts', 
        icon: <AccountCircle />,
        link: '/control-panel/users'
    },
    {
        name: 'Schools', 
        icon: <SchoolIcon />,
        link: '/control-panel/schools'
    },
]

export const facultyMenu = [
    {
        name: 'Home', 
        icon: <Home />,
        link: '/faculty'
    },
    {
        name: 'My Classes', 
        icon: <Book />,
        link: '/faculty/classes'
    },
    {
        name: 'Forms', 
        icon: <ListAlt />,
        link: '/faculty/forms'
    },
]
export const studentMenu = [
    {
        name: 'Home', 
        icon: <Home />,
        link: '/student'
    },
    {
        name: 'My Classes', 
        icon: <Book />,
        link: '/student/classes'
    },
    {
        name: 'Document Request', 
        icon: <DescriptionOutlined />,
        link: '/student/forms'
    },
    {
        name: 'Profile', 
        icon: <PermIdentity/>,
        link: '/student/profile'
    },
]
export const adminMenu = [
    {
        name: 'Home', 
        icon: <Home />,
        link: '/admin'
    },
    {
        name: 'My School', 
        icon: <AccountBalance />,
        link: '/admin/school'
    },
    {
        name: 'Faculty', 
        icon: <SupervisedUserCircle />,
        link: '/admin/faculty'
    },
    {
        name: 'Students', 
        icon: <Person />,
        link: '/admin/students'
    },
    {
        name: 'Forms', 
        icon: <Description />,
        link: '/admin/forms'
    },
    {
        name: 'Classes', 
        icon: <ListAlt />,
        link: '/admin/classes'
    },
    {
        name: 'Announcements', 
        icon: <Campaign />,
        link: '/admin/announcements'
    },
    {
        name: 'Activity Logs', 
        icon: <History />,
        link: '/admin/logs'
    },
    {
        name: 'Document Requests',
        icon: <DescriptionOutlined />,
        link: '/admin/requests'
    },
]

function CustomDrawer() {
    const user = JSON.parse(sessionStorage.getItem('user'))
    const {push} = useHistory()
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                zIndex: 0, 
                display: { xs: 'none', md: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
        >
        <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
            <Divider />
            <List>
                {user.access_level === 4096 && superadminMenu.map((item, index) => (
                    <ListMenuItem item={item} callback={() => push(item.link)} key={index}/>
                ))}
                {user.access_level === 3 && studentMenu.map((item, index) => (
                    <ListMenuItem item={item} callback={() => push(item.link)} key={index}/>
                ))}
                {user.access_level === 2 && facultyMenu.map((item, index) => (
                    <ListMenuItem item={item} callback={() => push(item.link)} key={index}/>
                ))}
                {user.access_level === 2048 && adminMenu.map((item, index) => (
                    <ListMenuItem item={item} callback={() => push(item.link)} key={index}/>
                ))}
                {/* Change Link to google forms link  */}
                {user.access_level === 3 && (
                    <ListItem button component="a" href="https://forms.gle/9S8uyBKxgG1WLebf6" target="_blank">
                        <ListItemIcon>
                            <Poll />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">Survey Form</Typography>} />
                    </ListItem>
                )}
                {user.access_level !== 3 && (
                    <ListItem button component="a" href="https://calendar.google.com/" target="_blank">
                        <ListItemIcon>
                            <Event />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">Calendar</Typography>} />
                    </ListItem>
                )}
                {/* Change Link to Form Spreadsheet */}
                {user.access_level === 2048 && (
                    <ListItem button component="a" href="https://docs.google.com/spreadsheets/d/1d9EOO4sk-B-D-Iz6G72w7M3ohyX5GXNrkcnzJAF1IAM/edit" target="_blank">
                        <ListItemIcon>
                            <Poll />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">Survey Form Results</Typography>} />
                    </ListItem>
                )}
                <div style={{position: 'fixed', bottom: 0, width: drawerWidth}}>
                    <Divider />
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar src="/test.jpg"/>
                        </ListItemAvatar>
                        <ListItemText primary={<Typography variant="subtitle2">{user.firstName} {user.lastName}</Typography>} 
                        secondary={<Typography variant="caption" color="textSecondary">{user.email}</Typography>} />
                    </ListItem>
                </div>
            </List>
            </Box>
        </Drawer>
    )
}

const ListMenuItem = ({item, callback}) => {
    return (
        <ListItem button onClick={callback}>
            <ListItemIcon>
            {item.icon}
            </ListItemIcon>
            <ListItemText primary={<Typography variant="subtitle2">{item.name}</Typography>} />
        </ListItem>
    )
}
export default CustomDrawer
