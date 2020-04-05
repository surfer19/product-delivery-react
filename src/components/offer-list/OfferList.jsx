import React, {useContext, useState} from 'react'
import {Link} from "react-router-dom";
import {GlobalContext} from "../../App";
import {isEmpty} from 'ramda';
import {ContactContext} from "../../context";
import {BottomBar} from "../bottom-bar/BottomBar";

export function ProductItem({product, addItemToBasket, removeItemFromBasket, recalculateTotalPrice}) {
    const [count, setCount] = useState(0);
    const [isActive, setActive] = useState(false);
    return (
        <li key={product.ProductID} class={isActive ? "active" : ""}>
			<span class="product-inner" onClick={() => {
                if (isActive) {
                    removeItemFromBasket(product.ProductID);
                    addItemToBasket(null);
                    setCount(count > 0 ? count - 1 : count);
                    recalculateTotalPrice();
                    return setActive(false);
                }

                setActive(true);
                addItemToBasket(product);
                setCount(count + 1);
                recalculateTotalPrice();
            }}
            >
				<span class="product-name">{product.Name}</span>
				<span class="product-price">{product.Price} €</span>
				<p class="product-desc">{product.Description}</p>
			</span>


            <div class="product-amount">
                <span class="product-amount-title">Zadajte množstvo</span>

                <div class="product-amount-div">
                    <button onClick={(event) => {
                        event.preventDefault();
                        removeItemFromBasket(product.ProductID);
                        setCount(count > 0 ? count - 1 : count);
                        recalculateTotalPrice()
                    }}
                    > -
                    </button>
                    <span>{count}</span>
                    <button onClick={(event) => {
                        addItemToBasket(product);
                        setCount(count + 1);
                        recalculateTotalPrice()
                    }}
                    >+
                    </button>
                </div>

            </div>
        </li>
    )
}

export function OfferList() {
    const [state, dispatch] = useContext(ContactContext);

    const renderCategoryProducts = (categoryProducts) => {
        if (!categoryProducts || isEmpty(categoryProducts.listProducts)) return "Žiadna ponuka pre tento deň";
        return categoryProducts.listProducts.map(product => (
            <ProductItem
                product={product}
                addItemToBasket={addItemToBasket}
                removeItemFromBasket={removeItemFromBasket}
                recalculateTotalPrice={recalculateTotalPrice}
            />
        ))
    };

    const removeItemFromBasket = id => {
        dispatch({
            type: "REMOVE_FROM_BASKET",
            payload: id
        });
    };

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
    };

    return (
        <GlobalContext.Consumer>
            {state => (
                <>
                    <div class="wrapper">
                        <ul class="shopheader">
                            <li class="active">
                                <span class="shopheader-num">1</span>
                                <span class="shopheader-title">Výber <br></br>z ponuky</span>
                            </li>
                            <li>
                                <span class="shopheader-num">2</span>
                                <span class="shopheader-title">Vaše <br></br>údaje</span>
                            </li>
                            <li>
                                <span class="shopheader-num">3</span>
                                <span class="shopheader-title">To je <br></br>všetko :)</span>
                            </li>
                        </ul>
                        <ul class="noul">
                            {state.categoryProductList.map(categoryProducts => {
                                return (
                                    <li class="categorylist" key={categoryProducts.ProductCategoryID}>
                                        <p class="catname">{categoryProducts.Name}</p>
                                        <ul class="noul productlist">
                                            {renderCategoryProducts(categoryProducts)}
                                        </ul>
                                    </li>
                                )
                            })}
                        </ul>

                    </div>

                    <div class="footer footer-shadow">
                        <BottomBar/>
                        <Link to="/customer-form" class="button button-full">
							<span>
							POKRAČOVAŤ
							</span>
                        </Link>
                    </div>
                </>
            )}
        </GlobalContext.Consumer>
    )

}
