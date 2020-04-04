import React from 'react';
import { useFetch } from "../../hooks/useFetch";
import { GlobalContext } from "../../App";
import { Link } from "react-router-dom";
// import { SupplierCategory } from "../supplier-category/SupplierCategory";
import { isEmpty } from 'ramda';
import { Row, Col, Button } from 'react-bootstrap';
import { render } from '@testing-library/react';

export function ShowCategories() {
    // function test(){
    //     let categories = [];
    //     for (let x = 0; x < 10; x++) {
    //         // console.log(x);
    //         categories.push(<SupplierCategory />);
    //     } 

    //     return categories;
    // }
    function handleDelete(e){
        // e.preventDefault();
        console.log(e.target.dataset.id)
    }

    let formData = new FormData();
	formData.append('Name', 'Johnyy');

	const options = {
		method: 'POST',
		body: formData,
		// headers: { 
			// 'content-type': 'application/json', 
			// 'Access-Control-Allow-Origin': "*"
		// }
    }
    
    const categoryPost = useFetch("https://fecko.org/productdelivery/ProductCategory/create", options).response;
	console.log('categoryPostt', categoryPost)


    return ( 
        <div>
            <h4 style={{marginTop: '20px', textAlign: 'left'}}>Zoznam kategorii</h4>
            <GlobalContext.Consumer>
                {state => (
                    <>
                        <ul style={{listStyle: 'none',marginTop: '20px', textAlign: 'left', paddingLeft: '0px'}}>
                            {state.categoryProductList.map(categoryProducts => {
                                return (
                                    <li style={{marginBottom: '40px', background: 'rgba(51, 146, 83, 0.26)', padding: '20px'}} key={categoryProducts.ProductCategoryID}>
                                        <Row className="show-grid" style={{marginBottom: '10px'}}>
                                            <Col xs={12} md={7}>
                                                <strong>{categoryProducts.Name}</strong>
                                            </Col>
                                            <Col xs={6} md={5} style={{textAlign: 'right'}}>
                                                <Button variant="primary" size="sm">Pridat polozku do kategorie</Button>{' '}
                                                <Button variant="danger" size="sm" data-id={categoryProducts.ProductCategoryID} onClick={handleDelete}>X</Button>
                                            </Col>
                                        </Row>
                                        <ul style={{listStyle: 'none',paddingLeft: '0px'}}>
                                            {renderCategoryProducts(categoryProducts)}
                                        </ul>
                                    </li>
                                )
                            })}
                        </ul>
                    </>
                )}
            </GlobalContext.Consumer>
            {/* {test()} */}
        </div>

    );
    
}

const renderCategoryProducts = (categoryProducts) => {
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
				<Col xs={6} md={2} style={{textAlign: 'right'}}>
                    <p>{product.Price}€ </p>
				</Col>

                <Col xs={6} md={2} style={{textAlign: 'right'}}>
                    <Button variant="warning" size="sm">Edit</Button>{' '}
                    <Button variant="danger" size="sm">X</Button>
				</Col>
			</Row>
		</li>
	))
}