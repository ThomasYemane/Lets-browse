const router = require('express').Router();
const { restoreUser } = require('../../utils/auth');

const sessionRouter = require('./session');
const usersRouter = require('./users');
const productsRouter = require('./products');
const categoriesRouter = require('./categories');
const reviewsRouter = require('./reviews'); //my review is not mounted in API - issue is fixed now
const wishlistRouter = require('./wishlist');
const cartRouter = require('./cart');

router.use(restoreUser);

router.post('/test', (req, res) => res.json({ requestBody: req.body }));

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);
router.use('/reviews', reviewsRouter);
router.use('/wishlist', wishlistRouter);
router.use('/cart', cartRouter);

module.exports = router;
