import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name?: string;
  image?: string;
  savedProperties: string[]; // Array of property zpids
  savedSearches: string[]; // Array of search IDs
  preferences: {
    defaultLocation?: string;
    preferredPropertyTypes?: string[];
    minBedrooms?: number;
    minBathrooms?: number;
    priceRange?: {
      min?: number;
      max?: number;
    };
    squareFootageRange?: {
      min?: number;
      max?: number;
    };
    yearBuiltRange?: {
      min?: number;
      max?: number;
    };
    investmentCriteria?: {
      rentOnePercentRule: boolean;
      sqftOnePercentRule: boolean;
      combinedRules: boolean;
      thresholdApproaching: boolean;
      thresholdQuantity: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  image: { type: String },
  savedProperties: [{ type: String }], // Array of property zpids
  savedSearches: [{ type: String }], // Array of search IDs
  preferences: {
    defaultLocation: { type: String },
    preferredPropertyTypes: [{ type: String }],
    minBedrooms: { type: Number },
    minBathrooms: { type: Number },
    priceRange: {
      min: { type: Number },
      max: { type: Number }
    },
    squareFootageRange: {
      min: { type: Number },
      max: { type: Number }
    },
    yearBuiltRange: {
      min: { type: Number },
      max: { type: Number }
    },
    investmentCriteria: {
      rentOnePercentRule: { type: Boolean, default: true },
      sqftOnePercentRule: { type: Boolean, default: false },
      combinedRules: { type: Boolean, default: false },
      thresholdApproaching: { type: Boolean, default: false },
      thresholdQuantity: { type: Number, default: 25 }
    }
  }
}, {
  timestamps: true
});

// Create indexes for common queries
UserSchema.index({ email: 1 });
UserSchema.index({ savedProperties: 1 });
UserSchema.index({ savedSearches: 1 });

// Create model only if it doesn't already exist
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
