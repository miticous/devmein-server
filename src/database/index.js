import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://mamsolutions:covOOtsEhpIM7pFA@jintou-dev-id1v2.gcp.mongodb.net';

export const getAll = collection =>
  new Promise((resolve, reject) => {
    MongoClient.connect(uri, (err, res) => {
      if (err) {
        return reject();
      }

      return res
        .db('sample_mflix')
        .collection(collection)
        .find({})
        .toArray((error, data) => {
          if (!error) return resolve(data);
          return reject();
        });
    });
  });
