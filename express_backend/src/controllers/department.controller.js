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
    handleErrorResponse(res, error);
  }
};

/**
 * @desc    Get all departments with pagination
 * @route   GET /departments
 * @access  Public
 */
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await departmentService.getAllDepartments(req.query);
    res.status(200).json(departments);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
    res.status(200).json({ data: department });
  } catch (error) {
    handleErrorResponse(res, error);
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
    handleErrorResponse(res, error);
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
    handleErrorResponse(res, error);
  }
};

/**
 * Unified error handler
 */
function handleErrorResponse(res, error) {
  const statusCode = error.statusCode || 500;
  const response = {
    error: error.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  };

  console.error(`[${error.name}] ${error.message}`);
  res.status(statusCode).json(response);
}