import departmentService from "../services/department.service.js";

/**
 * @desc    Create a new department
 * @route   POST /departments
 * @access  Private/Admin
 */
export const createDepartment = async (req, res, next) => {
  try {
    const result = await departmentService.createDepartment(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.name === 'ConflictError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @desc    Get all departments
 * @route   GET /departments
 * @access  Public
 */
export const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await departmentService.getAllDepartments();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @desc    Get single department by ID
 * @route   GET /departments/:id
 * @access  Public
 */
export const getDepartmentById = async (req, res, next) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);
    res.status(200).json(department);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @desc    Update department
 * @route   PUT /departments/:id
 * @access  Private/Admin
 */
export const updateDepartment = async (req, res, next) => {
  try {
    const result = await departmentService.updateDepartment(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({ error: error.message });
    }
    if (error.name === 'ConflictError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @desc    Delete department
 * @route   DELETE /departments/:id
 * @access  Private/Admin
 */
export const deleteDepartment = async (req, res, next) => {
  try {
    const result = await departmentService.deleteDepartment(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};