import mongoose, { Schema, Document } from 'mongoose';

export interface ISearchHistory extends Document {
  location: string;
  filters: {
    propertyType?: string[];
    bedrooms?: {
      min?: number;
      max?: number;
    };
    bathrooms?: {
      min?: number;
      max?: number;
    };
    price?: {
      min?: number;
      max?: number;
    };
    squareFootage?: {
      min?: number;
      max?: number;
    };
    yearBuilt?: {
      min?: number;
      max?: number;
    };
    additionalFeatures?: string[];
  };
  investmentCriteria: {
    rentOnePercentRule: boolean;
    sqftOnePercentRule: boolean;
    combinedRules: boolean;
    thresholdApproaching: boolean;
    thresholdQuantity: number;
  };
  resultCount: number;
  matchingProperties: string[]; // Array of property zpids
  userId?: string; // Optional, for authenticated users
  searchDate: Date;
}

const SearchHistorySchema: Schema = new Schema({
  location: { type: String, required: true },
  filters: {
    propertyType: [{ type: String }],
    bedrooms: {
      min: { type: Number },
      max: { type: Number }
    },
    bathrooms: {
      min: { type: Number },
      max: { type: Number }
    },
    price: {
      min: { type: Number },
      max: { type: Number }
    },
    squareFootage: {
      min: { type: Number },
      max: { type: Number }
    },
    yearBuilt: {
      min: { type: Number },
      max: { type: Number }
    },
    additionalFeatures: [{ type: String }]
  },
  investmentCriteria: {
    rentOnePercentRule: { type: Boolean, default: true },
    sqftOnePercentRule: { type: Boolean, default: false },
    combinedRules: { type: Boolean, default: false },
    thresholdApproaching: { type: Boolean, default: false },
    thresholdQuantity: { type: Number, default: 25 }
  },
  resultCount: { type: Number, required: true },
  matchingProperties: [{ type: String }], // Array of property zpids
  userId: { type: String }, // Optional, for authenticated users
  searchDate: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Create indexes for common queries
SearchHistorySchema.index({ location: 1 });
SearchHistorySchema.index({ userId: 1 });
SearchHistorySchema.index({ searchDate: -1 });
SearchHistorySchema.index({ 
  'investmentCriteria.rentOnePercentRule': 1,
  'investmentCriteria.sqftOnePercentRule': 1,
  'investmentCriteria.combinedRules': 1
});

// Create model only if it doesn't already exist
export default mongoose.models.SearchHistory || mongoose.model<ISearchHistory>('SearchHistory', SearchHistorySchema);
