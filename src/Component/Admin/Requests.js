import { Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React from 'react'
import axiosInstance from '../../library/axios';
import { AuthenticatedAppBar } from '../layout/CustomAppBar';
import CustomBottomBar from '../layout/CustomBottomBar';
import CustomDrawer, { adminMenu } from '../layout/CustomDrawer';

function Requests() {
    const [requests, setRequests] = React.useState([])
    const [pageSize, setPageSize] = React.useState(10);
    const [requestToComplete, setRequestToComplete] = React.useState(null);
    const getRequests = React.useCallback(async() => {
        const {data} = await axiosInstance.get(`/requests`)
        console.log(data)
        setRequests(data.requests)
    }, [])
    React.useEffect(() => {
        getRequests()
    }, [getRequests])
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mb: 10 }}>
                <Toolbar />
                <Typography variant="h6">Document Requests</Typography>
                <Grid container spacing={2} sx={{mt: 2}}>
                    <Grid item xs={12}>
                        <TagAsComplete open={Boolean(requestToComplete)} 
                            onClose={() => setRequestToComplete(null)}
                            onChange={getRequests}
                            id={requestToComplete}
                        />
                    {requests && (
                        <DataGrid rows={requests} 
                            autoHeight 
                            rowHeight={35}
                            getRowId={(row) => row._id}
                            onRowClick={({row}) => setRequestToComplete(row._id)}
                            components={{
                                Toolbar: GridToolbar,
                            }}
                            columns={[
                                { 
                                    field: 'fullName', 
                                    headerName: 'Student',
                                    minWidth: 250,
                                    renderCell: cell => {
                                        return (
                                            <Typography variant="body2" color="black" >{cell.value}</Typography>
                                        )
                                    }
                                },
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
                                    minWidth: 200,
                                    renderCell: cell => {
                                        return (
                                            <Typography variant="body2" color="black" >{cell.value}</Typography>
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

const TagAsComplete = ({open, onClose, onChange, id}) => {
    const handleComplete = async () => {
        const {data} = await axiosInstance.put(`/requests/${id}`)
        console.log(data)
        onChange()
        onClose()
    }
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Tag as Completed?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to tag this request as completed?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="primary" onClick={onClose} size="small">Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleComplete} size="small">Confirm</Button>
            </DialogActions>
        </Dialog>
    )
}

export default Requests
