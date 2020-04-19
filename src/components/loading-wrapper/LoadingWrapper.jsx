import React, { useEffect, useState } from 'react'
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";
import {
	groupSupplierProductsByCategory,
	filterProductCategoriesBySupplierId,
} from '../../utils';
import { Introduction } from '../introduction/Introduction';
import { OfferList } from "../offer-list/OfferList";
import { Goodbye } from "../goodbye/Goodbye"
import { CustomerForm } from "../customer-form/CustomerForm";

export const GlobalContext = React.createContext();

export function LoadingWrapper(props) {
	const [supplierId, setSupplierId] = useState(0)
	const [supplier, setSupplier] = useState(null)
	const [categories, setCategories] = useState(null)
	// const [products, setProducts] = useState(null)
	
	let { supplierIdName } = useParams()
	useEffect(() => {
		async function loadSuppliers() {
			const suppliersRes = await fetch("https://fecko.org/productdelivery/Supplier");
			return (await suppliersRes.json()).records;
		}
		Promise.resolve(loadSuppliers()).then(suppliers => {
			const supplierId = getSupplierId(suppliers, supplierIdName);
			setSupplierId(supplierId);
			if (supplierId !== undefined) {
				loadSupplier(supplierId);
				loadCategoriesProducts(supplierId);
			}
		});
	}, [supplierIdName]);

	async function loadSupplier(supplierId) {
		const supplierRes = await fetch(`https://fecko.org/productdelivery/Supplier/detail/${supplierId}`);
		const supplier = (await supplierRes.json());
		setSupplier(supplier.record)
	}

	function loadCategoriesProducts(supplierId) {
		Promise.all([
			fetch('https://fecko.org/productdelivery/ProductCategory'),
			fetch(`https://fecko.org/productdelivery/custom/supplier-products/${supplierId}`)
		])
			.then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
			.then(([productCategories, supplierProducts]) => {
				const supplierProductCategories = filterProductCategoriesBySupplierId(productCategories.records, supplierId)
				setCategories(groupSupplierProductsByCategory(supplierProductCategories, supplierProducts));
			});
	}

	if (!supplier || !categories) {
	  return (
		<div style={{position: 'absolute', top: '50%', left: '50%', marginTop: '-17px', marginLeft: '-17px'}}>
			<Spinner animation="border" />
		</div>
	  );
	}
	const state = {
		supplier: {
			...supplier
		},
		categoryProductList: categories
	}

	return (
		<GlobalContext.Provider value={state}>
			<Switch>
				<Route path="/:supplierIdName/supplier-offer" children={<OfferList />} />
				<Route path="/:supplierIdName/customer-form" children={<CustomerForm />} />
				<Route path="/:supplierIdName/goodbye" children={<Goodbye />} />
				<Route path="/:supplierIdName" children={<Introduction/>} />
			</Switch> 
		</GlobalContext.Provider>
	)
}

export const getSupplierId = (supplierList, supplierName) => {
	const foundSupplier = supplierList.find(supplier => supplier.SupplierIdName === supplierName)
	return foundSupplier.SupplierID
}