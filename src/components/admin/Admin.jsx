import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Modal, Row} from 'react-bootstrap';
import {ShowCategories} from "../show-categories/ShowCategories";
import {useParams} from 'react-router-dom';
import { isEmpty, isNil } from "ramda";
import { TimePicker } from "antd";
import moment from "moment";
// import { Button as Buttonik } from 'antd';
import { showNotification } from '../notification/notification'

import {
	filterProductCategoriesBySupplierId,
	groupSupplierProductsByCategory,
	getSupplierIdBySupplierList,
	getSupplierBySupplierList
} from '../../utils';

export function Admin(props) {
	const timeFormat = "HH:mm";
	const [show, setShow] = useState(false);
	const [categories, setCategories] = useState([]);
	const [supplierId, setSupplierId] = useState(0);
	const [supplier, setSupplier] = useState({})
	const [limitTime, setLimitTime] = useState(null)
	const [limitDay, setLimitDay] = useState("DEFAULT")

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
			const supplier = getSupplierBySupplierList(suppliers, adminId)
			setSupplier(supplier);
			setLimitDay(supplier.OrderLimitDaySubtract || "DEFAULT");
			setLimitTime(supplier.OrderLimitHour)
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
				const supplierProductCategories = filterProductCategoriesBySupplierId(productCategories.records, supplierId)
				setCategories(groupSupplierProductsByCategory(supplierProductCategories, supplierProducts));
			});
	}
	
	function handleAddCategorySubmit(event) {
		let formData = new FormData();
		formData.append('Name', name.value);
		formData.append('Date', date.value);
		formData.append('SupplierID', supplierId);

		const options = {
			method: 'POST',
			body: formData,
		};
		const url = 'https://fecko.org/productdelivery/ProductCategory/update/' + categoryId.value;

		fetch(url, options)
        .then(response => response.json())
        .then(data => {
        	loadCategories(supplierId);
        	handleClose();
		});
		event.preventDefault();
	}

	function handleGeneralSettingsSubmit(event) {
		let formData = new FormData();
		formData.append('OrderLimitHour', limitTime);
		formData.append('OrderLimitDaySubtract', limitDay);
		
		const options = {
			method: 'POST',
			body: formData,
		};

		const url = 'https://fecko.org/productdelivery/Supplier/update/' + supplierId;

		fetch(url, options)
			.then(response => response.json())
			.then(data => {
				console.log('updated=', data)
			});
		
		showNotification('topRight', 'Nastavenia úspešne uložené!')
	}

	function editCategory(category) {
		name.onInitValue(category.Name);
		categoryId.onInitValue(category.ProductCategoryID);
		setShow(true);
	}

	function handleLimitTimeChange(value) {
		setLimitTime(value.format(timeFormat))
	}

	function handleLimitDateChange(event) {
		if (event.target.value === "NONE") {
			setLimitTime(null)
			setLimitDay("NONE")
			return;
		}
		setLimitDay(event.target.value)
	}

	function validateSettingsSubmit() {
		if (!isEmpty(limitDay) && limitDay !== "DEFAULT" ) {
			return false;
		}
		if (isEmpty(limitTime) || isNil(limitTime)){ 
			return true
		}
		return true
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
			<ShowCategories
				categories={categories}
				callback={loadCategories}
				editCategory={editCategory}
				supplierId={supplierId}
			/>
			<h4 style={{marginTop: '20px', textAlign: 'left'}}>Všeobecné nastavenia</h4>
			<div style={{marginBottom: '40px', background: 'rgba(51, 146, 83, 0.26)', padding: '20px', textAlign: 'left'}}>
				<Form>
					<Form.Group controlId="exampleForm.SelectCustom">
						<Form.Label>Deň a čas kedy si zákazník môže naposledy objednať produkt v kategórii</Form.Label>
						<Form.Row>
							<Col sm="9">
								<Form.Control
									as="select"
									onChange={handleLimitDateChange}
									value={limitDay ? limitDay : "DEFAULT"}
									custom
								>
									<option value={"DEFAULT"} disabled>Vyberte deň</option>
									<option value="0">V daný deň</option>
									<option value="1">Predchádzajúci deň</option>
									<option value="2">Dva dni dozadu</option>
									<option value="NONE">Žiadne obmedzenie</option>
								</Form.Control>
							</Col>
							<Col sm="3" className="d-flex justify-content-end">
								<TimePicker
									className="time-picker"
									popupClassName="time-picker-popup"
									defaultValue={
										supplier && moment(supplier.OrderLimitHour, timeFormat, true).isValid()
											? moment(supplier.OrderLimitHour, timeFormat) 
											: null
									}
									value={
										supplier && moment(limitTime, timeFormat, true).isValid()
											? moment(limitTime, timeFormat)
											: null
									}
									format={timeFormat}
									onChange={handleLimitTimeChange}
									placeholder="Vyberte čas"
									showToday={false}
									minuteStep={15}
								/>
							</Col>
						</Form.Row>
						<Form.Row className="d-flex justify-content-end p-1 mt-2">
							<Button 
								variant="primary"
								onClick={handleGeneralSettingsSubmit}
								disabled={validateSettingsSubmit()}
							>
								Uložiť
							</Button>
						</Form.Row>
					</Form.Group>
				</Form>
			</div>
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

export function useFormInput(initialValue) {
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
