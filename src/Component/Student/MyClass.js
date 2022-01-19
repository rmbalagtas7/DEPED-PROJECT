import { Button, CssBaseline, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { formatDistanceToNowStrict } from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import axiosInstance from '../../library/axios'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomBottomBar from '../layout/CustomBottomBar'
import CustomDrawer, { studentMenu } from '../layout/CustomDrawer'
import { formatBytes } from '../utils/functions'

function MyClass() {
    const {id} = useParams()
    const [currentClass, setCurrentClass] = useState(null)
    const [modules, setModules] = useState([])
    const [pageSize, setPageSize] = useState(10)
    const getCurrentClass = useCallback(async() => {
        const {data} = await axiosInstance.get(`/classes/${id}`)
        console.log(data)
        setCurrentClass(data.class)
        const {data: mods} = await axiosInstance.get(`/modules?class=${id}`)
        console.log(mods)
        setModules(mods.modules)
    },[id])

    useEffect(() => {
        getCurrentClass()
    },[getCurrentClass])
    const base64toBlob = (data) => {
        // Cut the prefix `data:application/pdf;base64` from the raw base 64
        const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);
    
        const bytes = atob(base64WithoutPrefix);
        let length = bytes.length;
        let out = new Uint8Array(length);
    
        while (length--) {
            out[length] = bytes.charCodeAt(length);
        }
    
        return new Blob([out], { type: 'application/pdf' });
    };
    const handleDownload = async (path) => {
        var fileExt = path.split('.').pop();
        if (fileExt === 'pdf') {
            const {data} = await axiosInstance.get(`/modules/stream?path=${path}`)
            const fileURL = window.URL.createObjectURL(base64toBlob(data.file));
            return window.open(fileURL)
        } 
        const res = await axiosInstance.get(`/modules/download?path=${path}`)
        window.open(res.data.link, '_blank' )
    }
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography variant="h6">{currentClass?.className}</Typography>
                <Typography variant="caption" color="GrayText">
                    Mr./Ms. {currentClass?.teacher.firstName} {currentClass?.teacher.lastName} / {currentClass?.start_time} - {currentClass?.end_time}
                </Typography>
                <Typography variant="subtitle2" sx={{mt: 3, mb:1}}>Modules in this Class</Typography>
                {modules && (
                    <DataGrid rows={modules} 
                        autoHeight 
                        rowHeight={35}
                        disableSelectionOnClick
                        getRowId={(row) => row._id}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        columns={[
                            { 
                                field: 'title', 
                                headerName: 'Title',
                                minWidth: 150,
                                renderCell: cell => {
                                    return (
                                        <Typography variant="body2" color="black" >{cell.value}</Typography>
                                    )
                                }
                            },
                            { 
                                field: 'originalname', 
                                headerName: 'File Name',
                                flex: 1,
                                minWidth: 300,
                                renderCell: cell => {
                                    return (
                                        <Typography variant="body2" color="black" >{cell.value}</Typography>
                                    )
                                }
                            },
                            { 
                                field: 'size', 
                                headerName: 'Size',
                                width: 100,
                                renderCell: cell => {
                                    return (
                                        <Typography variant="body2" color="black" >{formatBytes(cell.value)}</Typography>
                                    )
                                }
                            },
                            { 
                                field: 'date_created', 
                                headerName: 'Date Uploaded',
                                width: 180,
                                renderCell: cell => {
                                    return (
                                        <Typography variant="body2" color="black" >{formatDistanceToNowStrict(new Date(cell.value), { addSuffix: true })}</Typography>
                                    )
                                }
                            },
                            { 
                                field: 'location', 
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
            </Box>
            <CustomBottomBar menu={studentMenu} />
        </Box>
    )
}

export default MyClass
