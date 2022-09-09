require('dotenv').config();

const path = require('path'),
  crypto = require('crypto'),
  Mux = require('@mux/mux-node'),
  {addingVideo} = require('./validation'),
  FieldValue = require('firebase-admin').firestore.FieldValue,
  firestonedb = require(path.resolve('db/google/firestone'));

const accessToken = process.env.MUX_TOKEN_ID,
  accessSecret = process.env.MUX_TOKEN_SECRET,
  {Video} = new Mux(accessToken, accessSecret);

exports.addVideo = async (req) => {
  await addingVideo.validateAsync(req.body);

  const {url, title, sub_title, category, instructor} = req.body,
    uniqueURLId = crypto.createHash('md5').update(url).digest('hex'),
    videos = firestonedb.collection('videos').doc(uniqueURLId);

  // We can also create a structure based on categories, but it will be more complex
  // const newVideo = firestonedb.collection('library').doc(category).collection('videos').doc(title);

  const video = await videos.get();

  if (video.exists) {
    console.log('>>> Video already exists');
    throw {
      message: 'Video url already exists',
      statusCode: 409
    };
  }

  // Create an asset in MUX
  const asset = await Video.Assets.create({
    input: url,
  });

  // Creating a playback ID for that asset
  const playbackId = await Video.Assets.createPlaybackId(asset.id, {
    policy: 'public',
  });

  const data = {
    'url': url,
    'category': category,
    'title': title,
    'subTitle': sub_title,
    ...(instructor !== undefined && {'instructor': instructor}),
    'assetId': asset.id,
    'playbackId': playbackId.id,
    'status': 'pb_id_generated',
  };

  await videos.set(data);

  return {
    video_id: uniqueURLId,
    message: 'Video added successfully'
  }
}

exports.getVideoStats = async (req) => {
  const {type: eventType, data: eventData} = req.body;

  switch (eventType) {
    case 'video.asset.created': {
      // This means an Asset was successfully created! We'll get
      // the existing item from the DB first, then update it with the
      // new Asset details

      // const item = await db.get(eventData.passthrough);
      // Just in case the events got here out of order, make sure the
      // asset isn't already set to ready before blindly updating it!
      /*if (item.asset.status !== 'ready') {
        await db.put(item.id, {
          ...item,
          asset: eventData,
        });
      }*/
      console.info('>>> ASSET CREATED')
      break;
    }
    case 'video.asset.ready': {
      // This means an Asset was successfully created! This is the final
      // state of an Asset in this stage of its lifecycle, so we don't need
      // to check anything first.

      console.info('>>> ASSET READY')

      try {
        const videos = firestonedb.collection('videos');

        const videoData = await videos.where('assetId', '==', eventData.id).get();

        if (videoData.empty) {
          console.log('No matching video.');
          return;
        }

        const doc_id = videoData.docs.map(doc => doc.id);

        const data = {
          updateTimestamp: FieldValue.serverTimestamp(),
          'status': 'ready',
          'muxData': eventData
        };

        await videos.doc(doc_id[0]).update(data);

        console.log('Mux meta_data updated successfully')
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
      break;
    }
    case 'video.upload.cancelled': {
      // This fires when you decide you want to cancel an upload, so you
      // may want to update your internal state to reflect that it's no longer
      // active.

      /*const item = await db.findByUploadId(eventData.passthrough);
      await db.put(item.id, {...item, status: 'cancelled_upload'});*/
      break;
    }
    default: {
      // Mux sends webhooks for *lots* of things, but we'll ignore those for now
      console.log('Some other event!', eventType, eventData);
    }
  }

  return true;
}

// Test function for getting video details from DB
/*exports.getVideo = async () => {
  try {
    const videos = firestonedb.collection('videos');

    const videoData = await videos.where('playbackId', '==', 'playback_id').get();

    if (videoData.empty) {
      console.log('No matching videos.');
      return;
    }

    return videoData.docs.map(doc => doc.data());
  } catch (e) {
    return {
      message: e.message
    };
  }
}*/
