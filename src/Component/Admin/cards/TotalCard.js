import { Avatar, Card, CardActionArea, CardContent, Typography } from '@mui/material'
import React from 'react'

function TotalCard({color, total, title, link, icon}) {
    return (
        <CardActionArea sx={{ borderRadius: 2}}>
            <Card sx={{background: color, borderRadius: 2}} elevation={5}>
                <CardContent style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                    <Avatar variant="rounded" sx={{bgcolor: 'rgba(9,9,9,0.1)', width: 40, height: 40, marginRight: 1}}>
                        {icon}
                    </Avatar>
                    <div>
                        <Typography variant="body1" sx={{color: '#fff', fontWeight: 'bolder'}}>{total}</Typography>
                        <Typography variant="caption" sx={{color: '#fff'}}>{title}</Typography>
                    </div>
                </CardContent>
            </Card>
        </CardActionArea>
    )
}

export default TotalCard
