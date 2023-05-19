const router = require("express").Router();
const itemController = require("../../controller/item.controller");

router.param('id', async function (req, res, next, id) {
    await itemController.checkItem(req, res, next);

    if(!res.locals.response.result){
        return res.status(res.locals.response.code).json(res.locals.response).end();
    }

    next();
});

router.post('/item/:id/upload-thumbnail', (req, res) => {
    itemController.uploadThumbnail(req, res);
});

router.route('/item/:id')
    .get((req, res) => {
        itemController.showItem(req, res);
    })
    .put((req, res) => {
        itemController.updateItem(req, res);
    })
    .delete((req, res) => {
        itemController.destroyItem(req, res);
    });


router.get('/item', itemController.getItem);

router.post('/item', itemController.createItem);


module.exports = router;