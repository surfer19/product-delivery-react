import { isEmpty } from "ramda";

/**
 * Utility functions
 */
export const groupSupplierProductsByCategory = (supplierProductCategories, supplierProducts, supplierId) => {
	if (!supplierProductCategories || !supplierProducts) return [];
	return supplierProductCategories.map(productCategory => {
		const productCategoryProducts = supplierProducts.products.map(product => {
			if (product.ProductCategoryID === productCategory.ProductCategoryID) {
				return {
					...product,
					count: 0
				}
			}
			return null;
		}).filter(value => value);
		return {
			...productCategory,
			listProducts: productCategoryProducts
		};
	})
};

export const filterProductCategoriesBySupplierId = (productCategories, supplierId) =>
	productCategories.filter(category => category.SupplierID === supplierId)


export const getSupplierIdBySupplierList = (supplierList, adminId) => {
	const foundSupplier = supplierList.find(supplier => supplier.admin === adminId)
	return foundSupplier.SupplierID;
}

export const getSupplierBySupplierList = (supplierList, adminId) => {
	const foundSupplier = supplierList.find(supplier => supplier.admin === adminId)
	return foundSupplier;
}

export const productExceedStoreCount = (listBasket) => {
	const listExceedProducts = listBasket.filter(product => (product.StoreCount - product.count) < 0)
	if (!isEmpty(listExceedProducts)){
		return {
			doesExceed: true,
			exceedItem: listExceedProducts[0]
		}
	}
	return {
		doesExceed: false,
	}
}
