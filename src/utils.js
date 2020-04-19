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
