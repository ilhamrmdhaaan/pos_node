const { Category } = require('../models/index');
const { Op } = require("sequelize");

const getCategory = async(req, res) => {

    const response = {};

    try {

        const where = {};

        if (typeof req.query.id !== 'undefined') {
            where.id = req.query.id;
        }

        if (typeof req.query.name !== 'undefined'){
            where.name = {
                [Op.like]: `%${req.query.name}%`
            };
        }

        const category = await Category.findAll({
            attributes: ['id', 'name'],
            where,
        });

        response.code = 200;
        response.data = category;

    
    } catch (error) {
        
        response.code = 500;
        response.error = error;

        res.status(500);

    }
    
    res.json(response);
}

module.exports = {
    getCategory
}