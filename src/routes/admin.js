const router = require("express").Router();
const controller = require("../controllers/admin");
const { authorization } = require("../middlewares/auth");
const { uploadFilter } = require("../middlewares/multer");

//admin
router.post("/api/v1/admin/login", controller.loginAdmin);
router.post("/api/v1/admin/logout", authorization, controller.logoutAdmin);

//product
router.post("/api/v1/admin/product", authorization, uploadFilter, controller.addProduct);
router.put("/api/v1/admin/product/:productID", authorization, controller.editDataProduct);
router.delete("/api/v1/admin/product/:productID", authorization, controller.deleteDataProduct);
router.get("/api/v1/admin/product", authorization, controller.getDataListProduct);

//image
router.delete("/api/v1/admin/productimage/:productimageID", authorization, controller.deleteProductImage);

//Order
router.post("/api/v1/admin/order", authorization, controller.addConfirmOrderProduct);
router.put("/api/v1/admin/order/:transaksiID", authorization, controller.updateConfirmOrderProduct);
router.get("/api/v1/admin/order", authorization, controller.getOrderDeliveryList);
router.put("/api/v1/admin/order_done/:transaksiID",authorization, controller.updateOrderDeliveryList);
router.get("/api/v1/admin/order_all", authorization, controller.getOrderDeliveryListAll);

//Queue
router.put("/api/v1/admin/production_queue_limit/:productID/:limit", authorization, controller.updateProductionQueueProgressLimit);
router.put("/api/v1/admin/production_queue_done/:productID", authorization, controller.updateProductionQueueDone);
router.get("/api/v1/admin/production_queue", authorization, controller.getProductionQueue);
router.get("/api/v1/admin/production_queue_not_done",authorization, controller.getProductionQueueNotDone);

//Excel
router.post("/api/v1/admin/export-to-excel", controller.exportToExcelProduct);

module.exports = router;