import express from 'express';
import { getAgencies, getAgencyByCode } from '../models/Agency';

const router = express.Router();

// Get all agencies or filter by department
router.get('/', async (req, res) => {
  try {
    const { department } = req.query;
    const agencies = await getAgencies(department as string);
    res.json({
      success: true,
      data: agencies
    });
  } catch (error) {
    console.error('Error fetching agencies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agencies'
    });
  }
});

// Get agency by code
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const agency = await getAgencyByCode(code);
    
    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Agency not found'
      });
    }

    res.json({
      success: true,
      data: agency
    });
  } catch (error) {
    console.error('Error fetching agency:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agency'
    });
  }
});

export default router; 