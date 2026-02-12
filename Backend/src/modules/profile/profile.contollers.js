const getWelcome = async (req, res) => {
  try {
    const { userId } = req.params;
    const authenticatedUser = req.user; // From auth middleware.

    // Check if user is accessing their own profile
    if (authenticatedUser._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only access your own profile",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Welcome to your profile, ${authenticatedUser.name}!`,
      data: {
        userId: authenticatedUser._id,
        name: authenticatedUser.name,
        email: authenticatedUser.email,
        role: authenticatedUser.role,
        welcomeMessage: `Hello ${authenticatedUser.name}, welcome to your Uber profile! `,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while fetching the welcome message",
    });
  }
};


export { getWelcome };