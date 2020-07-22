import Astral from '../models/Astral';
import { getTexts } from './astrology';

export const updateAstral = async ({ chartId, zodiac, instinto, mandala }) => {
  const { chartId: _chartId, texts } = await getTexts({ chartId });

  try {
    const astral = await Astral.findOneAndUpdate(
      { chartId: _chartId },
      {
        texts,
        zodiac,
        indexes: instinto,
        mandala
      },
      {
        new: true,
        upsert: true
      }
    );
    return astral?._id;
  } catch (error) {
    throw new Error(error);
  }
};
