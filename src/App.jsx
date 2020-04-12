import  React, { useState } from 'react';
import './App.css';
import { Introduction } from './components/introduction/Introduction';
import { useFetch } from "./hooks/useFetch";
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import { OfferList } from "./components/offer-list/OfferList";
import { Goodbye } from "./components/goodbye/Goodbye"
import { CustomerForm } from "./components/customer-form/CustomerForm";
import { Admin } from "./components/admin/Admin";
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";
import { ContactContextProvider } from './context'

export const GlobalContext = React.createContext({
	addItemToBasket: (id) => {},
	removeItemToBasket: () => {}
});

export default function App() {
	// const [ad, set] = useState(false);

	const data = {
		value: 'Majko'
	}
	// Build formData object.
	let formData = new FormData();
	formData.append('Name', 'John');

	const options = {
		method: 'POST',
		body: formData,
		// headers: { 
			// 'content-type': 'application/json', 
			// 'Access-Control-Allow-Origin': "*"
		// }
	}
	// http://fecko.org/productdelivery/{table}/{action}/{id-if-needed}
	// 1. zistis si ktory supplier je prihlaseny 1
	// 2. vytvor kategoriu pre supplaiera 
	// 3. https://fecko.org/productdelivery/Product/create/1
	// /options ->  
	// const categoryPost = useFetch("https://fecko.org/productdelivery/ProductCategory/create", options).response;
	// console.log('categoryPost', categoryPost)
	
	const responseSupplier = useFetch("https://fecko.org/productdelivery/Supplier/detail/1", {}).response;
	const productCategories = useFetch("https://fecko.org/productdelivery/ProductCategory", {}).response;
	const supplierProducts = useFetch("https://fecko.org/productdelivery/custom/supplier-products/1", {}).response;
	
	const supplierProductsGroupedByCategory = groupSupplierProductsByCategory(productCategories, supplierProducts)
	// console.log('GROUPED!', supplierProductsGroupedByCategory);
	if (!responseSupplier || !productCategories || !supplierProducts) {
	  return <Spinner animation="border" />
	}

	const state = {
		supplier: {
			...responseSupplier.record
		},
		categoryProductList: supplierProductsGroupedByCategory
	}

	return (
		<div className="App">
			<Router>
				<ContactContextProvider>
					<GlobalContext.Provider value={state}>
						<Switch>
							<Route path="/supplier-offer" children={<OfferList />} />
							<Route path="/customer-form" children={<CustomerForm />} />
							<Route path="/goodbye" children={<Goodbye />} />
							<Route path="/admin" children={<Admin/>} />
							<Route path="/" children={<Introduction/>} />
						</Switch>
					</GlobalContext.Provider>
				</ContactContextProvider>
			</Router>
		</div>
	);
}

const groupSupplierProductsByCategory = (productCategories, supplierProducts) => {
	if (!productCategories || !supplierProducts) return [];
	return productCategories.records.map(productCategory => {
		const productCategoryProducts = supplierProducts.products.map(product => {
			if (product.ProductCategoryID === productCategory.ProductCategoryID) {
				return {
					...product,
					count: 0
				}
			}
			return null;
		}).filter(value => value);
		return {
			...productCategory,
			listProducts: productCategoryProducts
		};
	})
};
