import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Modal, Row} from 'react-bootstrap';
import {ShowCategories} from "../show-categories/ShowCategories";
import {useParams} from 'react-router-dom';

export function Admin(props) {
	const [show, setShow] = useState(false);
	const [categories, setCategories] = useState([]);
	const [supplierId, setSupplierId] = useState(0)

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	let name = useFormInput("");
	let date = useFormInput("");
	let categoryId = useFormInput("");

	let { adminId } = useParams()

	useEffect(() => {
		async function loadSuppliers() {
			const suppliersRes = await fetch("https://fecko.org/productdelivery/Supplier");
			return (await suppliersRes.json()).records;
		}
		Promise.resolve(loadSuppliers()).then(suppliers => {
			const supplierId = getSupplierIdBySupplierList(suppliers, adminId);
			setSupplierId(supplierId);
			loadCategories(supplierId);
		});
	}, [adminId]);

	function loadCategories(supplierId) {
		Promise.all([
			fetch('https://fecko.org/productdelivery/ProductCategory'),
			fetch(`https://fecko.org/productdelivery/custom/supplier-products/${supplierId}`)
		])
			.then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
			.then(([productCategories, supplierProducts]) => {
				setCategories(groupSupplierProductsByCategory(productCategories, supplierProducts));
			});
	}
	
	function handleAddCategorySubmit(event) {
		let formData = new FormData();
		formData.append('Name', name.value);
		formData.append('Date', date.value);

		const options = {
			method: 'POST',
			body: formData,
		};

		let url = 'https://fecko.org/productdelivery/ProductCategory/create';
		if(categoryId.value) {
			url = 'https://fecko.org/productdelivery/ProductCategory/update/' + categoryId.value;
		}

		fetch(url, options)
        .then(response => response.json())
        .then(data => {
        	loadCategories(supplierId);
        	handleClose();
		});
		event.preventDefault();
	}

	function editCategory(category) {
		name.onInitValue(category.Name);
		categoryId.onInitValue(category.ProductCategoryID);
		setShow(true);
	}
	console.log('supplierId', supplierId)

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
			<ShowCategories
				categories={categories}
				callback={loadCategories}
				editCategory={editCategory}
				supplierId={supplierId}
			/>

			{/* MODAL NA PRIDANIE KATEGORIE */}
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Pridat kategoriu</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleAddCategorySubmit}>
						<Form.Group controlId="formBasicEmail">
							<Form.Label>Názov kategórie</Form.Label>
							<Form.Control type="text" placeholder="(napr. Pondelok)" {...name}/>
							<Form.Label>Dátum kategórie</Form.Label>
							<Form.Control type="date" placeholder="dátum napr. 1.4.2020" {...date}/>
							<Form.Control type="hidden" {...categoryId}/>
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
			if (product.ProductCategoryID === productCategory.ProductCategoryID) {
				return product
			}
			return null;
		}).filter(value => value);
		return {
			...productCategory,
			listProducts: productCategoryProducts
		};
	})
};

function useFormInput(initialValue) {
	const [value, setValue] = useState(initialValue);

	const handleChange = e => {
		setValue(e.target.value);
	};

	const onInitValue = value => {
		setValue(value);
	};

	return {
		value,
		onInitValue: onInitValue,
		onChange: handleChange
	};
}

const getSupplierIdBySupplierList = (supplierList, adminId) => {
	const foundSupplier = supplierList.find(supplier => supplier.admin === adminId)
	return foundSupplier.SupplierID;
}