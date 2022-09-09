const Router = require('express').Router;
const router = new Router();
const {
  getVideoCategory,
  getVideoDetail
} = require('./handler');

// Get all videos against a category
// GET: /video/category
router.get('/category', async (req, res, next) => {
  getVideoCategory(req)
    .then(response => res.send(response))
    .catch(err => next(err));
});

// Get details against a video
// GET: /video/:id
router.get('/:id', async (req, res, next) => {
  getVideoDetail(req)
    .then(response => res.send(response))
    .catch(err => next(err));
});

module.exports = router;
