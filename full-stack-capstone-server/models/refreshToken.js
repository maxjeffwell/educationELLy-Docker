import mongoose from 'mongoose';

const { Schema } = mongoose;

const refreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-delete expired tokens (MongoDB TTL index)
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to check if token is expired
refreshTokenSchema.methods.isExpired = function isExpired() {
  return this.expiresAt < new Date();
};

// Static method to clean up expired tokens (backup for TTL)
refreshTokenSchema.statics.removeExpired = async function removeExpired() {
  return this.deleteMany({ expiresAt: { $lt: new Date() } });
};

// Static method to revoke all tokens for a user (logout everywhere)
refreshTokenSchema.statics.revokeAllForUser = async function revokeAllForUser(userId) {
  return this.deleteMany({ userId });
};

const RefreshToken = mongoose.models.refreshToken || mongoose.model('refreshToken', refreshTokenSchema);

export default RefreshToken;
