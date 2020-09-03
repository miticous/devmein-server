import mongoose from 'mongoose';

export const TextTypes = [
  'DATING',
  'EMOTION',
  'INSTINCT',
  'INTELLECT',
  'LOVE',
  'MARRIAGE',
  'PERSONALITY',
  'SEX'
];

export const astralSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  chartId: {
    type: String,
    required: true
  },
  indexes: {
    type: String,
    required: true
  },
  zodiac: {
    type: String,
    required: true
  },
  mandala: {
    type: String,
    required: true
  },
  texts: [
    {
      text: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      subtitle: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: TextTypes,
        required: true
      }
    }
  ]
});

const Astral = mongoose.model('Astral', astralSchema);

export default Astral;
