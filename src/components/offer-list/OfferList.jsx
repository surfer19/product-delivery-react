import React, {useContext, useState} from 'react'
import { Link } from "react-router-dom";
import { GlobalContext } from "../../App";
import { isEmpty } from 'ramda';
import { ContactContext } from "../../context";
import { BottomBar } from "../bottom-bar/BottomBar";
import moment from 'moment';
// import timezone from 'moment-timezone'

export function ProductItem({product, addItemToBasket, removeItemfromBasket, recalculateTotalPrice, isDisabled}) {
	const [state, dispatch] = useContext(ContactContext);
	let productBasketItem = state.basket.find(item => item.ProductID === product.ProductID)
	let count = productBasketItem ? productBasketItem.count : 0;

	return (
		<li key={product.ProductID} 
			className={count > 0 ? "active" : ""}
		>
			<span className="product-inner" onClick={() => {
				if (isDisabled) return;
				// already exists -> remove
				if (productBasketItem) {
					removeItemfromBasket(product.ProductID);
					recalculateTotalPrice();
					return;
				};
					addItemToBasket(product);
					recalculateTotalPrice();
				}} 
			>
				<span className="product-name">{product.Name}</span>
				<span className="product-price">{product.Price} €</span>
				<p className="product-desc">{product.Description}</p>
			</span>
			
			
			<div className="product-amount">
				<span className="product-amount-title">Zadajte množstvo</span>

				<div className="product-amount-div">
					<button onClick={() =>{ 
						if (isDisabled) return;
						removeItemfromBasket(product.ProductID)
						recalculateTotalPrice()
					}}
					> -
					</button>
					<span>{count}</span>
					<button onClick={() =>{ 
						if (isDisabled) return;
						addItemToBasket(product)
						recalculateTotalPrice()
					}}
					>+</button>
				</div>
				
			</div>
		</li>
	)
}

export function OfferList() {	
	const [state, dispatch] = useContext(ContactContext);
	const basketLength = state.basket.length;
	
	const renderCategoryProducts = (categoryProducts, isDisabled) => {
		if (!categoryProducts || isEmpty(categoryProducts.listProducts)) return "Žiadna ponuka pre tento deň";
		return categoryProducts.listProducts.map(product => {
			product = { 
				...product,
				ProductCategoryName: categoryProducts.Name,
				ProductCategoryDate: categoryProducts.Date ? categoryProducts.Date : ''
			}
			return (<ProductItem
				product={product}
				addItemToBasket={addItemToBasket}
				removeItemfromBasket={removeItemfromBasket}
				recalculateTotalPrice={recalculateTotalPrice}
				isDisabled={isDisabled}
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
							{state.categoryProductList.map(categoryProducts => {
								const isDisabled = isDisabledCategory(categoryProducts)						
								return (
									<li className="categorylist" key={categoryProducts.ProductCategoryID}>
										<p className="catname">
											<span>{categoryProducts.Name} </span>
											<span>
												{!isNaN(Date.parse(categoryProducts.Date)) ? moment(categoryProducts.Date).format('DD.MM.YYYY') : ""}
											</span>
										</p>
										<ul className={`noul productlist ${isDisabled ? "disabled" : ""}`}>
											{renderCategoryProducts(categoryProducts, isDisabled)}
										</ul>
									</li>
								)
							})}
						</ul>
						
						<div>
							<h5>Alergény</h5>
							<small>1 - obilniny obsahujúce lepok; 2 - kôrovce a výrobky z nich; 3 - vajcia a výrobky z vajec; 4 - ryby a výrobky z rýb; 5 - arašidy a výrobky z nich; 6 - sója a výrobky zo sóje; 7 - mlieko a výrobky z mlieka; 8 - orechy a výrobky z orechov; 9 - zeler a výrobky zo zeleru; 10 - horčica a výrobky z horčice; 11 - sezamové semená a výrobky z nich; 12 - oxid siričitý a siričitan; 13 - vlčí bôb a výrobky z neho; 14 - mäkkýše a výrobky z nich</small>
						</div>
					</div>
					

					<div className="footer footer-shadow">
						<BottomBar />
						<div className="btngroup">
						
							<Link to="/" className="button button-back">
								<span className="">
								&lt;
								</span>
							</Link>
							{basketLength === 0 ? <Link to="/customer-form" onClick={(e) => e.preventDefault()} className="button button-full disabled"><span>Pokračovať</span></Link> : <Link to="/customer-form" className="button button-full"><span>Pokračovať</span></Link>}
						</div>
					</div>
				</>
			)}
		</GlobalContext.Consumer>
	)
	
}

const isDisabledCategory = (categoryProducts) => {
    if (!categoryProducts.Date && !moment.isDate(categoryProducts.Date)) return false;
    // change now for debug purpose .add(6, 'hours')
    // const now = moment();
    const dateCategoryMoment = moment(categoryProducts.Date, 'YYYY-MM-DD');
    // category date je medzi -INF az end of today -1
    const endOfYesterday = moment().subtract(1, 'day').endOf('day')
    const categoryIsHistory = dateCategoryMoment.isBetween(moment().unix(), endOfYesterday)
 
    // now is between category day 14:00 - end of category day
    const categoryCurrentDayLimit = dateCategoryMoment.add(10, 'hours')
    const nowIsBetweenLimitTodayAndCategoryEndDay = moment().isBetween(
        categoryCurrentDayLimit,
        moment(categoryProducts.Date).endOf('day')
    )
   
    return categoryIsHistory || nowIsBetweenLimitTodayAndCategoryEndDay; //nowIsBetweenLimitYesterdayAndCategoryEndDay
}

// const isDisabledCategory = (categoryProducts) => {
// 	if (!categoryProducts.Date && !moment.isDate(categoryProducts.Date)) return false;
// 	// change now for debug purpose .add(6, 'hours')
// 	const now = moment();
// 	const dateCategoryMoment = moment(categoryProducts.Date, 'YYYY-MM-DD');
// 	// date is from - INF to today night
// 	const endOfToday = now.endOf('today')
// 	const categoryIsHistory = dateCategoryMoment.isBetween(moment().unix(), endOfToday)

// 	const categoryPreviousDayLimit = dateCategoryMoment.subtract(1, 'day').add(18, 'hours')
// 	// add .add(6, 'hours') after moment() for debug purpose
// 	// check if now is between current category time minus X hours and end of category day
// 	const nowIsBetweenLimitYesterdayAndCategoryEndDay = moment().isBetween(
// 		categoryPreviousDayLimit, 
// 		moment(categoryProducts.Date).endOf('day')
// 	)

// 	return categoryIsHistory || nowIsBetweenLimitYesterdayAndCategoryEndDay
// }