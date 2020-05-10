import React, {useState} from 'react';
import { isEmpty } from 'ramda';
import {Row, Col, Button, Modal, Form} from 'react-bootstrap';

export function ShowCategories(props) {

    let name = useFormInput("");
    let description = useFormInput("");
	let price = useFormInput("");
	let storeCount = useFormInput("");
    let productId = useFormInput("");
    let categoryId = useFormInput("");

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = (category) => {
        categoryId = categoryId.onInitValue(category.ProductCategoryID);
        setShowModal(true);
	};
	const { supplierId } = props;
    const handleEditModal = (product) => {
        name.onInitValue(product.Name);
        description.onInitValue(product.Description);
        price.onInitValue(product.Price);
        productId.onInitValue(product.ProductID);
		categoryId.onInitValue(product.ProductCategoryID);
		storeCount.onInitValue(product.StoreCount);
        setShowModal(true);
    };

    function deleteCategory(category) {
        fetch(`https://fecko.org/productdelivery/ProductCategory/delete/${category.ProductCategoryID}`)
            .then(response => response.json())
            .then(data => {
                props.callback(supplierId);
            });
    }

    function handleModalSubmit(event) {
        let formData = new FormData();
        formData.append('Name', name.value);
        formData.append('Price', price.value);
		formData.append('Description', description.value);
		formData.append('StoreCount', storeCount.value);
        formData.append('SupplierID', supplierId);
		formData.append('ProductCategoryID', categoryId.value);
		formData.append('StoreCount',  storeCount.value);
        let url = 'https://fecko.org/productdelivery/Product/create';
        if(productId.value) {
            url = 'https://fecko.org/productdelivery/Product/update/' + productId.value;
        }
        const options = {
            method: 'POST',
            body: formData,
        };

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                props.callback(supplierId);
                handleCloseModal();
            });
        event.preventDefault();
    }

    function handleDeleteProduct(product) {
        fetch(`https://fecko.org/productdelivery/Product/delete/${product.ProductID}`)
            .then(response => response.json())
            .then(data => {
                props.callback(supplierId);
            });
    }

    function handleEditCategory(category) {
        props.editCategory(category);
    }

    return ( 
        <div>
            <ul style={{listStyle: 'none',marginTop: '20px', textAlign: 'left', paddingLeft: '0px'}}>
                {props.categories.map(category => {
                    return (
                        <li style={{marginBottom: '40px', background: 'rgba(51, 146, 83, 0.26)', padding: '20px'}} key={category.ProductCategoryID}>
                            <Row className="show-grid" style={{marginBottom: '10px'}}>
                                <Col xs={12} md={5}>
                                    <strong>{category.Name} {category.Date}</strong>
                                </Col>
                                <Col xs={6} md={7} style={{textAlign: 'right'}}>
                                    <Button variant="primary" size="sm" onClick={handleShowModal.bind(this, category)}>Pridat polozku do kategorie</Button>{' '}
                                    <Button variant="warning" size="sm" onClick={handleEditCategory.bind(this, category)}>Edit</Button>{' '}
                                    <Button variant="danger" disabled={category.listProducts.length !== 0} size="sm" onClick={deleteCategory.bind(this, category)}>X</Button>
                                </Col>
                            </Row>
							<hr />
                            <ul style={{listStyle: 'none',paddingLeft: '0px'}}>
                                {renderCategoryProducts(handleEditModal, handleDeleteProduct, category)}
                            </ul>
                        </li>
                    )
                })}
            </ul>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Položka</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleModalSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Názov položky</Form.Label>
                            <Form.Control type="text" placeholder="Názov" {...name}/>
							<Form.Label>Popis</Form.Label>
                            <Form.Control type="text" placeholder="Popis" {...description}/>
							<Form.Label>Cena</Form.Label>
                            <Form.Control type="text" placeholder="Cena" {...price}/>
							<Form.Label>Množstvo na sklade</Form.Label>
							<Form.Control type="text" placeholder="Množstvo na sklade" {...storeCount}/>
                            <Form.Control type="hidden" {...productId}/>
                            <Form.Control type="hidden" {...categoryId}/>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Pridat položku
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
    
}

const renderCategoryProducts = (callbackEdit, callbackDelete, categoryProducts) => {
	if (!categoryProducts || isEmpty(categoryProducts.listProducts)) return "Žiadna ponuka pre tento deň";
	return categoryProducts.listProducts.map(product => (
		<li key={product.ProductID}>
            <Row className="show-grid">
				<Col xs={12} md={8}>
                    <p>
                        {product.Name} <br></br>
                        {product.Description}
                    </p>
				</Col>
				<Col xs={3} md={1} style={{textAlign: 'right'}}>
                    <p>{product.Price}€ </p>
				</Col>
				<Col xs={3} md={1} style={{textAlign: 'right'}}>
                    <p>{product.StoreCount}ks</p>
				</Col>

                <Col xs={6} md={2} style={{textAlign: 'right'}}>
                    <Button variant="warning" size="sm" onClick={callbackEdit.bind(this, product)}>Edit</Button>{' '}
                    <Button variant="danger" size="sm" onClick={callbackDelete.bind(this, product)}>X</Button>
				</Col>
			</Row>
		</li>
	))
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
