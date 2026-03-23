import { Experiment, ExperimentAssignment } from '../models/Experiment';

export class ExperimentService {
  
  static async getAssignedVariant(experimentName: string, userId: string) {
    let experiment = await Experiment.findOne({ name: experimentName, isActive: true });
    if (!experiment) return null;

    // 1. Check existing assignment
    let assignment = await ExperimentAssignment.findOne({ experimentId: experiment._id, userId });
    
    if (!assignment) {
      // 2. Randomly pick a variant (A/B)
      const variantIndex = Math.floor(Math.random() * experiment.variants.length);
      const variantName = experiment.variants[variantIndex].name;

      assignment = await ExperimentAssignment.create({
        experimentId: experiment._id,
        userId,
        variantName
      });

      // 3. Track view (Imprint)
      const viewKey = `metrics.views.${variantName}`;
      await Experiment.findByIdAndUpdate(experiment._id, { $inc: { [viewKey]: 1 } });
    }

    return assignment.variantName;
  }

  static async trackConversion(experimentName: string, userId: string, revenue: number = 0) {
    const experiment = await Experiment.findOne({ name: experimentName, isActive: true });
    if (!experiment) return;

    const assignment = await ExperimentAssignment.findOne({ experimentId: experiment._id, userId });
    if (!assignment) return;

    // 1. Track conversion count
    const convKey = `metrics.conversions.${assignment.variantName}`;
    const update: any = { $inc: { [convKey]: 1 } };
    
    // 2. Track revenue if provided
    if (revenue > 0) {
       const revKey = `metrics.revenue.${assignment.variantName}`;
       update.$inc[revKey] = revenue;
    }

    await Experiment.findByIdAndUpdate(experiment._id, update);
  }

  static async listExperiments() {
    return await Experiment.find();
  }
}
