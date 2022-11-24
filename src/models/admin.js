const db = require("../configs/db");

module.exports = {
        //login admin
        checkAuthAdminModel: (email) => {
            return new Promise((resolve, reject) => {
                db.query("SELECT * FROM admin WHERE email = ?", email, (error, result) => {
                    if (!error) {
                        resolve(result);
                    } else {
                    reject(new Error(error));
                    }
                }
                );
            });
        },
    
        //is_active
        isActiveModel: (email) => {
            return new Promise((resolve, reject) => {
                db.query(`UPDATE admin SET is_active = 1 WHERE email = ?`, email, (error, result) => {
                    if (!error) {
                        resolve(result);
                    } else {
                    reject(new Error(error));
                    }
                });
            });
        },
    
        //is_notactive
        isNotActiveModel: (adminID) => {
            return new Promise((resolve, reject) => {
                db.query(`UPDATE admin SET is_active = 0 WHERE adminID = '${adminID}'`, (error, result) => {
                    if (!error) {
                        resolve(result);
                    } else {
                        reject(new Error(error));
                    }
                });
            });
        },
    
        //logout admin
        logoutAdminModel: (randToken, adminID) => {
            return new Promise((resolve, reject) => {
                db.query(`UPDATE admin SET session_token = ? WHERE adminID = ?`, [randToken, adminID] , (error, result) => {
                    if (!error) {
                        resolve(result);
                    } else {
                    reject(new Error(error));
                    }
                }
                );
            })
        },

        addToTableProductModel: (setData) => {
            return new Promise((resolve, reject) => {
                db.query("INSERT INTO product SET ?", setData, (error, result) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        const newResult = {
                            id: result.insertId,
                            ...setData,
                        };
                        resolve(newResult);
                    }
                });
            });
        },
        
        updateDataProductModel: (body, productID) => {
            return new Promise((resolve, reject) => {
                db.query(`UPDATE product SET ? WHERE productID = '${productID}'`, body, (err, result, _field) => {
                    if(err) {
                        reject(new Error(err));
                    } else {
                        resolve(result);
                    }
                });
            });
        },
    
        deleteDataProductModel: (productID) => {
            return new Promise((resolve, reject) => {
                db.query(`DELETE FROM product WHERE productID = '${productID}'`, (err, result, _field) => {
                    if(err) {
                        reject(new Error(err));
                    } else {
                        resolve(result);
                    }
                });
            });
        },
    
        getDataListProductModel: () => {
            return new Promise((resolve, reject) => {
                let queryDataProduct = `SELECT product.productID, product.nama_product, product.harga_product, product.jenis_product, product.isi_product, product_image.product_image_url
                FROM product
                INNER JOIN product_image
                ON product.productID = product_image.productID;`;
                db.query(queryDataProduct, (error, result) => {
                    if(error) {
                        reject(new Error(error));
                    } else {
                        resolve(result);
                    }
                });
            });
        },
    
        getDataListProductPackageDetailByPakacgeIDModel: (packageId) => {
            return new Promise((resolve, reject) => {
                let queryDataProduct = `SELECT * FROM product_package_detail 
                inner join product on product_package_detail.productID = product.productID 
                inner join product_image on product_image.productID = product.productID
                where product_package_detail.product_packageID = ?`;
                db.query(queryDataProduct, packageId, (error, result) => {
                    if(error) {
                        reject(new Error(error));
                    } else {
                        resolve(result);
                    }
                });
            });
        },
    
        getDataListProductPackageModel: () => {
            return new Promise((resolve, reject) => {
                let queryProductPackage = `SELECT * FROM product_package`;
                db.query(queryProductPackage, (error, result) => {
                    if(error) {
                        reject(new Error(error));
                    } else {
                        resolve(result);
                    }
                });
            });
        },
    
        addToTableProductImageModel: (setData) => {
            return new Promise((resolve, reject) => {
                db.query('INSERT INTO product_image SET ?', setData, (error, result) => {
                    if (error) {
                        reject(new Error(error))
                    } else {
                        const newResult = {
                            id: result.insertId,
                            ...setData
                        }
                        resolve(newResult)
                    }
                });
            });
        },
    
        DeleteProductImageModel: (productimageID) => {
            return new Promise((resolve, reject) => {
                db.query(`DELETE FROM product_image WHERE productimageID = '${productimageID}'`, (err, result, _field) => {
                    if(err) {
                        reject(new Error(err));
                    } else {
                        resolve(result);
                    }
                });
            });
        },

        getCourierListModel: () => {
            return new Promise((resolve, reject) => {
                db.query(`SELECT nama_delivery, deliveryID FROM delivery`, (error, result) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(result);
                    }
                })
            })
        },
        
        getOrderDeliveryListModel: (tgl_pengiriman) => {
            return new Promise((resolve, reject) => {
                let queryOrderDeliveryList = `
                SELECT transaksi.transaksiID, transaksi.nama_user, transaksi.no_handphone, 
                transaksi.metode_pengiriman, transaksi.deliveryID, transaksi.tgl_pengiriman, transaksi.status_pengiriman, transaksi.jam_pengiriman, transaksi.transaction_code, note
                FROM transaksi
                INNER JOIN delivery on delivery.deliveryID = transaksi.deliveryID
                WHERE transaksi.status_pengiriman != 'Done' AND transaksi.tgl_pengiriman LIKE '${tgl_pengiriman}%'
                ORDER BY delivery.priority
                ASC`;
                // ORDER BY FIELD (transaksi.metode_pengiriman, "GOJEK-INSTANT", "GOJEK-SAMEDAY", "Courier", "Lalamove", "Paxel");`;
                db.query(queryOrderDeliveryList, (error, result) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(result);
                    }
                });
            });
        },
    
        getOrderDeliveryListAllModel: (date_from, date_end, status_pengiriman) => {
            return new Promise((resolve, reject) => {
                let queryOrderDeliveryListAllFilter = `
                SELECT * FROM transaksi`;
    
                if (typeof date_from === "undefined" && typeof date_end === "undefined") {
                    queryOrderDeliveryListAllFilter += ` WHERE transaksi.tgl_pengiriman BETWEEN DATE_SUB(NOW(),INTERVAL 1 WEEK) and NOW()`;
                } else {
                    queryOrderDeliveryListAllFilter += ` WHERE transaksi.tgl_pengiriman BETWEEN '${date_from}' AND '${date_end}'`
                }
    
                queryOrderDeliveryListAllFilter += ` ORDER BY transaksi.transaksiID DESC`
    
                db.query(queryOrderDeliveryListAllFilter, (error, result) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(result);
                    }
                });
            });
        },

        confirmOrderProduct: (setData) => {
            return new Promise((resolve, reject) => {
                db.query(`INSERT INTO transaksi SET ?`, setData, (error,result) => {
                    if (error) {
                        reject(new Error(error))
                    } else {
                        const newResult = {
                            id: result.insertId,
                            ...setData
                        }
                        resolve(newResult)
                    }
                });
            });
        },
        
        addToDetailTransaksiModel:(product) => {
            return new Promise((resolve, reject) => {
                db.query(`INSERT INTO detail_transaksi SET ?`, product, (error, result) => {
                    if (error) {
                        reject(new Error(error))
                    } else {
                        const newResult = {
                            id: result.insertId,
                            ...product
                        }
                        resolve(newResult)
                    }
                })
            })
        },
        
        updateConfirmOrderProductModel: (body, transaksiID) => {
            return new Promise((resolve, reject) => {
                db.query(`UPDATE transaksi SET ? WHERE transaksiID = '${transaksiID}'`, body, (err, result, _field) => {
                    if(err) {
                        reject(new Error(err));
                    } else {
                        resolve(result);
                    }
                });
            });
        },
    
        getDetailTransaksiListModel: (transaksiID) => {
            return new Promise((resolve, reject) => {
                let detailTransaksiList = `
                SELECT detail_transaksi.detail_transaksiID, detail_transaksi.is_package, product_package.nama_product_package,
                detail_transaksi.detail_transaksi_quantity as quantity, detail_transaksi.product_packageID, product.productID, product.nama_product 
                FROM detail_transaksi 
                INNER JOIN product ON product.productID = detail_transaksi.productID 
                LEFT JOIN product_package ON detail_transaksi.product_packageID = product_package.product_packageID
                WHERE detail_transaksi.transaksiID = ?`;
                db.query(detailTransaksiList, transaksiID, (error, result) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(result);
                    }
                });
            });
        },
    
        exportToTexcelProductModel: (date_from, date_end) => {
            return new Promise((resolve, reject) => {
                let queryToExcelProduct = `SELECT transaksi.nama_user, transaksi.no_handphone, transaksi.jmlh_pengiriman, transaksi.tgl_pengiriman, transaksi.metode_pengiriman,
                product.nama_product, 
                detail_transaksi.is_package, detail_transaksi.detail_transaksi_quantity
                FROM transaksi
                INNER JOIN detail_transaksi ON detail_transaksi.transaksiID = transaksi.transaksiID
                INNER JOIN product ON product.productID =  detail_transaksi.productID;`;
    
                if(typeof date_from !== "undefined" && typeof date_end !== "undefined") {
                    queryToExcelProduct += `AND date_format(production_queue.created_at, "%Y-%m-%d") BETWEEN '${date_from}' AND '${date_end}'`;
                }
    
                db.query(queryToExcelProduct, (error, result) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(result);
                    }
                });
            });
        },

        addToProductionQueueModel:(product) => {
            return new Promise((resolve, reject) => {
                db.query(`INSERT INTO production_queue SET ?`, product, (error, result) => {
                    if (error) {
                        reject(new Error(error))
                    } else {
                        const newResult = {
                            id: result.insertId
                        }
                        resolve(newResult)
                    }
                });
            });
        },
    
        updateProductionQueueProgressLimitModel: (productID, limit, updated_at) => {
            return new Promise((resolve, reject) => {
                db.query(`UPDATE production_queue SET status_production_queue = 'Done', updated_at = ? WHERE productID = '${productID}' AND status_production_queue = 'Waiting' LIMIT ${limit}`, updated_at, (error, result, _field) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(result);
                    }
                });
            });
        },
        
        updateProductionQueueDoneModel: (productID, updated_at) => {
            return new Promise((resolve, reject) => {
                db.query(`UPDATE production_queue SET status_production_queue = 'Done', updated_at = ? WHERE productID = '${productID}'`, updated_at, (error, result, _field) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(result);
                    }
                });
            });
        },
        
        getProductionQueueListModel: () => {
            return new Promise((resolve, reject) => {
                let queryProductionQueue = `SELECT nama_production_queue, SUM(nama_production_queue + 1)as total_quantity 
                FROM production_queue 
                GROUP BY status_production_queue, productID
                ORDER BY updated_at ASC;`;
                db.query(queryProductionQueue, (error, result) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(result);
                    }
                });
            });
        },
        
        getProductionQueueStatusNotDoneModel: (created_at) => {
            return new Promise((resolve, reject) => {
                let queryProductionQueueStatusNotDone = `SELECT 
                production_queue.production_queueID, 
                production_queue.nama_production_queue, 
                SUM(production_queue.nama_production_queue + 1)as total_quantity, 
                production_queue.status_production_queue, 
                production_queue.productID
                FROM production_queue 
                WHERE production_queue.status_production_queue != 'Done' AND production_queue.created_at LIKE '${created_at}%'
                GROUP BY productID;`
                db.query(queryProductionQueueStatusNotDone, (error, result) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(result);
                    }
                });
            });
        },
    
        updateOrderDeliveryListModel: (transaksiID, jam_pengiriman) => {
            return new Promise((resolve, reject) => {
                db.query(`UPDATE transaksi SET status_pengiriman = 'Done', jam_pengiriman = ? WHERE transaksiID = '${transaksiID}'`, jam_pengiriman, (error, result) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(result);
                    }
                });
            });
        },
    
        updateOrderIsReadyToPickupModel: (transaksiID) => {
            return new Promise((resolve, reject) => {
                db.query(`UPDATE transaksi SET status_pengiriman = 'Ready', ready_to_pickup = 1 WHERE transaksiID = '${transaksiID}'`, (error, result) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(result);
                    }
                });
            });
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
    
                console.log(result)
    
                return workbook.xlsx.write(res).then(function () {
                    res.send({
                        statusMessage: "Success",
                        statusCode: 200,
                    });
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