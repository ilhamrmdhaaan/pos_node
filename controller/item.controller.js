const { Item, Category } = require("../models/index")
const { Op } = require("sequelize");
const path = require("path");
const multer = require("multer");



const getItem = async (req, res) => {
    const response = {};

    const where = {};
    const { page, size } = req.query;

    if (typeof req.query.id !== 'undefined'){
        where.id = req.query.id;
    }

    if(typeof req.query.name !=='undefined'){
        where.name = {
            [Op.like] : `%${req.query.name}%`
        };
    }

    if(typeof req.query.code !== 'undefined'){
        where.code = {
            [Op.like] : `%${req.query.code}%`
        };
    }

    if(typeof req.query.category !== 'undefined'){
        where.category_id = req.query.category;
    }

    const { limit, offset } = getPagination(page, size);

    try{
    
        const item = await Item.findAndCountAll({
            attributes: ['id', 'code', 'name', 'unit', 'base_price', 'sell_price', 'stock', 'thumbnail'],
            where,
            limit,
            offset,
        });

        response.code = 200;
        response.data = getPagingData(item, page, limit);

    }catch(error){
        response.code = 500;
        response.error = error;

        res.status(response.code);
    };

    res.json(response);
    
}

const checkItem = async (req, res, next) => {

    const response = {
        code: 200,
        result: false,
        message: 'Invalid or unexisted item ID'
    };

    try{
        const item = await Item.count({
            where: {
                id : req.params.id
            }
        });

        if (item > 0) {
            response.code = 200;
            response.result = true;
            response.message = '';
        }

    }catch(error){
        response.code = 500;
        response.result = false;
        response.message = error;
    
    };

    res.locals.response = response;
    return;
}

const showItem = async (req, res) => {

    const response = {};

    try{
        const data = await Item.findOne({
            attributes: ['id', 'code', 'name', 'unit', 'base_price', 'sell_price', 'stock', 'thumbnail'],
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                }
            ],
            where: {
                id: req.params.id
            },
        });

        response.code = 200;
        response.data = {
            totalItems: 1,
            rows: data
        };

        
    } catch (error){
        response.code = 500;
        response.msg = {
            error: error
        };
    };



    res.status(response.code).json(response);
}

const createItem = async (req, res) => {

    const response = {};

    try{
        const item = await Item.create({
            code: Math.round((Math.pow(36, 9 + 1) - Math.random() * Math.pow(36, 9))).toString(36).slice(1),
            name: req.body.item_name,
            unit: req.body.unit,
            basePrice: req.body.base_price || 0,
            sellPrice: req.body.sell_price || 0,
            stock: req.body.stock || 0,
            categoryId: req.body.category
        });

        response.code = 200;
        response.data = {
            id: item.id,
            code: item.code
        }

    }catch(error){
        response.code = 500;
        response.message = error;
    }

    res.status(response.code).json(response).end();
}

const updateItem = async (req, res) => {

    const response = {};

    try {

        const item = await Item.update(
            {
                name: req.body.item_name,
                unit: req.body.unit,
                basePrice: req.body.base_price || 0,
                sellPrice: req.body.sell_price || 0,
                stock: req.body.stock || 0,
                categoryId: req.body.category
            },
            {
                where: {
                    id: req.params.id,
                    
                },
            }
        );

        console.log(item)

        response.code = 200;
        response.updated = item
        
    } catch (error) {
        response.code = 500;
        response.message = error;
    }

    res.status(response.code).json(response).end();

}

const destroyItem = async (req, res) => {

    const response = {};

    try{
        const data = await Item.destroy({
            where: {
                id: req.params.id
            }
        });
        response.code = 200;
    }catch(error){
        response.code = 500;
        response.message = error;
    };

    res.status(response.code).json(response).end();

}

const uploadThumbnail = async(req, res) => {
    
    try {
        
        let encName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        let uploadDir = '/uploads';
        let relPath = path.join(__dirname, '../public'+uploadDir);

        const whitelist = [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/webp',
            'image/gif',
        ]


        let storage = multer.diskStorage({
            destination: function(req, file, cb){
                cb(null, relPath);
            },
            filename: function(req, file, cb){
                encName += path.extname(file.originalname);
                cb(null, encName);
            }
        });

        let limits = {
            fileSize : 1 * 1000 * 1000
        }

        let fileFilter = (req, file, cb) => {

            if(!whitelist.includes(file.mimetype)){
                return cb(new Error('Only accept image file type'), false);
            }            

            cb(null, true);
        }

        let upload = multer({storage, limits, fileFilter}).single('thumbnail');
        upload(req, res, async function(err){

            console.log(req.body);

            if(req.body.thumbnail === ''){
                return res.status(500).json({ code: 401, message: { error: "File cannot be empty" } }).end();
            }

            if(err){
                return res.status(500).json({ code: 401, message: { error: err.message } }).end();
            }            
            
            let imgPath = 'http:://localhost:3000'+uploadDir + '/' + encName;
            await Item.update(
                {
                    thumbnail: imgPath,
                },
                {
                    where: {
                        id: req.params.id
                    }
                }
            );

            return res.status(200).json({
                code: 200, data: {
                    item_id: req.params.id,
                    thumbnail: imgPath
                }
            }).end();
        });

    } catch (error) {
        return res.status(500).json({code: 500, message: error.message}).end();
    }

}

const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page > 1 ? (page-1) * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows } = data;
    const currentPage = page > 1 ? +page : 1;
    
    const totalPages = Math.ceil(totalItems / limit);
    

    return { totalItems, rows, totalPages, currentPage };
};

module.exports = {
    getItem,
    showItem,
    createItem,
    updateItem,
    destroyItem,
    checkItem,
    uploadThumbnail
}