const model = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const excel = require("exceljs");

require("dotenv").config();

module.exports = {

    loginAdmin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const checkDataAuth = await model.checkAuthAdminModel(email);
            const isLogin = await model.isActiveModel(email);
    
            if (checkDataAuth.length >= 1) {
                const checkPass = bcrypt.compareSync( password, checkDataAuth[0].password);
            if (checkPass) {
                const { adminID } = checkDataAuth[0];
                let payload = { adminID };
                const token = jwt.sign(payload, process.env.JWT_KEY, {
                    expiresIn: 60 * 60 * 24 * 30, //expires in 30 days
                });
                payload = { ...payload, token };
                if (isLogin) {
                    res.send({
                        statusMessage: "Login Admin Success",
                        statusCode: 200,
                        data: payload,
                    });
                } else {
                    res.send ({
                        statusMessage: "isLogin Gagal",
                        statusCode: 400,
                        data: { isSuccess: false },
                    });
                }
            } else {
                res.send({
                    statusMessage: "Email atau Password Salah!",
                    statusCode: 400,
                    data: { isSuccess: false },
                });
            }
            } else {
                res.send({
                statusMessage: "Email atau Password Salah",
                statusCode: 400,
                data: { isSuccess: false },
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                statusMessage: error.message,
                statusCode: 400,
                data: { isSuccess: false },
            });
        }
    },

    logoutAdmin: async (req, res) => {
        try {
            const { adminID } = req.admin;
            const randToken = bcrypt.genSaltSync(10);
            const logout = await model.logoutAdminModel(randToken, adminID);
            const isNotActive = await model.isNotActiveModel(adminID);

            if(logout) {
                if(isNotActive){
                    res.send({
                        statusMessage: "Logout Admin Success",
                        statusCode: 200,
                    });
                }
            } else {
                res.send({
                    statusMessage: "Something Wrong",
                    statusCode: 400,
                    data: { isSuccess: false },
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                statusMessage: error.message,
                statusCode: 400,
                data: { isSuccess: false },
            });
        }
    },

    addProduct: async (req, res) => {
        const { adminID } = req.admin;
        const {
            productID,
            nama_product,
            harga_product,
            jenis_product,
            isi_product,
        } = req.body;

        try {
            // Add Data to Table product
            const addToTableProduct = await model.addToTableProductModel({
                productID,
                nama_product,
                harga_product,
                jenis_product,
                isi_product,
                adminID: adminID,
            });
            
            if (addToTableProduct) {
                // Add Data to Table product_image
                if (typeof req.files["productImage"] !== "undefined" && req.files["productImage"] !== "") {
                    let uploadProductImage = {
                        productID: addToTableProduct.productID,
                        product_image_url: req.files["productImage"] === undefined ? '': `${process.env.URL}/uploads/product_image/` + req.files["productImage"][0].filename
                    }
                    const photo = await model.addToTableProductImageModel(uploadProductImage);
                    }
                res.send({
                    statusMessage: "Add Product Livera Success",
                    statusCode: 200,
                });
            } else {
                res.send ({
                    statusMessage: "Something Wrong",
                    statusCode: 400,
                    data: { isSuccess: false },
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                statusMessage:error.message,
                statusCode: 400,
                data: { isSuccess: false },
            });
        }
    },

    getDataListProduct: async (req, res) => {
        try {
            const listProduct= await model.getDataListProductModel();

            if(listProduct) {
                return res.send({
                    statusMessage: "Success",
                    statusCode: 200,
                    data: { listProduct },
                });
            } else {
                return res.send({
                    statusMessage: "Success",
                    statusCode: 200,
                    data: { listProduct },
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).send({
            statusMessage: error.message,
            statusCode: 400,
            data: { isSuccess: false },
            });
        }
    },

    getDataListProductPackage: async (req, res) => {
        try {
            const listProductPackage= await model.getDataListProductPackageModel();
            
            // map ini nge looping 1 per 1 dari list product package
            const result = await Promise.all(listProductPackage.map(async (item) => {
                return {
                    ...item,
                    product_package_details: await model.getDataListProductPackageDetailByPakacgeIDModel(item.product_packageID)
                }
            }))

            if(listProductPackage) {
                return res.send({
                    statusMessage: "Success",
                    statusCode: 200,
                    data: { listProductPackage:result },
                });
            } else {
                return res.send({
                    statusMessage: "Success",
                    statusCode: 200,
                    data: { listProductPackage:result },
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).send({
            statusMessage: error.message,
            statusCode: 400,
            data: { isSuccess: false },
            });
        }
    },

    deleteDataProduct: async (req, res) => {
        const { productID } = req.params;

        try {
            //get data product
            const deleteProduct = await model.deleteDataProductModel(productID);

            //get data product image
            //const deleteProductImage = await model.deleteDataProductImage(productID);

            if(deleteProduct){
                res.send({
                    statusMessage: "Success Delete Product",
                    statusCode: 200,
                });
            } else {
                res.send({
                    statusMessage: error.message,
                    statusCode: 400,
                    data: { isSuccess: false },
                });
            }
        } catch (error) {
            res.send({
                statusMessage: error.message,
                statusCode: 400,
                data: { isSuccess: false },
            });
        }
    },

    editDataProduct: async (req, res) => {
        const { productID } = req.params;
        const {
            nama_product,
            harga_product,
            jenis_product,
            isi_product,
        } = req.body;

        try {
            //get data product
            const editProduct = await model.updateDataProductModel({
                nama_product,
                harga_product,
                jenis_product,
                isi_product,
            }, productID);

            if(editProduct) {
                res.send({
                    statusMessage: "Success Edit Product",
                    statusCode: 200,
                });
                } else {
                    res.send({
                    statusMessage: "Something Wrong",
                    statusCode: 400,
                    data: { isSuccess: false },
                });
                }
                } catch (error) {
                    res.send({
                    statusMessage: error.message,
                    statusCode: 400,
                    data: { isSuccess: false },
                });
            }
        },

    addProductImage: async (req, res) => {
        const { productID } = req.body
        try {
        // Add Data to Table product
            const addToTableProductImage = await model.addToTableProductImageModel({
            productID,
            product_image_url: req.files['product_image'] === undefined ? ''
            : `${process.env.URL}/uploads/product_image/` + req.files['product_image'][0].filename
            })
            if (addToTableProductImage) {
                res.send({
                    statusMessage: "Add Product Image Success",
                    statusCode: 200
                });
            } else {
                res.send({
                    statusMessage: "Something Wrong",
                    statusCode: 400,
                    data: { isSuccess: false }
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                statusMessage: error.message,
                statusCode: 400,
                data: { isSuccess: false }
            })
        }
    },

    deleteProductImage: async (req,res) => {
        const { productimageID } = req.params;

        try {
            const deleteProductImage = await model.DeleteProductImageModel(productimageID);

            if(deleteProductImage){
                res.send({
                    statusMessage: "Success Delete Product Image",
                    statusCode: 200,
                });
            } else {
                res.send({
                    statusMessage: error.message,
                    statusCode: 400,
                    data: { isSuccess: false },
                });
            }
        } catch (error) {
            res.send({
                statusMessage: error.message,
                statusCode: 400,
                data: { isSuccess: false },
            });
        }
    },

    addConfirmOrderProduct: async (req, res) => {
        const { adminID } = req.admin;
        const {
            transaksiID,
            nama_user,
            no_handphone,
            jmlh_pengiriman,
            tgl_pengiriman,
            deliveryID,
            metode_pengiriman,
            products,
            listProductPackage,
            note
        } = req.body;

        const transaction_code = randomstring.generate({
            length: 5,
            charset: 'ABCDEFGHIJKLMNOPQRZTUVWQYZ1234567890'
        })
        
        try {
            const addToTableTransaksi = await model.confirmOrderProduct({
                transaksiID,
                nama_user,
                no_handphone,
                jmlh_pengiriman,
                tgl_pengiriman,
                metode_pengiriman,
                deliveryID,
                adminID: adminID,
                transaction_code: transaction_code,
                note
            });

            products.forEach(async item => {
                await model.addToDetailTransaksiModel({
                    detail_transaksi_quantity:item.production_quantity,
                    transaksiID:addToTableTransaksi.id,
                    productID:item.productID
                });
                for (var i = 0; i < item.production_quantity; i ++) {
                    await model.addToProductionQueueModel({
                        nama_production_queue:item.nama_product,
                        productID:item.productID,
                        created_at: new Date()
                    });
                }
            });

            listProductPackage.forEach(async item => {
                console.log(item)
                item.product_package_details.forEach(async item_detail => {
                    await model.addToDetailTransaksiModel({
                        detail_transaksi_quantity:item_detail.production_quantity,
                        transaksiID:addToTableTransaksi.id,
                        product_packageID: item_detail.product_packageID,
                        productID:item_detail.productID
                    });
                    for (var i = 0; i < item_detail.production_quantity; i ++) {
                        await model.addToProductionQueueModel({
                            nama_production_queue:item_detail.nama_product,
                            productID:item_detail.productID,
                            created_at: new Date()
                        });
                    }
                });
            })
            
            if(addToTableTransaksi) {
                res.send({
                    statusMessage: "Add Transaction Success",
                    statusCode: 200,
                    });
            } else {
                res.send({
                    statusMessage: "Something Wrong",
                    statusCode: 400,
                    data: { isSuccess: false},
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                statusMessage: error.message,
                statusCode: 400,
                data: { isSuccess: false }
                });
            }
        },

    updateConfirmOrderProduct: async(req, res) => {
        const { transaksiID } = req.params;
        const { jmlh_pengiriman,
                tgl_pengiriman,
                metode_pengiriman
                } = req.body;

        try {
            const updateConfirmOrder = await model.updateConfirmOrderProductModel({
                jmlh_pengiriman,
                tgl_pengiriman,
                metode_pengiriman
            }, transaksiID)

            if (updateConfirmOrder) {
                res.send({
                    statusMessage: "Update Order Success",
                    statusCode: 200,
                });
            } else {
                res.send({
                    statusMessage: "Something Wrong",
                    statusCode: 400,
                    data: { isSuccess: false },
                });
            }
            } catch (error) {
                console.log(error);
                res.send({
                    statusMessage: error.message,
                    statusCode: 400,
                    data: { isSuccess: false }
                    });
            }
    },

    updateProductionQueueDone: async(req, res) => {
        const { productID } = req.params;
        const updated_at = new Date();

        try {
            const ProductionQueue = await model.updateProductionQueueDoneModel(productID, updated_at);

            if(ProductionQueue) {
                res.send({
                    statusMessage: "Update Product Queue Success",
                    statusCode: 200,
                });
            } else {
                res.send({
                    statusMessage: "Something Wrong",
                    statusCode: 400,
                    data: { isSuccess: false },
                });
            }
        } catch (error) {
            res.send({
                statusMessage: error.message,
                statusCode: 400,
                data: { isSuccess: false },
            });
        }
    },

    updateProductionQueueProgressLimit: async(req, res) => {
        const { productID, limit } = req.params;
        const updated_at = new Date();

        try {
            const ProductionQueue = await model.updateProductionQueueProgressLimitModel(productID, limit, updated_at);

            if(ProductionQueue) {
                res.send({
                    statusMessage: "Update Product Queue Success",
                    statusCode: 200,
                });
            } else {
                res.send({
                    statusMessage: "Something Wrong",
                    statusCode: 400,
                    data: { isSuccess: false },
                });
            }
        } catch (error) {
            res.send({
                statusMessage: error.message,
                statusCode: 400,
                data: { isSuccess: false },
            });
        }
    },

    getProductionQueue: async(req, res) => {
        let { search } = req.query;

        try {
            const productionQueue = await model.getProductionQueueListModel(
                search
            );

            if(productionQueue) {
                return res.send({
                    statusMessage: " Get Production Queue Success",
                    statusCode: 200,
                    data: { productionQueue }
                });
            } else {
                return res.send({
                    statusMessage: "Get Production Queue Success",
                    statusCode: 200,
                    data: { productionQueue }
                });
            }
        } catch (error) {
            res.send({
                statusMessage: error.message,
                statusCode: 400,
                data: { isSuccess: false },
            });
        }
    },

    getProductionQueueNotDone: async(req, res) => {
        let { created_at } = req.query;

        created_at = typeof created_at == 'undefined' ? '': created_at

        try {
            const productionQueueNotDone = await model.getProductionQueueStatusNotDoneModel(
                created_at
            )

            if(productionQueueNotDone) {
                return res.send({
                    statusMessage: " Get Production Queue Not Done Success",
                    statusCode: 200,
                    data: { productionQueueNotDone }
                });
            } else {
                return res.send({
                    statusMessage: "Get Production Queue Not Done Success",
                    statusCode: 200,
                    data: { productionQueueNotDone }
                });
            }
        } catch (error) {
            res.send({
                statusMessage: error.message,
                statusCode: 400,
                data: { isSuccess: false },
            });
        }
    },
    
    getCourierList: async (req, res) => {
        let { search } = req.query;

        try {
            const CourierList = await model.getCourierListModel(search)

            if(CourierList) {
                return res.send({
                    statusMessage: "Success",
                    statusCode: 200,
                    data: { CourierList },
                });
            } else {
                return res.send({
                    statusMessage: "Success",
                    statusCode: 200,
                    data: { CourierList },
                });
            }
        } catch (error) {
            res.send({
                statusMessage: error.message,
                statusCode: 400,
                data: { isSuccess: false },
            });
        }
    },

    getOrderDeliveryList: async(req, res) => {
        let { tgl_pengiriman } = req.query;

        tgl_pengiriman = typeof tgl_pengiriman == 'undefined' ? '': tgl_pengiriman

        try {
            const orderDeliveryList = await model.getOrderDeliveryListModel(
                tgl_pengiriman
            );
            const result = await Promise.all(
                orderDeliveryList.map(async (item) => {
                    return {
                        ...item,
                        products: await model.getDetailTransaksiListModel(item.transaksiID)
                    }
                })
            )

            if(orderDeliveryList) {
                return res.send({
                    statusMessage: "Get Order Delivery List Success",
                    statusCode: 200,
                    data: { result }
                });
            } else {
                return res.send({
                    statusMessage: "Get Order Delivery List Success",
                    statusCode: 200,
                    data: { result }
                });
            }
        } catch (error) {
            res.send({
                statusMessage: error.message,
                statusCode: 400,
                data: { isSuccess: false },
            });
        }
    },

    getOrderDeliveryListAll: async(req, res) => {
        let { date_from, date_end } = req.query;

        try {
            const orderDeliveryListAll = await model.getOrderDeliveryListAllModel(
                date_from,
                date_end
            );
            const result = await Promise.all(
                orderDeliveryListAll.map(async (item) => {
                    return {
                        ...item,
                        products: await model.getDetailTransaksiListModel(item.transaksiID)
                    }
                })
            )

            if(orderDeliveryListAll) {
                return res.send({
                    statusMessage: "Get Order Delivery List Success",
                    statusCode: 200,
                    data: { result }
                });
            } else {
                return res.send({
                    statusMessage: "Get Order Delivery List Success",
                    statusCode: 200,
                    data: { result }
                });
            }
        } catch (error) {
            res.send({
                statusMessage: error.message,
                statusCode: 400,
                data: { isSuccess: false },
            });
        }
    },

    updateOrderDeliveryList: async (req, res) => {
        const { transaksiID } = req.params;
        const jam_pengiriman = new Date();

        try {
            const addToTableTransaksi = await model.updateOrderDeliveryListModel(transaksiID, jam_pengiriman);

            if(addToTableTransaksi) {
                res.send({
                    statusMessage: "Update Status Pengiriman Success",
                    statusCode: 200,
                });
            } else {
                res.send({
                    statusMessage: "Something Wrong",
                    statusCode: 400,
                    data: { isSuccess: false },
                });
            }
        } catch (error) {
            res.send({
                statusMessage: error.message,
                statusCode: 400,
                data: { isSuccess: false },
            });
        }
    },

    updateOrderReadyToPickup: async (req, res) => {
        const { transaksiID } = req.params;

        try {
            const addToTableTransaksi = await model.updateOrderIsReadyToPickupModel(transaksiID);

            if(addToTableTransaksi) {
                res.send({
                    statusMessage: "Update Ready to Pickup Success",
                    statusCode: 200,
                });
            } else {
                res.send({
                    statusMessage: "Something Wrong",
                    statusCode: 400,
                    data: { isSuccess: false },
                });
            }
        } catch (error) {
            res.send({
                statusMessage: error.message,
                statusCode: 400,
                data: { isSuccess: false },
            });
        }
    },

    exportToExcelProduct: async (req, res) => {
        const { date_from, date_end } = req.query;

        try {
            const result = await model.exportToTexcelProductModel(
                date_from,
                date_end
            );

            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Excel List Product");

            worksheet.columns = [
                { header: "NAME PRODUCT", key: "nama_product", width: 30 },
                { header: "PRODUCT QUANTITY", key: "detail_transaksi_quantity", width: 30 },
                { header: "IS PACKAGE", key: "is_package", width: 30 },
            ];
            
            //Add Array Rows
            worksheet.addRows(result);

            // res is a Stream object
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );

            res.setHeader(
                "Concent-Disposition",
                "attachment; filename=" + "list_product.xlsx"
            );

            return workbook.xlsx.write(res).then(function () {
                res.send({
                    statusMessage: "Success",
                    statusCode: 200,
                });
                //res.status(200).end();
            });
        } catch (error) {
            res.send({
                statusMessage: error.message,
                statusCode: 400,
                data: { isSuccess: false },
            });
        }
    },
}