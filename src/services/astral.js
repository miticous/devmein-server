import Astral from '../models/Astral';
import { getTexts } from './astrology';

const AstralTextTypes = {
  Amor: 'LOVE',
  Casamento: 'MARRIAGE',
  Emocao: 'EMOTION',
  Instinto: 'INSTINCT',
  Intelecto: 'INTELLECT',
  Namoro: 'DATING',
  Personalidade: 'PERSONALITY',
  Sexo: 'SEX'
};

export const updateAstral = async ({ chartId, zodiac, instinto, mandala }) => {
  const { chartId: _chartId, texts } = await getTexts({ chartId });

  const textsWithTypes = texts?.map(text => ({
    ...text,
    type: AstralTextTypes[text?.title]
  }));

  try {
    const astral = await Astral.findOneAndUpdate(
      { chartId: _chartId },
      {
        texts: textsWithTypes,
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

export const filterAstralTexts = ({ texts, filter }) =>
  texts?.reduce((accumulator, text) => {
    const isTextTypeAvailable = filter.some(item => item === text?.type);

    if (isTextTypeAvailable) {
      return [...accumulator, text];
    }
    return accumulator;
  }, []);
