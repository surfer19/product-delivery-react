import React, { useState } from 'react';
import { useFetch } from "../../hooks/useFetch";
// import { GlobalContext } from "../../App";
// import { Link } from "react-router-dom";
import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { ShowCategories } from "../show-categories/ShowCategories";
import { render } from '@testing-library/react';

export function Admin() {
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

			handleClose();
		});
		
		// const prodCategory = useFetch("https://fecko.org/productdelivery/ProductCategory/create", options).response;
		event.preventDefault();
	}



	


	// function handleAddCat(e){
    //     // e.preventDefault();
	// 	console.log(e.target);
	// 	// formData.append('Name', 'Johnyyyy');
    // }

	
    
    // const prodCategory = useFetch("https://fecko.org/productdelivery/ProductCategory/create", options).response;
	// console.log('categoryPostt', prodCategory)


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

			<ShowCategories />

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
