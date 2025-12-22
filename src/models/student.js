import { Schema, model } from 'mongoose';
import { GENDERS } from '../constants/genders.js';

//=============================================================

const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: GENDERS,
    },
    avgMark: {
      type: Number,
      required: true,
    },
    onDuty: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

//=============================================================

studentSchema.index(
  { name: 'text' },
  {
    name: 'StudentTextIndex',
    weights: { name: 10 },
    default_language: 'english',
  },
);

//=============================================================

export const Student = model('Student', studentSchema);
