import mongoose from 'mongoose';

const experimentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  variants: [{ 
    name: { type: String, required: true }, // 'A', 'B', etc.
    label: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed } 
  }],
  isActive: { type: Boolean, default: true },
  metrics: {
    views: { type: Map, of: Number, default: {} },
    conversions: { type: Map, of: Number, default: {} },
    revenue: { type: Map, of: Number, default: {} }
  }
}, { timestamps: true });

export const Experiment = mongoose.model('Experiment', experimentSchema);

const assignmentSchema = new mongoose.Schema({
  experimentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experiment', required: true },
  userId: { type: String, required: true }, // Can be actual ID or anonymous cookie ID
  variantName: { type: String, required: true }
}, { timestamps: true });

assignmentSchema.index({ experimentId: 1, userId: 1 }, { unique: true });

export const ExperimentAssignment = mongoose.model('ExperimentAssignment', assignmentSchema);
