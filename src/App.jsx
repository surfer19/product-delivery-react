import  React from 'react';
import './App-lobelka.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from "react-router-dom";
import { Admin } from "./components/admin/Admin";
import { ContactContextProvider } from './context';
import { LoadingWrapper } from "./components/loading-wrapper/LoadingWrapper";
import { Registration } from "./components/registration/registration";

export default function App() {
	return (
		<div className="App">
			<Router>
				<Switch>
					<Route path="/administracia/:adminId" children={<Admin/>} />
					<Route path="/register" children={<Registration/>} />
					<Route path="/:supplierIdName">
						<ContactContextProvider>
							<LoadingWrapper />
						</ContactContextProvider>
					</Route>
				</Switch>
			</Router>
		</div>
	);
}
