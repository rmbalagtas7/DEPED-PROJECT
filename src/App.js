import { createTheme, ThemeProvider } from '@mui/material';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import { LandingPage } from './Component/LandingPage';
import { PageNotFound } from './Component/PageNotFound';
import Teacher from './Component/Teacher';
import TeacherDashboard from './Component/Teacher/Dashboard';
import StudentDashboard from './Component/Student/Dashboard';
import StudentProfile from './Component/Student/Profile';
import SuperAdminDashboard from './Component/SuperAdmin/Dashboard';
import AdminDashboard from './Component/Admin/Dashboard';
import AdminSchool from './Component/Admin/School';
import AdminStudents from './Component/Admin/Students';
import AdminStudent from './Component/Admin/Student';
import AdminFaculty from './Component/Admin/Faculty';
import Schedules from './Component/Admin/Schedules';
import ClassPerGrade from './Component/Admin/ClassPerGrade';
import { AppRoute, StudentRoute, TeacherRoute, SuperAdminRoute, AdminRoute } from './library/routes';
import Users from './Component/SuperAdmin/Users';
import User from './Component/SuperAdmin/User';
import Schools from './Component/SuperAdmin/Schools';
import School from './Component/SuperAdmin/School';
import ChangePassword from './Component/ChangePassword';
import ClassPerSection from './Component/Admin/ClassPerSection';
import ClassListOfStudents from './Component/Admin/ClassListOfStudents';
import Announcements from './Component/Admin/Announcements';
import AdminForms from './Component/Admin/Forms';
import Classes from './Component/Student/Classes';
import FacultyClasses from './Component/Teacher/Classes';
import MyClasses from './Component/Teacher/MyClasses';
import TeacherSchoolForms from './Component/Teacher/Forms';
import Forms from './Component/Student/Forms';
import MyClass from './Component/Student/MyClass';
import Notifications from './Component/Teacher/Notifications';
import FacultyAnnouncements from './Component/Teacher/Announcements';

import Logs from './Component/Admin/Logs';
import Requests from './Component/Admin/Requests';
import ForgotPassword from './Component/ForgotPassword';

const theme = createTheme({
  typography: {
    fontFamily: [
			"Poppins",
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Roboto",
			'"Helvetica Neue"',
			"Arial",
			"sans-serif",
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(","),
  }
})

function App() {
  return (
    <div>
      <Router>
        <ThemeProvider theme={theme}>
            <Switch>

              <AppRoute exact path="/" component={() => <LandingPage type="login" />} />
              <AppRoute exact path="/register" component={() => <LandingPage type="register" />} />
              <AppRoute exact path="/forgot-password" component={ForgotPassword} />
              <AppRoute exact path="/changepassword" component={ChangePassword} />

              <TeacherRoute exact path="/teacher" component={Teacher} />
              <TeacherRoute exact path="/faculty" component={TeacherDashboard} />
              <TeacherRoute exact path="/faculty-classes/:id" component={FacultyClasses} />
              <TeacherRoute exact path="/faculty/classes" component={MyClasses} />
              <TeacherRoute exact path="/faculty/forms" component={TeacherSchoolForms} />
              <TeacherRoute exact path="/faculty/notifications" component={Notifications} />
              <TeacherRoute exact path="/faculty/announcements" component={FacultyAnnouncements} />

              <StudentRoute exact path="/student" component={StudentDashboard} />
              <StudentRoute exact path="/student/profile" component={StudentProfile} />
              <StudentRoute exact path="/student/classes" component={Classes} />
              <StudentRoute exact path="/student/forms" component={Forms} />
              <StudentRoute exact path="/student/notifications" component={Notifications} />
              <StudentRoute exact path="/myclass/:id" component={MyClass} />
              
              <AdminRoute exact path="/admin" component={AdminDashboard} />
              <AdminRoute exact path="/admin/school" component={AdminSchool} />
              <AdminRoute exact path="/admin/students" component={AdminStudents} />
              <AdminRoute exact path="/admin/faculty" component={AdminFaculty} />
              <AdminRoute exact path="/admin/classes" component={Schedules} />
              <AdminRoute exact path="/admin/grade" component={ClassPerGrade} />
              <AdminRoute exact path="/admin/section" component={ClassPerSection} />
              <AdminRoute exact path="/admin/notifications" component={Notifications} />
              <AdminRoute exact path="/student/:id" component={AdminStudent} />
              <AdminRoute exact path="/class/:id" component={ClassListOfStudents} />
              <AdminRoute exact path="/admin/announcements" component={Announcements} />
              <AdminRoute exact path="/admin/forms" component={AdminForms} />
              <AdminRoute exact path="/admin/logs" component={Logs} />
              <AdminRoute exact path="/admin/requests" component={Requests} />
              
              <SuperAdminRoute exact path="/control-panel" component={SuperAdminDashboard} />
              <SuperAdminRoute exact path="/control-panel/users" component={Users} />
              <SuperAdminRoute exact path="/control-panel/schools" component={Schools} />
              <SuperAdminRoute exact path="/user/:id" component={User} />
              <SuperAdminRoute exact path="/school/:id" component={School} />

              <Route exact path="/change-password" component={ChangePassword} />
              
              <Route path="*" component={PageNotFound} />
            </Switch>
          </ThemeProvider>
      </Router>
    </div>
  );
}


export default App;
