const Router = require('express').Router;
const router = new Router();
const {
  addUser,
  updateUser,
  calculateRecommendation,
  addVideoStats
} = require('./handler');

// Get all users from DB
// GET: /user
/*router.get('/', async (req, res) => {
  res.send(await getUsers());
});*/

// Add a user to DB
// POST: /user
router.post('/', async (req, res, next) => {
  addUser(req)
    .then(response => {
      res.locals.userResponse = response;
      next();
    })
    .catch(err => next(err));
}, async (req, res, next) => {
  await calculateRecommendation()
  res.send(res.locals.userResponse);
});

// Update details for a user
// PUT: /user/:id
router.put('/:id', async (req, res, next) => {
  updateUser(req)
    .then(response => res.send(response))
    .catch(err => next(err));
});

// Add video stats for a user
// POST: /user
router.post('/video/stats', async (req, res, next) => {
  addVideoStats(req)
    .then(response => res.send(response))
    .catch(err => next(err));
});

module.exports = router;
