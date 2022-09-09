const Router = require('express').Router;

const userRouter = require('./user/router'),
  muxRouter = require('./mux/router'),
  videoRouter = require('./video/router');

const router = new Router();

router.use('/user', userRouter);
router.use('/video', videoRouter);
router.use('/mux', muxRouter);

module.exports = router;
