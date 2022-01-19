import { Add } from '@mui/icons-material'
import { Button, CssBaseline, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { formatDistanceToNowStrict } from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../../library/axios'
import { fetchFromStorage } from '../../library/utilities/Storage'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomBottomBar from '../layout/CustomBottomBar'
import CustomDrawer, { studentMenu } from '../layout/CustomDrawer'

function Forms() {
    const user = fetchFromStorage('user')

    const [newRequest, setNewRequest] = useState(false)

    const [requests, setRequest] = useState([])

    const [pageSize, setPageSize] = React.useState(10);

    const getRequests = useCallback(async() => {
        const {data} = await axiosInstance.get(`/requests/${user._id}`)
        console.log(data)
        setRequest(data.requests)
    },[user._id])

    useEffect(() => {
        getRequests()
    }, [getRequests])

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography variant="h6" style={{marginBottom: 20}}>My Document Requests</Typography>
                <NewRequestDialog open={newRequest} onClose={() => setNewRequest(false)} onChange={getRequests}/>
                <Button 
                    color="primary" 
                    startIcon={<Add />} 
                    style={{marginBottom: 20}}
                    onClick={() => setNewRequest(true)}
                >
                    Request a Document
                </Button>
                    {requests && (
                        <DataGrid rows={requests} 
                            autoHeight 
                            rowHeight={35}
                            getRowId={(row) => row._id}
                            components={{
                                Toolbar: GridToolbar,
                            }}
                            columns={[
                                { 
                                    field: 'document', 
                                    headerName: 'Document',
                                    minWidth: 250,
                                    renderCell: cell => {
                                        return (
                                            <Typography variant="body2" color="black" >{cell.value}</Typography>
                                        )
                                    }
                                },
                                { 
                                    field: 'status', 
                                    headerName: 'Status',
                                    minWidth: 250,
                                    renderCell: cell => {
                                        return (
                                            <Typography variant="body2" color="black" >{cell.value}</Typography>
                                        )
                                    }
                                },
                                { 
                                    field: 'date_created', 
                                    headerName: 'Date Requested',
                                    width: 180,
                                    renderCell: cell => {
                                        return (
                                            <Typography variant="body2" color="black" >{formatDistanceToNowStrict(new Date(cell.value), { addSuffix: true })}</Typography>
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

const NewRequestDialog = ({open, onClose, onChange}) =>{
    const [documentType, setDocumentType] = useState('')
    const [result, setResult] = useState(null)
    const handleSubmit = async (e) =>{
        e.preventDefault()
        if (!documentType) return 
        const {data} = await axiosInstance.post(`/requests`, {document: documentType})
        console.log(data)
        if (data.success){
            setResult('Request Submitted')
        }else{
            setResult('An error occurred try again.')
        }
        onClose()
        onChange()
    } 
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth component="form" onSubmit={handleSubmit}>
            <Snackbar
                open={Boolean(result)}
                autoHideDuration={6000}
                onClose={()=> setResult(null)}
                message={result}
            />
            <DialogTitle>New Document Request</DialogTitle>
            <DialogContent>
            <Grid container spacing={2} >
                    <Grid item xs={12}>
                        <TextField 
                            style={{marginTop: 10}}
                            required
                            fullWidth 
                            label="Document Type" 
                            size="small"
                            value={documentType}
                            onChange={({target}) => setDocumentType(target.value)} 
                            InputLabelProps={{shrink: true}}
                            name="type"
                            placeholder="e.g. Form 137, School Card"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" size="small" onClick={onClose}>Cancel</Button>
                <Button variant="contained" color="primary" size="small" type="submit" disabled={!documentType}>Send Request</Button>
            </DialogActions>
        </Dialog>
    )
}

export default Forms
