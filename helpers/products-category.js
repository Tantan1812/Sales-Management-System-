const ProductCategory = require("../models/product-category.model");

module.exports.getSubCategory = async (parentId) => {
    const getCategory = async (parentId) => {
        try {
            const subs = await ProductCategory.find({
                parent_id: parentId,
                status: "active",
                deleted: false,
            });

            let allSub = [...subs];

            for (const sub of subs) {
                const childs = await getCategory(sub.id);
                allSub = allSub.concat(childs);
            }

            return allSub;
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            return [];
        }
    };

    try {
        const result = await getCategory(parentId);
        return result;
    } catch (error) {
        console.error("Error in getSubCategory:", error);
        return [];
    }
};
