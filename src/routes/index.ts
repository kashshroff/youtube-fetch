import { searchVideoData } from './../components/youtube';
import { Router } from 'express';

// Declare router
const router = Router();

// For internal router
// const router = Router({ mergeParams: true });

// Users router
router.use('/search', searchVideoData);

export default router;