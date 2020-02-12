import firebase from '../../db';
import {
  BAR_CODE,
  DESCRIPTION,
  PRICE,
  DEFERRED_PRICE,
  CODE,
  ACTIVE_INGREDIENT,
  MANUFACTURER,
  UNIT
} from '../../constants/xlsFileColumns';
import { MAXIMUM_POST_SIZE } from '../../constants/firebase.config';

const arrayToJsonObjectWithUid = ({ products }) =>
  products.reduce((obj, item) => {
    if (item[CODE]) {
      return {
        ...obj,
        [item[CODE]]: {
          code: item[CODE],
          barCode: item[BAR_CODE], // TODO NOT NUMBER
          description: item[DESCRIPTION],
          price: item[PRICE],
          deferredPrice: item[DEFERRED_PRICE],
          activeIngredient: item[ACTIVE_INGREDIENT],
          manufacturer: item[MANUFACTURER],
          unit: item[UNIT]
        }
      };
    }
    return { ...obj };
  }, {});

export const addProducts = async products => {
  for (let i = 0; i < Math.ceil(products.length / MAXIMUM_POST_SIZE); i += 1) {
    const indexToStartExtraction = i * MAXIMUM_POST_SIZE;
    const sizeOfExtraction = indexToStartExtraction + MAXIMUM_POST_SIZE;
    const extractedProducts = products.slice(indexToStartExtraction, sizeOfExtraction);
    const ref = firebase.ref('products');
    const normalizedPostData = arrayToJsonObjectWithUid({ products: extractedProducts, ref });

    // eslint-disable-next-line no-await-in-loop
    await ref.update(normalizedPostData);
    console.log(`Adding ${extractedProducts.length} products`);
  }
  return true;
};

export const getAllProducts = () =>
  new Promise(resolve => {
    firebase.ref('/products/').once('value', snap => resolve(snap.val()));
  });

export const getProductByBarCode = barCode =>
  new Promise((resolve, reject) => {
    firebase
      .ref('products')
      .orderByChild('barCode')
      .equalTo(`${barCode}`)
      .once('value', snap => resolve(snap.val()))
      .catch(() => reject());
  });
