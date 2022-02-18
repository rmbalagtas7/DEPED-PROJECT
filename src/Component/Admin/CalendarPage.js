import React, { useState } from 'react'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import * as dates from '../utils/dates'
import { Box } from '@mui/system'
import { Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Toolbar, Typography } from '@mui/material'
import { AuthenticatedAppBar } from '../layout/CustomAppBar'
import CustomDrawer from '../layout/CustomDrawer'
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateTimePicker from '@mui/lab/DateTimePicker';

let allViews = Object.keys(Views).map(k => Views[k])

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
  })

function CalendarPage() {
    const localizer = momentLocalizer(moment)
    const [events, setEvents] = useState([])
    const [selectedDate, setSelectedDate] = useState(null)
    const createEvent = (event) => {
        setSelectedDate({
            title: '', 
            start: event.start, 
            end: event.end
        })
    }
    const saveEvent = () => {
        console.log(selectedDate)
        setEvents([...events, selectedDate])
        setSelectedDate(null)
    }
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AuthenticatedAppBar />
            <CustomDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mb: 10 }}>
                <Toolbar />
                <Typography variant="h4">Calendar</Typography>
                <div style={{height: 700}}>
                    <Calendar
                        selectable
                        events={events}
                        views={allViews}
                        step={60}
                        showMultiDayTimes
                        max={dates.add(dates.endOf(new Date(2015, 17, 1), 'day'), -1, 'hours')}
                        defaultDate={new Date()}
                        components={{
                            timeSlotWrapper: ColoredDateCellWrapper,
                        }}
                        localizer={localizer}
                        onSelectEvent={event => setSelectedDate(event)}
                        onSelectSlot={createEvent}
                    />
                </div>
                {selectedDate && (
                    <Dialog open={Boolean(selectedDate)} onClose={() => setSelectedDate(null)} maxWidth="sm" fullWidth>
                        <DialogTitle>Save Event</DialogTitle>
                        <DialogContent>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TextField required label="Event Name" placeholder='Event Name' value={selectedDate.title} 
                                    onChange={(e) => setSelectedDate({...selectedDate, title: e.target.value})}
                                    size="small" fullWidth sx={{mb: 3}}
                                />
                                <DateTimePicker
                                    label="Start Date&Time"
                                    value={selectedDate.start}
                                    onChange={(e) => setSelectedDate({...selectedDate, start: e})}
                                    renderInput={(params) => <TextField sx={{mb: 3}} fullWidth size="small" {...params} />}
                                    
                                />
                                <DateTimePicker
                                    label="End Date&Time"
                                    value={selectedDate.end}
                                    onChange={(e) => setSelectedDate({...selectedDate, end: e})}
                                    renderInput={(params) => <TextField sx={{mb: 3}} fullWidth size="small" {...params} />}
                                />
                            </LocalizationProvider>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="outlined" size="small" onClick={() => setSelectedDate(null)}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="primary" size="small" onClick={saveEvent}>
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        </Box>
    )
}

export default CalendarPage