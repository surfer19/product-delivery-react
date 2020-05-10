import React, {useContext, useState} from 'react'
import { Link } from "react-router-dom";
import { GlobalContext } from "../loading-wrapper/LoadingWrapper";
import { isEmpty } from 'ramda';
import { ContactContext } from "../../context";
import { BottomBar } from "../bottom-bar/BottomBar";
import moment from 'moment';
import { useRouteMatch, useParams } from "react-router-dom";

// import timezone from 'moment-timezone'
import { OfferItem } from '../offer-item/offer-item';


export function OfferList() {	
	let { supplierIdName } = useParams();
	const [state, dispatch] = useContext(ContactContext);
	const basketLength = state.basket.length;

	const renderCategoryProducts = (categoryProducts, isDisabled, key) => {
		if (!categoryProducts || isEmpty(categoryProducts.listProducts)) return "Žiadna ponuka pre tento deň";
		return categoryProducts.listProducts.map(product => {
			product = { 
				...product,
				ProductCategoryName: categoryProducts.Name,
				ProductCategoryDate: categoryProducts.Date ? categoryProducts.Date : ''
			}
			return (<OfferItem
				product={product}
				addItemToBasket={addItemToBasket}
				removeItemfromBasket={removeItemfromBasket}
				updateDisabledAddToBasket={updateDisabledAddToBasket}
				recalculateTotalPrice={recalculateTotalPrice}
				isDisabled={isDisabled || isProductStoreCountNotPositive(product)}
				key={product.ProductID}
			/>)
		})
	}
	
	const removeItemfromBasket = id => {
		dispatch({
			type: "REMOVE_FROM_BASKET",
		    payload: id
		});
	}

	const addItemToBasket = item => {
		dispatch({
			type: "ADD_TO_BASKET",
		    payload: item
		});
	  };

	const recalculateTotalPrice = () => {
		dispatch({
			type: "RECALCULATE_TOTAL_PRICE",
		});
	}

	const updateDisabledAddToBasket = () => {
		dispatch({
			type: "UPDATE_DISABLED_ADD_TO_BASKET",
		})
	}

	return (
		<GlobalContext.Consumer>
			{state => (
				<>
					<div className="wrapper">
						<ul className="shopheader">
							<li className="active">
								<span className="shopheader-num">1</span>
								<span className="shopheader-title">Výber <br></br>z ponuky</span>
							</li>
							<li>
								<span className="shopheader-num">2</span>
								<span className="shopheader-title">Vaše <br></br>údaje</span>
							</li>
							<li>
								<span className="shopheader-num">3</span>
								<span className="shopheader-title">To je <br></br>všetko :)</span>
							</li>
						</ul>
						<ul className="noul">
							{state.categoryProductList.map((categoryProducts, key) => {
								const isDisabled = isDisabledDate(categoryProducts, state.supplier.OrderLimitDaySubtract, state.supplier.OrderLimitHour)
								return (
									<li className="categorylist" key={categoryProducts.ProductCategoryID} style={ isDisabled ? {display: "none"} : {}}>
										<p className="catname">
											<span>{categoryProducts.Name} </span>
											<span>
												{!isNaN(Date.parse(categoryProducts.Date)) ? moment(categoryProducts.Date).format('DD.MM.YYYY') : ""}
											</span>
										</p>
										<ul className={`noul productlist ${isDisabled ? "disabled" : ""}`}>
											{renderCategoryProducts(categoryProducts, isDisabled, key)}
										</ul>
									</li>
								)
							})}
						</ul>
						{/* allergens */}
						{state.supplier.allergens ?
							<div>
								<h5>Alergény</h5>
								<small>{state.supplier.allergens}</small>
							</div>
							: null
						}
					</div>
					

					<div className="footer footer-shadow">
						<BottomBar />
						<div className="btngroup">
							<Link to={`/${supplierIdName}`} className="button button-back">
								<span className="">
								&lt;
								</span>
							</Link>
							{/* {basketLength === 0 ? <Link to={`/${supplierIdName}/customer-form`} onClick={(e) => e.preventDefault()} className="button button-full disabled"><span>Pokračovať</span></Link> : <Link to="/customer-form" className="button button-full"><span>Pokračovať</span></Link>} */}
							{
								basketLength === 0 
									? <Link
										to={`/${supplierIdName}/customer-form`}
										className="button button-full disabled"
										onClick={(e) => e.preventDefault()}
										>
											<span>Pokračovať</span>
										</Link>
									: <Link 
										to={`/${supplierIdName}/customer-form`}
										className="button button-full">
											<span>Pokračovať</span>
										</Link>}
						</div>
					</div>
				</>
			)}
		</GlobalContext.Consumer>
	)
	
}

const isDisabledDate = (categoryProducts, supplierNumberLimitDays, supplierLimitTime) => {
	if (!categoryProducts.Date && !moment.isDate(categoryProducts.Date)) return false;
	if (supplierNumberLimitDays === "NONE") {
		return false
	}
	// change now for debug purpose .add(6, 'hours')
	const now = moment();
	const dateCategoryMoment = moment(categoryProducts.Date + ` ${supplierLimitTime}`, 'YYYY-MM-DD HH:mm');
	// date is from - INF to today night
	const endOfToday = now.endOf('today')
	const categoryIsHistory = dateCategoryMoment.isBetween(moment().unix(), endOfToday)

	const categoryDateTimeLimit = dateCategoryMoment.subtract(supplierNumberLimitDays, 'day')//.add(supplierLimitTime, 'hours')
	// add .add(6, 'hours') after moment() for debug purpose
	// check if now is between current category time minus X hours and end of category day
	const nowIsBetweenDateTimeLimitAndCategoryEndDay = moment().isBetween(
		categoryDateTimeLimit,
		moment(categoryProducts.Date).endOf('day')
	)

	return categoryIsHistory || nowIsBetweenDateTimeLimitAndCategoryEndDay
}

const isProductStoreCountNotPositive = (product) => {
	return product.StoreCount <= 0;
}