import React from 'react';
import './App.css';
import { Introduction } from './components/introduction/Introduction';
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
} from "react-router-dom";

export const GlobalContext = React.createContext({});

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
				<GlobalContext.Provider value={state}>
					<Switch>
						<Route path="/supplier-offer" children={<OfferList />} />
						<Route path="/customer-form" children={<CustomerForm />} />
						<Route path="/goodbye" children={<Goodbye />} />
						<Route path="/" children={<Introduction/>} />
					</Switch>
				</GlobalContext.Provider>
			</Router>
		</div>
	);
}

const groupSupplierProductsByCategory = (productCategories, supplierProducts) => {
	if (!productCategories || !supplierProducts) return [];
	return productCategories.records.map(productCategory => {
		const productCategoryProducts = supplierProducts.products.map(product => {
			if(product.SupplierID === productCategory.ProductCategoryID) {
				return product
			}
			return null;
		}).filter(value => value)
		const mergedProductCategoryWithProducts = {
			...productCategory,
			listProducts: productCategoryProducts
		}
		return mergedProductCategoryWithProducts;
	})
}
