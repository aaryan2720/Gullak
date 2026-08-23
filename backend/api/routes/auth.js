const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const auth = require('../middleware/auth');

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
router.post('/register', async (req, res) => {
  const { name, email, phone, password, referralCode } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({
      $or: [
        { 'personalInfo.email': email },
        { 'personalInfo.phone': phone }
      ]
    });

    if (user) {
      return res.status(400).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'User with this email or phone already exists' }
      });
    }

    // Create unique referral code for this user
    const shortName = name.substring(0, 4).toUpperCase();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const userReferralCode = `${shortName}${randNum}`;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    user = new User({
      personalInfo: { name, email, phone },
      auth: { passwordHash },
      referral: { code: userReferralCode, referredBy: referralCode }
    });

    await user.save();

    // Create corresponding blank portfolio record
    const portfolio = new Portfolio({
      userId: user._id,
      summary: {
        totalInvested: 0,
        currentValue: 0,
        totalReturns: 0,
        returnPercentage: 0,
        xirr: 0
      },
      holdings: [],
      assetAllocation: { equity: 0, debt: 0, gold: 0, other: 0 }
    });

    await portfolio.save();

    // Generate JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'GullakSuperSecureJWTSecretKey172903', { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.personalInfo.name,
          email: user.personalInfo.email,
          phone: user.personalInfo.phone,
          kycStatus: user.kyc.status
        }
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Server registration error' } });
  }
});

// @route    POST api/auth/login
// @desc     Authenticate user & get token
// @access   Public
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or phone

  try {
    let user = await User.findOne({
      $or: [
        { 'personalInfo.email': identifier },
        { 'personalInfo.phone': identifier }
      ]
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' }
      });
    }

    const isMatch = await bcrypt.compare(password, user.auth.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' }
      });
    }

    // Update last login
    user.auth.lastLogin = Date.now();
    await user.save();

    // Generate JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'GullakSuperSecureJWTSecretKey172903', { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.personalInfo.name,
          email: user.personalInfo.email,
          phone: user.personalInfo.phone,
          avatar: user.personalInfo.avatar,
          kycStatus: user.kyc.status
        }
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Server login error' } });
  }
});

// @route    GET api/auth/me
// @desc     Get current user profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-auth.passwordHash -auth.salt');
    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Server auth fetch error' } });
  }
});

module.exports = router;
