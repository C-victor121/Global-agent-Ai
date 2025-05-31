import { Request, Response } from 'express';
import Plan, { IPlan } from '../models/plan.model';

export const createPlan = async (req: Request, res: Response): Promise<Response> => {
  try {
    const newPlan: IPlan = new Plan(req.body);
    await newPlan.save();
    return res.status(201).json(newPlan);
  } catch (error) {
    console.error('Error creating plan:', error);
    return res.status(500).json({ message: 'Error creating plan', error });
  }
};

export const getPlans = async (req: Request, res: Response): Promise<Response> => {
  try {
    const plans = await Plan.find();
    return res.status(200).json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    return res.status(500).json({ message: 'Error fetching plans', error });
  }
};

export const getPlanById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    return res.status(200).json(plan);
  } catch (error) {
    console.error('Error fetching plan by ID:', error);
    return res.status(500).json({ message: 'Error fetching plan by ID', error });
  }
};

export const updatePlan = async (req: Request, res: Response): Promise<Response> => {
  try {
    const updatedPlan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPlan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    return res.status(200).json(updatedPlan);
  } catch (error) {
    console.error('Error updating plan:', error);
    return res.status(500).json({ message: 'Error updating plan', error });
  }
};

export const togglePlanStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    plan.isActive = !plan.isActive;
    await plan.save();
    return res.status(200).json(plan);
  } catch (error) {
    console.error('Error toggling plan status:', error);
    return res.status(500).json({ message: 'Error toggling plan status', error });
  }
};

export const deletePlan = async (req: Request, res: Response): Promise<Response> => {
  try {
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    return res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    return res.status(500).json({ message: 'Error deleting plan', error });
  }
};