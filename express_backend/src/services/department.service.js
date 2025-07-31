import Department from "../models/department.model.js";

// Error classes defined directly in the service file
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
  }
}

class DepartmentService {
  /**
   * Create a new department
   * @param {Object} departmentData - Department data
   * @returns {Promise<Object>} Created department with success message
   */
  async createDepartment(departmentData) {
    // Check if department already exists
    const existingDepartment = await Department.findOne({ name: departmentData.name });
    if (existingDepartment) {
      throw new ConflictError('Department with this name already exists');
    }

    const department = new Department(departmentData);
    await department.save();

    return {
      message: "Department created successfully",
      _id: department._id,
      name: department.name,
      description: department.description,
      createdAt: department.createdAt.toISOString(),
      updatedAt: department.updatedAt.toISOString()
    };
  }

  /**
   * Get all departments
   * @returns {Promise<Array>} List of departments
   */
  async getAllDepartments() {
    return await Department.find().sort({ createdAt: -1 });
  }

  /**
   * Get department by ID
   * @param {string} id - Department ID
   * @returns {Promise<Object>} Department data
   */
  async getDepartmentById(id) {
    const department = await Department.findById(id);
    if (!department) {
      throw new NotFoundError('Department not found');
    }
    return department;
  }

  /**
   * Update department
   * @param {string} id - Department ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated department with success message
   */
  async updateDepartment(id, updateData) {
    // Check if name is being updated and conflicts with existing
    if (updateData.name) {
      const existingDept = await Department.findOne({ 
        name: updateData.name, 
        _id: { $ne: id } 
      });
      if (existingDept) {
        throw new ConflictError('Another department with this name already exists');
      }
    }

    const department = await Department.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true 
    });

    if (!department) {
      throw new NotFoundError('Department not found');
    }

    return {
      message: "Department updated successfully",
      _id: department._id,
      name: department.name,
      description: department.description,
      createdAt: department.createdAt.toISOString(),
      updatedAt: department.updatedAt.toISOString()
    };
  }

  /**
   * Delete department
   * @param {string} id - Department ID
   * @returns {Promise<Object>} Success message
   */
  async deleteDepartment(id) {
    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      throw new NotFoundError('Department not found');
    }
    return { message: "Department deleted successfully" };
  }
}

export default new DepartmentService();