import { getAllUsers, getUserById, blockUser, unblockUser, deleteUser } from "../services/adminUserService.js";

export const getAllUsersController = async (
  req,
  res,
  next
) => {
  try {
    const users =
      await getAllUsers(
        req.query.role
      );

    res.status(200).json({
      success: true,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await getUserById(
        req.params.id
      );

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const blockUserController = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await blockUser(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: "User blocked successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const unblockUserController = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await unblockUser(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message:
        "User unblocked successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (
  req,
  res,
  next
) => {
  try {
    await deleteUser(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
