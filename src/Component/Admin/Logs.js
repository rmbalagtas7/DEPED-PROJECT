import { CssBaseline, Grid, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import React from 'react'
import axiosInstance from '../../library/axios'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomBottomBar from '../layout/CustomBottomBar'
import CustomDrawer, { adminMenu } from '../layout/CustomDrawer'
import { formatISO } from 'date-fns';

function Logs() {
    const [logs, setLogs] = React.useState([])
    const [pageSize, setPageSize] = React.useState(10);

    const getLogs = React.useCallback(async() => {
        const {data} = await axiosInstance.get(`/logs`)
        console.log(data)
        setLogs(data.logs)
    }, [])
    React.useEffect(() => {
        getLogs()
    }, [getLogs])
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mb: 10 }}>
                <Toolbar />
                <Typography variant="h6">Activity Logs</Typography>
                <Grid container spacing={2} sx={{mt: 2}}>
                    <Grid item xs={12}>
                    {logs && (
                        <DataGrid rows={logs} 
                            autoHeight 
                            rowHeight={35}
                            getRowId={(row) => row._id}
                            components={{
                                Toolbar: GridToolbar,
                            }}
                            columns={[
                                { 
                                    field: 'fullName', 
                                    headerName: 'User',
                                    minWidth: 250,
                                    renderCell: cell => {
                                        return (
                                            <Typography variant="body2" color="black" >{cell.value}</Typography>
                                        )
                                    }
                                },
                                { 
                                    field: 'action', 
                                    headerName: 'Action',
                                    minWidth: 250,
                                    renderCell: cell => {
                                        return (
                                            <Typography variant="body2" color="black" >{cell.value}</Typography>
                                        )
                                    }
                                },
                                { 
                                    field: 'record_type', 
                                    headerName: 'Record Type',
                                    minWidth: 200,
                                    renderCell: cell => {
                                        return (
                                            <Typography variant="body2" color="black" >{cell.value}</Typography>
                                        )
                                    }
                                },
                                { 
                                    field: 'record_id', 
                                    headerName: 'Record',
                                    minWidth: 250,
                                    renderCell: cell => {
                                        return (
                                            <Typography variant="body2" color="black" >{cell.value}</Typography>
                                        )
                                    }
                                },
                                { 
                                    field: 'date_created', 
                                    headerName: 'Date',
                                    type: 'date',
                                    valueFormatter: (params) => {
                                      // first converts to JS Date, then to locale option through date-fns
                                      return formatISO(new Date(params.value), { representation: 'date' } );
                                    },
                                    // valueGetter for filtering
                                    valueGetter: (params) => {
                                      return formatISO(new Date(params.value), { representation: 'date' } );
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

export default Logs
