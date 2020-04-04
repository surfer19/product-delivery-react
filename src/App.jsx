import React from 'react';
import './App.css';
import { Introduction } from './components/introduction/introduction'
import { useFetch } from "./hooks/useFetch";
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';

export const MyContext = React.createContext({});

export default function App() {
	const responseSupplier = useFetch("http://hackathon.gorazd.sk/php-crud-api-master/api.php/records/Supplier/1", {}).response;
	if (!responseSupplier) {
	  return <Spinner animation="border" />
	}
	console.log('res', responseSupplier)

	const state = {
		supplier: {
			...responseSupplier
		}
	}

	return (
		<div className="App">
			<MyContext.Provider value={state}>
				<Introduction />
			</MyContext.Provider>
		</div>
	);
}
