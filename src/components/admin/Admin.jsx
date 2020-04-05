import React, { useState, useEffect } from 'react';
import { useFetch } from "../../hooks/useFetch";
import { GlobalContext } from "../../App";
import { Link } from "react-router-dom";
import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { ShowCategories } from "../show-categories/ShowCategories";
import { render } from '@testing-library/react';
import { test } from 'ramda';

export function Admin() {
	const productCategories = useFetch("https://fecko.org/productdelivery/ProductCategory", {}).response;
    const supplierProducts = useFetch("https://fecko.org/productdelivery/custom/supplier-products/1", {}).response;


	// console.log({
	// 	categoryProductList: productCategories
	// })
	const supplierProductsGroupedByCategory = groupSupplierProductsByCategory(productCategories, supplierProducts)
	const [state, stateUpdate] = useState();
	useEffect(() => {
		stateUpdate( {
			categoryProductList: supplierProductsGroupedByCategory
		} );
	},[state]);
	
    // const state = {
	// 	categoryProductList: supplierProductsGroupedByCategory
	// }

	// console.log(statee)
	// console.log('jd',state)


	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [inputVal, setInputVal] = useState(0);

	function handleChange(event) {
		setInputVal(event.target.value);
		// console.log(inputVal)
	}
	
	function handleSubmit(event) {
		let formData = new FormData();
		formData.append('Name', inputVal);

		const options = {
			method: 'POST',
			body: formData,
		}
		console.log(formData);

		fetch('https://fecko.org/productdelivery/ProductCategory/create', options)
        .then(response => response.json())
        .then(data => {
			console.log(data);
			// stateUpdate(data);
			let hovno = supplierProductsGroupedByCategory(data, supplierProducts)
			state = {}
			handleClose();
		});
		
		// const prodCategory = useFetch("https://fecko.org/productdelivery/ProductCategory/create", options).response;
		event.preventDefault();
	}



	return (
		<div style={{
			maxWidth: "700px", 
			width: "100%", 
			margin: "auto"
		}}>
			<Row className="show-grid" style={{marginTop: '20px', textAlign: 'left'}}>
				<Col xs={12} md={7}>
					<h3>Admin</h3>
				</Col>
				<Col xs={6} md={5} style={{textAlign: 'right'}}>
					<Button variant="primary" onClick={handleShow}>
						Pridat kategóriu
					</Button>
				</Col>
			</Row>

			<h4 style={{marginTop: '20px', textAlign: 'left'}}>Zoznam kategorii</h4>
			<ShowCategories {...state} />

			{/* MODAL NA PRIDANIE KATEGORIE */}
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Pridat kategoriu</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleSubmit}>
						<Form.Group controlId="formBasicEmail">
							<Form.Label>Názov kategórie</Form.Label>
							<Form.Control type="text" placeholder="(napr. Pondelok 1.4.)" onChange={handleChange} />
						</Form.Group>

						<Button variant="primary" type="submit">
							Pridat kategóriu
						</Button>
					</Form>
				</Modal.Body>
			</Modal>
			
		</div>
		
	)
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

