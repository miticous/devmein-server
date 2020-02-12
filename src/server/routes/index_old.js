import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import XLSX from 'xlsx';
import { addProducts, getAllProducts, getProductByBarCode } from '../services/index_old';
import { ADD_PRODUCTS_FAILED } from '../../constants/errorMessages';

const router = express.Router();

router.use(cors());
router.use(fileUpload());

router.post('/products/upload/', async (req, res) => {
  try {
    const { data } = req.files.fileName;

    if (!data) {
      throw new Error();
    }
    const workbook = XLSX.read(data, { type: 'buffer' });
    const dataToJson = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
      raw: true
    });

    const isProductsAdded = await addProducts(dataToJson);

    if (isProductsAdded) {
      return res.status(200).send({ success: true });
    }
    return res.status(400).send({ success: false, error: ADD_PRODUCTS_FAILED });
  } catch (error) {
    return res.status(400).send({ success: false, error: ADD_PRODUCTS_FAILED });
  }
});

router.get('/products/', async (req, res) => {
  const data = await getAllProducts();
  if (data) {
    return res.status(200).send(Object.values(data));
  }
  return res.status(200).send([]);
});

router.get('/products/barcode/', async (req, res) => {
  const data = await getProductByBarCode(Number(req.query.barcode));

  if (data) {
    const id = Object.keys(data)[0];

    return res.status(200).send({ ...data[id] });
  }
  return res.status(200).send({});
});

export default router;
