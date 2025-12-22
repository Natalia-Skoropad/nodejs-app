import createHttpError from 'http-errors';
import { Student } from '../models/student.js';

//=================================================================

export const getStudents = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    gender,
    minAvgMark,
    search,
    sortBy = '_id',
    sortOrder = 'asc',
  } = req.query;

  const pageNum = Number(page);
  const perPageNum = Number(perPage);
  const skip = (pageNum - 1) * perPageNum;
  const studentsQuery = Student.find({ userId: req.user._id })
    .skip(skip)
    .limit(perPageNum)
    .lean();

  if (search) {
    studentsQuery.where({ $text: { $search: search } });
  }
  if (gender) {
    studentsQuery.where('gender').equals(gender);
  }
  if (minAvgMark) {
    studentsQuery.where('avgMark').gte(minAvgMark);
  }

  const [totalItems, students] = await Promise.all([
    studentsQuery.clone().countDocuments(),
    studentsQuery
      .skip(skip)
      .limit(perPageNum)
      .sort({ [sortBy]: sortOrder })
      .lean(),
  ]);

  const totalPages = Math.ceil(totalItems / perPageNum);

  res.status(200).json({
    page: pageNum,
    perPage: perPageNum,
    totalItems,
    totalPages,
    students,
  });
};

//=================================================================

export const getStudentById = async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findOne({
    _id: studentId,
    userId: req.user._id,
  });

  if (!student) {
    throw createHttpError(404, 'Student not found');
  }

  res.status(200).json(student);
};

//=================================================================

export const createStudent = async (req, res) => {
  const student = await Student.create({
    ...req.body,
    userId: req.user._id,
  });

  res.status(201).json(student);
};

//=================================================================

export const deleteStudent = async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findOneAndDelete({
    _id: studentId,
    userId: req.user._id,
  });

  if (!student) {
    throw createHttpError(404, 'Student not found');
  }

  res.status(200).send(student);
};

//=================================================================

export const updateStudent = async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findOneAndUpdate(
    { _id: studentId, userId: req.user._id },
    req.body,
    { new: true },
  );

  if (!student) {
    throw createHttpError(404, 'Student not found');
  }

  res.status(200).json(student);
};
