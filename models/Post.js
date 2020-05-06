const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      autopopulate: true,
    },
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  justOne: false,
  autopopulate: true,
});

PostSchema.pre("remove", async function (next) {
  await this.model("Comment").deleteMany({ post: this._id });
  next();
});

PostSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Post", PostSchema);
