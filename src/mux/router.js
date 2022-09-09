const Router = require('express').Router;
const router = new Router();
const {
  getVideo,
  addVideo,
  getVideoStats
} = require('./handler');

/*router.get('/video', async (req, res) => {
  res.send(await getVideo(req));
});*/

router.post('/video', async (req, res, next) => {
  addVideo(req)
    .then(response => res.send(response))
    .catch(err => next(err));
});

router.post('/video/stats', async (req, res) => {
  res.send(await getVideoStats(req));
});

module.exports = router;
