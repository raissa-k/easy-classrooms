const cloudinary = require("../middleware/cloudinary");
const Classroom = require("../models/Classroom");
const Comment = require('../models/Comment')

module.exports = {
  getFeed: async (req, res) => {
    try {
      const classrooms = await Classroom.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { classrooms: classrooms, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getClassroom: async (req, res) => {
    try {
      const classroom = await Classroom.findById(req.params.id);
      const comment = await Comment.find({ classroom: req.params.id});
      res.render("classroom.ejs", { classroom: classroom, user: req.user, comment : comment });
    } catch (err) {
      console.log(err);
    }
  },
  createClassroom: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Classroom.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likeClassroom: async (req, res) => {
    try {
      await Classroom.findByIdAndUpdate(
        req.body.id,
        {
          $inc: { likes: 1 },
        }
      );
      res.json('Liked!');
    } catch (err) {
      console.log(err);
    }
  },
  deleteClassroom: async (req, res) => {
    try {
      // Find classroom by id
      let classroom = await Classroom.findById({ _id: req.body.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(classroom.cloudinaryId);
      // Delete classroom from db
      await Classroom.deleteOne({ _id: req.params.id });
      res.json('Deleted classroom');
    } catch (err) {
		console.error(err)
    }
  },
};
