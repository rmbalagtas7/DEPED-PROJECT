import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import React from 'react'
import { Link } from 'react-router-dom';

function CustomBottomBar({menu}) {
    const [value, setValue] = React.useState(0);
    return (
        <Paper 
            sx={{ 
                overflowX: 'auto', 
                position: 'fixed', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                display: { 
                    xs: 'block', 
                    md: 'none' 
                }, 
            }} elevation={3}>
            <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            >
                {
                    menu.map((el, index) => (
                        <BottomNavigationAction component={Link} to={el.link} key={index} label={el.name} icon={el.icon} />
                    ))

                }
            </BottomNavigation>
      </Paper>
    )
}

export default CustomBottomBar
