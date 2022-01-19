
import React from 'react'
import { Redirect, Route } from 'react-router'


export const AppRoute = ({ component: Component, ...rest}) => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    return (
        <Route
			{...rest}
			render={(props) => {
                if (!user) {
                    return (
						<Component {...props}/>
					);
                }else if (user.access_level === 3) {
					return (
                        <Redirect
							to={{
								pathname: "/student",
								state: {
									from: props.location,
								},
							}}
						/>
					);
				} else if (user.access_level === 2) {
					return (
						<Redirect
							to={{
								pathname: "/faculty",
								state: {
									from: props.location,
								},
							}}
						/>
					);
				} else if (user.access_level === 2048) {
					return (
						<Redirect
							to={{
								pathname: "/admin",
								state: {
									from: props.location,
								},
							}}
						/>
					);
				} else {
					return (
						<Redirect
							to={{
								pathname: "/control-panel",
								state: {
									from: props.location,
								},
							}}
						/>
					);
				} 
			}}
		/>
    )
}
export const StudentRoute = ({ component: Component, ...rest}) => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    return (
        <Route
			{...rest}
			render={(props) => {
				if (!user) {
					return (
						<Redirect
							to={{
								pathname: "/",
								state: {
									from: props.location,
								},
							}}
						/>	
					)
				} else if (user.access_level === 3) {
					return (
                        <Component {...props}/>
					);
				} else {
					return (
						<Redirect
							to={{
								pathname: "/",
								state: {
									from: props.location,
								},
							}}
						/>
					);
				}
			}}
		/>
    )
}
export const TeacherRoute = ({ component: Component, ...rest}) => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    return (
        <Route
			{...rest}
			render={(props) => {
				if (!user) {
					return(
						<Redirect
							to={{
								pathname: "/",
								state: {
									from: props.location,
								},
							}}
						/>	
					)
				} else if (user.access_level === 2) {
					return (
                        <Component {...props}/>
					);
				} else {
					return (
						<Redirect
							to={{
								pathname: "/",
								state: {
									from: props.location,
								},
							}}
						/>
					);
				}
			}}
		/>
    )
}
export const AdminRoute = ({ component: Component, ...rest}) => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    return (
        <Route
			{...rest}
			render={(props) => {
				if (!user) {
					return(
						<Redirect
							to={{
								pathname: "/",
								state: {
									from: props.location,
								},
							}}
						/>	
					)
				} else if (user.access_level === 2048) {
					return (
                        <Component {...props}/>
					);
				} else {
					return (
						<Redirect
							to={{
								pathname: "/",
								state: {
									from: props.location,
								},
							}}
						/>
					);
				}
			}}
		/>
    )
}
export const SuperAdminRoute = ({ component: Component, ...rest}) => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    return (
        <Route
			{...rest}
			render={(props) => {
				if (!user) {
					return(
						<Redirect
							to={{
								pathname: "/",
								state: {
									from: props.location,
								},
							}}
						/>	
					)
				} else if (user.access_level === 4096) {
					return (
                        <Component {...props}/>
					);
				} else {
					return (
						<Redirect
							to={{
								pathname: "/",
								state: {
									from: props.location,
								},
							}}
						/>
					);
				}
			}}
		/>
    )
}

