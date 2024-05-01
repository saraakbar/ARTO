const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' })
}

const UserController = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, username, email, password } = req.body;

      if (!(email && password && username && firstName && lastName)) {
        return res.status(400).send("All input is required");
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).send("User already exists. Please login");
      }

      const usernameTaken = await User.findOne({ username });

      if (usernameTaken) {
        return res.status(409).send("Username taken.");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).send("Invalid email.");
      }

      if (
        password.length < 8 ||              // Minimum length of 8 characters
        !/[a-z]/.test(password) ||         // At least one lowercase letter
        !/[A-Z]/.test(password) ||         // At least one uppercase letter
        !/[0-9]/.test(password)            // At least one number
      ) {
        return res.status(400).send("Password should be minimum 8 characters long and should include one lowercase letter, one uppercase letter, and at least one number");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await User.create({
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: hashedPassword,
      });

      res.status(201).send("Registration Successful. Please login");

    } catch (error) {
      console.log(error);
      return res.status(500).send("Server Error");
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        return res.status(404).send("User not found");
      }

      if (await bcrypt.compare(password, existingUser.password)) {
        const token_user = { email: existingUser.email, id: existingUser._id, username: existingUser.username };
        const accessToken = generateAccessToken(token_user);
        const response = { message: "Login successful", accessToken: accessToken, username: existingUser.username }
        //console.log(accessToken)
        res.status(201).send(response)
      } else {
        return res.status(400).send('Invalid credentials');
      }

    } catch (error) {
      console.log(error);
      return res.status(500).send("Server Error");
    }
  },

  logout: async (res) => {
    res.set('Authorization', 'Bearer expired-token');
    res.status(200).json({ message: 'Logout successful' });
  },

  favorite: async (req, res) => {
    const { productId } = req.query;
    const userId = req.user.id;
    try {
      const isFavorited = await User.findOne({_id:userId, favorites: productId});
      if (isFavorited) {
        await User.findOneAndUpdate({_id:userId}, { $pull: { favorites: productId } });
        res.json({ message: 'Product removed from favorites' });
      } else {
        await User.findOneAndUpdate({_id:userId}, { $push: { favorites: productId } });
        res.json({ message: 'Product added to favorites' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error processing favorite request' });
    }
  },

  //get ids only
  getFavorites: async (req, res) => {
    const userId = req.user.id;
    try {
      const fav = await User.findOne({_id:userId}).select('favorites -_id')
      const favIds = fav.favorites;
      res.status(200).json(favIds);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  getFavoritesDetails: async (req, res) => {
    const userId = req.user.id;
    try {
      const fav = await User.findOne({_id:userId}).select('favorites -_id').populate('favorites');
      res.status(200).json(fav);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
  /*
  profile: async (req, res) => {
    try {
      const username = req.params.username;
      const currentUser = req.user.username;

      if (username == currentUser) {
        const userInfo = await User.findOne({ username }).select(
          '-suspended -password -__v -_id -role'
        );

        const userId = req.user.id;
        const reviews = await Review.find({ user: userId })
          .populate({
            path: 'teacher',
            select: 'name ID -_id',
          })
          .populate({
            path: 'criteria.criterion',
            model: 'Criteria',
            select: 'name description -_id',
          })
          .select('-__v -user -likes -dislikes');

        const userProfile = {
          userInfo,
          reviews,
        };

        return res.json(userProfile);
      }

      // Added functionality for looking at other people's profiles
      else if (username != currentUser) {
        return res
          .status(418)
          .json({ message: 'You are not authorized to view this profile' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  },


  delete: async (req, res) => {
    try {
      const userId = req.user.id;
      const newUserId = '658b9d04c63ba967ba0b8197';
      //const user = await User.findById(userId).select('_id');
      //await Review.deleteMany({ user: userId });
      const reviews = await Review.find({ user: userId });

      if (reviews.length > 0) {
        for (const review of reviews) {
          review.user = newUserId;
          await review.save();
        }
      }

      const reviewsWithActions = await Review.find({
        $or: [{ likes: userId }, { dislikes: userId }],
      });

      if (reviewsWithActions.length > 0) {
        reviewsWithActions.forEach(async (review) => {
          if (review.likes.includes(userId)) {
            review.likes.pull(userId);
            review.numOfLikes -= 1;
          }
          if (review.dislikes.includes(userId)) {
            review.dislikes.pull(userId);
            review.numOfDislikes -= 1;
          }
          await review.save();
        });
      }

      await User.findByIdAndRemove({ _id: userId })
      return res.status(200).json({ message: 'User deleted successfully' });


    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  getSettings: async (req, res) => {
    const currentUser = req.user.id;
    try {
      const user = await User.findById(currentUser).select('-suspended -role -password -__v -_id');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      else {
        return res.status(200).json(user);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  updateSettings: async (req, res) => {
    const currentUser = req.user.id;
    try {
      const { firstName, lastName, username, email, erp } = req.body;

      const existingEmail = await User.findOne({ email, _id: { $ne: currentUser } });

      if (existingEmail) {
        return res.status(409).send({ message: "Email already exists. Please choose another email." });
      }

      const existingUsername = await User.findOne({ username, _id: { $ne: currentUser } });

      if (existingUsername) {
        return res.status(409).send({ message: "Username already taken. Please choose another username." });
      }

      const existingERP = await User.findOne({ erp, _id: { $ne: currentUser } });

      if (existingERP) {
        return res.status(409).send({ message: "ERP already exists. Please check again." });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).send({ message: "Invalid email." });
      }

      const result = await User.findByIdAndUpdate(currentUser, {
        firstName,
        lastName,
        username,
        erp,
        email,
      });

      res.status(201).send("Update Successful");
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  },


  changePassword: async (req, res) => {
    const currentUser = req.user.id;
    try {
      const { currentPassword, newPassword, confirmNewPassword } = req.body;
      if (!(currentPassword && newPassword && confirmNewPassword)) {
        return res.status(400).send({ message: "All input is required" });
      }
      if (
        newPassword.length < 8 ||
        !/[a-z]/.test(newPassword) ||
        !/[A-Z]/.test(newPassword) ||
        !/[0-9]/.test(newPassword)
      ) {
        return res.status(400).send({ message: "Password should be minimum 8 characters long and should include one lowercase letter, one uppercase letter, and at least one number" });
      }

      if (currentPassword == newPassword) {
        return res.status(400).send({ message: "New password cannot be the same as your current password" });
      }

      const user = await User.findById(currentUser).select('password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      else {
        if (await bcrypt.compare(currentPassword, user.password)) {
          if (newPassword == confirmNewPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const result = await User.findByIdAndUpdate(currentUser, {
              password: hashedPassword
            });
            res.status(201).send("Password Changed Successfully");
          }
          else {
            return res.status(400).send({ message: "Passwords do not match. Try Again." });
          }
        }
        else {
          return res.status(400).send({ message: "Your existing password is incorrect" });
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }, 

  uploadAvatar: async (req, res) => {
    try {
      const username = req.params.username;
      const userid = await User.find({ username: username }).select('_id');
      if (!userid) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
      }

      const prevImg = await User.find({ username: username }).select('img -_id');
      if (Array.isArray(prevImg) && prevImg.length > 0 && prevImg[0].img) {
        const prevImgPath = prevImg[0].img;
        const fs = require('fs');
        fs.unlinkSync(`.${prevImgPath}`);
      }


      const fileName = req.file.filename;
      //const filePath = `${fileName}`;
      const filePath = `/uploads/${fileName}`;

      const result = await User.findByIdAndUpdate(userid, { img: filePath });

      res.status(201).send('File uploaded successfully');

    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Server Error" });
    }

  },

  forgotPassword: async function (req, res, next) {
    const email = req.body.email;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      await sendVerificationEmail(user, req, res, false);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  resetPassword: async function (req, res) {
    const token = req.params.token;
    const { password, confirmPassword } = req.body;

    try {
      const tokenDoc = await Token.findOne({ token: token });

      if (!tokenDoc || !tokenDoc.status) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
      }

      const user = await User.findById(tokenDoc.userId);

      if (!user) {
        return res.status(400).json({ message: 'User not found.' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
      }
      else if (password.length < 8 ||
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password) ||
        !/[0-9]/.test(password)) {
        return res.status(400).send({ message: "Password should be minimum 8 characters long and should include one lowercase letter, one uppercase letter, and at least one number" });
      }
      else {
        // Update the user's password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        // Update the status of the token
        tokenDoc.status = false;
        await tokenDoc.save();

        res.status(200).json({ message: 'Password reset successful.' });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  },
  */

  verifyToken: async function (req, res) {
    const token = req.params.token;

    try {
      const tokenDoc = await Token.findOne({ token });

      if (!tokenDoc || !tokenDoc.status) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
      }

      const user = await User.findById(tokenDoc.userId);

      if (!user) {
        return res.status(400).json({ message: 'User not found.' });
      }

      res.status(200).json({ message: 'Token verified successfully.' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }

  }

}


module.exports = UserController;