const router = require("express").Router();
const sellController = require("../../controller/sell.controller");

router.param('id', async function(req, res, next, id){
    await sellController.checkSell(req, res, next);
})

router.route('/sell/:id')
    .get((req, res) => {
        sellController.showSell(req, res);
    })

router.get('/sell', sellController.listSell);
router.post('/sell', sellController.createSell);

module.exports = router;