const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: {
                values: ["interested", "ignored", "accepted", "rejected"],
                message: "Status entered {value} is not allowed",
            },
        },
    },
    {
        timestamps: true,
    }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function(next) {
  if (this.fromUserId.equals(this.toUserId)) {
    return next(new Error("You cannot send request to yourself"));
  }
  next();
});


module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);

