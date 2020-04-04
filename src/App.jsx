import React from 'react';
import './App.css';
import { Introduction } from './components/introduction/Introduction'
import { useFetch } from "./hooks/useFetch";
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import { OfferList } from "./components/offer-list/OfferList";
import { Goodbye } from "./components/goodbye/Goodbye"
import { CustomerForm } from "./components/customer-form/CustomerForm";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
  } from "react-router-dom";

export const MyContext = React.createContext({});

export default function App() {
	// const options = {
	// 	method: 'GET',
	// 	// mode: "no-cors",
	// 	headers: { 
	// 		// 'content-type': 'application/json', 
	// 		'Access-Control-Allow-Origin': "*"
	// 	}
	// }
	
	const responseSupplier = useFetch("https://fecko.org/productdelivery/Supplier/detail/1", {}).response;
	if (!responseSupplier) {
	  return <Spinner animation="border" />
	}
	console.log('res', responseSupplier)
	const state = {
		supplier: {
			...responseSupplier.record
		}
	}

	return (
		<div className="App">
			<Router>
				<MyContext.Provider value={state}>
					<Switch>
						<Route path="/supplier-offer" children={<OfferList />} />
						<Route path="/customer-form" children={<CustomerForm />} />
						<Route path="/goodbye" children={<Goodbye />} />
						<Route path="/" children={<Introduction/>} />
					</Switch>
				</MyContext.Provider>
			</Router>
		</div>
	);
}
