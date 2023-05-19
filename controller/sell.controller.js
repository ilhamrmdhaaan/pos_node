const { Sell, Sell_detail, sequelize, Item } = require("../models/index");
const { Op } = require("sequelize");

const showSell = async (req, res) => {

    const response = {};

    try {
        
        const data = await Sell.findOne({
            attributes: [
                'id',
                'sell_code',
                'subtotal',
                'discount',
                'discount_percent',
                'tax',
                'tax_percent',
                'grand_total',
                'payment_method',
                'pay_amount',
                'change_amount'
            ],
            include: [
                {
                    model: Sell_detail,
                    as: 'sell_details',
                    attributes: [
                        'id',
                        'qty',
                        'base_price',
                        'sell_price',
                        'subtotal',
                        'total'
                    ],
                    include: [
                        {
                            model: Item,
                            as: 'item',
                            attributes: [
                                'id',
                                'name',
                                'unit'
                            ]
                        }
                    ]
                }
            ],
            where: {
                id: req.params.id
            }
        });

        response.code = 200;
        response.data = data;
        
    } catch (error) {
        response.code = 500;
        response.message = error;
    }

    res.status(response.code).json(response).end();
}

const listSell = async(req, res) => {

    const response = {};
    const where = {};
    const { page, size } = req.query;

    if (typeof req.query.id !== 'undefined') {
        where.id = req.query.id;
    }

    if (typeof req.query.code !== 'undefined') {
        where.sell_code = {
            [Op.like]: `%${req.query.code}%`
        };
    }

    if (typeof req.query.sell_date !== 'undefined') {
        let sDate = new Date(req.query.sell_date);
        where.sell_date = sDate.toISOString().split('T')[0]
    }

    const { limit, offset } = getPagination(page, size);

    try {

        const data = await Sell.findAndCountAll({
            attributes: [
                'id', 
                'sell_code', 
                'sell_date', 
                'subtotal',
                'discount',
                'discount_percent',
                'tax',
                'tax_percent',
                'grand_total',
                'payment_method',
                'pay_amount',
                'change_amount'
            ],
            where,
            limit,
            offset
        });
        
        response.code = 200;
        response.data = getPagingData(data, page, limit);
    } catch (error) {
        response.code = 500;
        response.message = error;
    }

    res.status(response.code).json(response).end();

}

const createSell = async (req, res) => {

    const response = {};
    const sellDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const data = req.body;

    // prepare transaction
    const t = await sequelize.transaction();
    const options = { transaction: t}


    try {

        const sellMaster = await Sell.create({
            sellCode: Math.round((Math.pow(36, 13 + 1) - Math.random() * Math.pow(36, 13))).toString(36).slice(1),
            sellDate: sellDate,
            subtotal: data.subtotal,
            discount: data.discount || 0,
            discountPercent: data.discount_percent || 0,
            tax: data.tax || 0,
            taxPercent: data.tax_percent || 0,
            grandTotal: data.grand_total,
            paymentMethod: data.payment_method,
            payAmount: data.pay_amount,
            changeAmount: data.change_amount,
        }, options);

        let details = [];

        data.item_id.forEach((el, i) => {
            details = [
                ...details,
                {
                    sellId: sellMaster.id,
                    itemId: data.item_id[i],
                    qty: data.qty[i],
                    basePrice: data.base_price[i],
                    sellPrice: data.sell_price[i],
                    subtotal: data.detail_subtotal[i],
                    total: data.total[i],
                }
            ]
        });


        const sellDetail = await Sell_detail.bulkCreate(details, {...options, validate: true});


        await t.commit();

        response.code = 200;
        response.data = {
            id: sellMaster.id
        }

    } catch (error) {

        await t.rollback();

        response.code = 500;
        response.message = error;
    }

    res.status(response.code).json(response).end();
}

const checkSell = async (req, res, next) => {

    const response = {
        code: 200,
        message: 'Invalid or unexisted ID'
    };

    try {

        const sell = await Sell.count({
            where: {
                id: req.params.id
            }
        })

        if(sell > 0){
            return next();
        }
        
    } catch (error) {
        response.code = 500;
        response.message = error;
    }

    return res.status(response.code).jsOn(response).end();
}

const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page > 1 ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows } = data;
    const currentPage = page > 1 ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, rows, totalPages, currentPage };
};

module.exports = {
    createSell,
    listSell,
    showSell,
    checkSell
};