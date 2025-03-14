import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
  zpid: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  yearBuilt?: number;
  propertyType: string;
  lotSize?: number;
  lotUnit?: string;
  description?: string;
  features?: string[];
  images: string[];
  latitude: number;
  longitude: number;
  zestimate?: number;
  rentZestimate?: number;
  customRentEstimate?: number;
  estimateSource: 'zillow' | 'custom';
  meetsRentOnePercentRule: boolean;
  meetsSqftOnePercentRule: boolean;
  meetsCombinedRules: boolean;
  rentToValueRatio: number;
  sqftToValueRatio: number;
  lastUpdated: Date;
  createdAt: Date;
}

const PropertySchema: Schema = new Schema({
  zpid: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  price: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  squareFootage: { type: Number, required: true },
  yearBuilt: { type: Number },
  propertyType: { type: String, required: true },
  lotSize: { type: Number },
  lotUnit: { type: String },
  description: { type: String },
  features: [{ type: String }],
  images: [{ type: String, required: true }],
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  zestimate: { type: Number },
  rentZestimate: { type: Number },
  customRentEstimate: { type: Number },
  estimateSource: { 
    type: String, 
    enum: ['zillow', 'custom'], 
    required: true 
  },
  meetsRentOnePercentRule: { type: Boolean, required: true },
  meetsSqftOnePercentRule: { type: Boolean, required: true },
  meetsCombinedRules: { type: Boolean, required: true },
  rentToValueRatio: { type: Number, required: true },
  sqftToValueRatio: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Create indexes for common queries
PropertySchema.index({ zpid: 1 });
PropertySchema.index({ city: 1, state: 1 });
PropertySchema.index({ zipCode: 1 });
PropertySchema.index({ meetsRentOnePercentRule: 1 });
PropertySchema.index({ meetsSqftOnePercentRule: 1 });
PropertySchema.index({ meetsCombinedRules: 1 });
PropertySchema.index({ rentToValueRatio: -1 });
PropertySchema.index({ sqftToValueRatio: -1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ bedrooms: 1 });
PropertySchema.index({ bathrooms: 1 });
PropertySchema.index({ squareFootage: 1 });
PropertySchema.index({ 
  latitude: 1, 
  longitude: 1 
}, { 
  name: "geospatial" 
});

// Create model only if it doesn't already exist
export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
