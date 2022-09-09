const path = require('path'),
  {videoDetail, videoCategory} = require('./validation'),
  firestonedb = require(path.resolve('db/google/firestone'));

// Function for getting details against a video
exports.getVideoDetail = async (req) => {

  await videoDetail.validateAsync(req.params);

  const {id} = req.params;

  const videoData = await firestonedb.collection('videos').doc(id).get();

  if (!videoData.exists) {
    console.log('No video found against the id provided');

    throw {
      message: 'Invalid video id provided',
      statusCode: 404
    };
  }

  return videoData.data();
}

// Function for getting videos against a category
exports.getVideoCategory = async (req) => {
  await videoCategory.validateAsync(req.query);

  const {category} = req.query,
    videosDB = firestonedb.collection('videos');

  const videoData = await videosDB.where('category', '==', category).get();

  if (videoData.empty) {
    console.log('No matching videos.');
    throw {
      message: 'No videos found in this category',
      statusCode: 404
    };
  }

  let videos = [];
  videoData.docs.forEach(doc => {
    let video = doc.data();
    video.id = doc.id;
    videos.push(video);
  });

  return videos;
  // return videoData.docs.map(doc => doc.data());
}
