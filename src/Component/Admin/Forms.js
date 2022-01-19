import { CssBaseline, Toolbar, Typography, Grid, Button } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import React, { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../../library/axios'
import { fetchFromStorage } from '../../library/utilities/Storage'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomBottomBar from '../layout/CustomBottomBar'
import CustomDrawer, { adminMenu } from '../layout/CustomDrawer'
import { formatBytes } from '../utils/functions'

function Forms() {
    const {school} = fetchFromStorage('user')
    const [pageSize, setPageSize] = React.useState(10);
    const [forms, setForms] = useState([])

    const getForms = useCallback(async() => {
        const {data} = await axiosInstance.get(`/forms/admin/${school}`)
        console.log(data)
        setForms(data.forms)
    }, [school])
    useEffect(() => {
        getForms()
    }, [getForms])
    const handleDownload = async (path) => {
        const {data} = await axiosInstance.get(`/modules/download?path=${path}`)
        console.log(data.link)
        window.open(data.link, '_blank')
    }
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mb: 10 }}>
                <Toolbar />
                <Typography variant="h6">School Forms</Typography>
                <Grid container spacing={2} sx={{mt: 2}}>
                    <Grid item xs={12}>
                    {forms && (
                    <DataGrid rows={forms} 
                        autoHeight 
                        rowHeight={35}
                        getRowId={(row) => row._id}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        columns={[
                            { 
                                field: 'type', 
                                headerName: 'Form Type',
                                minWidth: 250,
                                renderCell: cell => {
                                    return (
                                        <Typography variant="body2" color="black" >{cell.value}</Typography>
                                    )
                                }
                            },
                            { 
                                field: 'original_name', 
                                headerName: 'File',
                                minWidth: 250,
                                renderCell: cell => {
                                    return (
                                        <Typography variant="body2" color="black" >{cell.value}</Typography>
                                    )
                                }
                            },
                            { 
                                field: 'title', 
                                headerName: 'Title',
                                minWidth: 200,
                                renderCell: cell => {
                                    return (
                                        <Typography variant="body2" color="black" >{cell.value}</Typography>
                                    )
                                }
                            },
                            { 
                                field: 'size', 
                                headerName: 'Size',
                                minWidth: 50,
                                renderCell: cell => {
                                    return (
                                        <Typography variant="body2" color="black" >{formatBytes(cell.value)}</Typography>
                                    )
                                }
                            },
                            { 
                                field: 'owner_name', 
                                headerName: 'Owner',
                                minWidth: 200,
                                renderCell: cell => {
                                    return (
                                        <Typography variant="body2" color="black" >{cell.value}</Typography>
                                    )
                                }
                            },
                            { 
                                field: 'file', 
                                headerName: 'Action',
                                minWidth: 250,
                                renderCell: cell => {
                                    return (
                                        <Button size="small" variant="contained" onClick={() => handleDownload(cell.value)}>Download</Button>
                                    )
                                }
                            },
                        ]}
                        rowsPerPageOptions={[5, 10, 20]}
                        pagination
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    />
                )}
                    </Grid>
                </Grid>
            </Box>
            <CustomBottomBar menu={adminMenu} />
        </Box>
    )
}

export default Forms
