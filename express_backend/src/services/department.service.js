import Department from "../models/department.model.js";
import mongoose from "mongoose";

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class DepartmentService {
  /**
   * Create a new department with case-insensitive name check
   */
  async createDepartment(departmentData) {
    // Validate input
    if (!departmentData.name || !departmentData.description) {
      throw new ValidationError('Name and description are required');
    }

    // Case-insensitive duplicate check
    const existingDepartment = await Department.findOne({
      name: { $regex: new RegExp(`^${departmentData.name}$`, 'i') }
    });

    if (existingDepartment) {
      throw new ConflictError('Department with this name already exists');
    }

    try {
      const department = new Department(departmentData);
      await department.save();
      return this.formatDepartmentResponse(department, 'created');
    } catch (error) {
      // Catch MongoDB duplicate key error (fallback)
      if (error.code === 11000) {
        throw new ConflictError('Department with this name already exists');
      }
      throw error;
    }
  }

  /**
   * Get all departments with optional pagination
   */
  async getAllDepartments(query = {}) {
    const baseUrl = process.env.EXPRESS_URL || 'http://localhost:5000';
    const { search, ...filters } = query;

    const mongoQuery = { ...filters };

    // Case-insensitive search by name or description
    if (search) {
      const regex = new RegExp(search, 'i');
      mongoQuery.$or = [
        { name: regex },
        { description: regex }
      ];
    }

    const departments = await Department.find(mongoQuery).sort({ createdAt: -1 });

    return {
      success: true,
      data: departments
    };
  }



  /**
   * Get department by ID
   */
  async getDepartmentById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid department ID');
    }

    const department = await Department.findById(id);
    if (!department) {
      throw new NotFoundError('Department not found');
    }
    return department;
  }

  /**
   * Update department with comprehensive checks
   */
  async updateDepartment(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid department ID');
    }

    if (updateData.name) {
      const existingDept = await Department.findOne({
        name: { $regex: new RegExp(`^${updateData.name}$`, 'i') },
        _id: { $ne: id }
      });

      if (existingDept) {
        throw new ConflictError('Another department with this name already exists');
      }
    }

    const department = await Department.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!department) {
      throw new NotFoundError('Department not found');
    }

    return this.formatDepartmentResponse(department, 'updated');
  }

  /**
   * Delete department
   */
  async deleteDepartment(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid department ID');
    }

    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      throw new NotFoundError('Department not found');
    }
    return { message: "Department deleted successfully" };
  }

  /**
   * Standardize response format
   */
  formatDepartmentResponse(department, action) {
    return {
      message: `Department ${action} successfully`,
      data: {
        _id: department._id,
        name: department.name,
        description: department.description,
        createdAt: department.createdAt.toISOString(),
        updatedAt: department.updatedAt.toISOString()
      }
    };
  }
}

export default new DepartmentService();