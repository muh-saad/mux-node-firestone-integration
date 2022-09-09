const path = require('path'),
  crypto = require('crypto'),
  FieldValue = require('firebase-admin').firestore.FieldValue,
  {addUser, updateUser, videoStats} = require('./validation'),
  firestonedb = require(path.resolve('db/google/firestone'));

// Function to add user to the database
exports.addUser = async (req) => {
  await addUser.validateAsync(req.body);

  const {first_name, last_name, email, quiz_responses} = req.body;

  const data = {
    name: {
      'firstName': first_name,
      'lastName': last_name,
    },
    email: email,
    quizResponses: quiz_responses,
    created_at: FieldValue.serverTimestamp(),
  };

  let uniqueUserID = crypto.createHash('md5').update(email).digest('hex');

  const newUser = firestonedb.collection('users').doc(uniqueUserID);
  await newUser.set(data, {merge: true});

  return {
    user_id: uniqueUserID,
    message: 'User added successfully'
  }
};

// Function to get users from the database
exports.updateUser = async (req) => {
  await updateUser.validateAsync(req.body);

  let {id} = req.params,
    {first_name, last_name, quiz_responses} = req.body;

  const users = firestonedb.collection('users'),
    userData = await users.doc(id).get();

  if (!userData.exists) {
    console.log('No matching user found');
    throw {
      message: 'No user found against the ID',
      statusCode: 404
    };
  }

  const data = {
    name: {
      'firstName': first_name,
      'lastName': last_name,
    },
    quizResponses: quiz_responses,
    updateTimestamp: FieldValue.serverTimestamp(),
  };

  await users.doc(id).update(data);

  console.log('User updated successfully')
  return {
    message: 'User updated successfully'
  };
};

// Function to get users from the database
exports.getUsers = async () => {
  const snapshot = await firestonedb.collection('users').get();

  let users = [];
  snapshot.docs.forEach(doc => {
    let user = doc.data();
    user.id = doc.id;
    users.push(user);
  });

  return users;
  //return snapshot.docs.map(doc => doc.data());
};

exports.calculateRecommendation = async () => {
  console.log('Code for calculating recommendations');
};

exports.addVideoStats = async (req) => {
  await videoStats.validateAsync(req.body);

  const {user_id, video_id, duration, sensor_data} = req.body;

  const data = {
    videoId: video_id,
    duration: duration,
    ...(sensor_data !== undefined && {sensorData: sensor_data})
  };

  const newUserVideoStat = firestonedb.collection('usersVideoStats').doc(user_id).collection(video_id).doc();
  await newUserVideoStat.set(data);

  return {
    message: 'Video stats added successfully'
  }
}
