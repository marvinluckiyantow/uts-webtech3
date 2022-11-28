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
        
        getOrderDeliveryListModel: (tgl_pengiriman) => {
            return new Promise((resolve, reject) => {
                let queryOrderDeliveryList = `
                SELECT transaksi.transaksiID, transaksi.nama_user, transaksi.no_handphone, transaksi.tgl_pengiriman, transaksi.status_pengiriman, transaksi.transaction_code, note
                FROM transaksi
                WHERE transaksi.status_pengiriman != 'Done' AND transaksi.tgl_pengiriman LIKE '${tgl_pengiriman}%'`;
                db.query(queryOrderDeliveryList, (error, result) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(result);
                    }
                    console.log(queryOrderDeliveryList)
                });
            });
        },

        getDetailTransaksiListModel: (transaksiID) => {
            return new Promise((resolve, reject) => {
                let detailTransaksiList = `
                SELECT detail_transaksi.detail_transaksiID,
                detail_transaksi.detail_transaksi_quantity as quantity, product.productID, product.nama_product 
                FROM detail_transaksi 
                INNER JOIN product ON product.productID = detail_transaksi.productID 
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
    
        getOrderDeliveryListAllModel: (date_from, date_end) => {
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
    

    
        exportToTexcelProductModel: (date_from, date_end) => {
            return new Promise((resolve, reject) => {
                let queryToExcelProduct = `SELECT transaksi.nama_user, transaksi.no_handphone, transaksi.tgl_pengiriman,
                product.nama_product, 
                detail_transaksi.detail_transaksi_quantity
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
    
        updateOrderDeliveryListModel: (transaksiID) => {
            return new Promise((resolve, reject) => {
                db.query(`UPDATE transaksi SET status_pengiriman = 'Done' WHERE transaksiID = '${transaksiID}'`, (error, result) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(result);
                    }
                });
            });
        },
}