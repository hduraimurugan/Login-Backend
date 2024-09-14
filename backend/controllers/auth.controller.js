import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "../mailtrap/emailTemplate.js";


export const signup = async (req, res) => {

    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            throw new Error('All fields are required');
        }
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();
        const user = new User({ 
            name, 
            email, 
            password: hashedPassword ,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24*60*60*1000 // 24 hours
        });

        await user.save();

        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email,verificationToken)

        res.status(201).json({
            success: true, 
            message: 'User created successfully',
            user:{
                ...user._doc,
                password: undefined,
            }
        }

        );

    } catch (error) {
        console.log(`Error signing up: ${error}`);
        res.status(500).json({success: false, message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const {code}= req.body;
    try {
        const user = await User.findOne({ 
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
         });

         if (!user) {
            return res.status(400).json({success: false, message: 'Invalid or expired verification code' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json(
            {
                success: true, 
                message: 'Email verified successfully',
            user:{
                ...user._doc,
                password: undefined,
            } }
        );

    } catch (error) {
        console.log(`Error sending verification email: ${error}`);        
        res.status(500).json({success: false, message: 'Internal Server Error' });
        throw new Error(`Error sending verification email: ${error}`);
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({success: false, message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password); 
        if (!isPasswordValid) {
            return res.status(400).json({success: false, message: 'Invalid email or password' });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastlogin= new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            user:{
                ...user._doc,
                password: undefined,
            }
        });

    } catch (error) {
        console.log(`Error logging in: ${error}`);
        res.status(400).json({success: false, message: error.message });
        
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({success: true, message: 'Logged out successfully' });
} 

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
    const user = await User.findOne({email});
    if (!user) {
        return res.status(400).json({success: false, message: 'User not found' });
    }    

    // Generate a password reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPassswordToken = resetToken;
    user.resetPassswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

    res.status(200).json({success: true, message: 'Password reset link sent to your email' });

    } catch (error) {
        console.log(`Error in forgot password: ${error}`);
        throw new Error(`Error in forgot password: ${error}`);
        res.status(400).json({success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
   
    try {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPassswordToken: token,
            resetPassswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({success: false, message: 'Invalid or expired reset token' });
        }

        //update password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        user.password = hashedPassword;
        user.resetPassswordToken = undefined;
        user.resetPassswordExpiresAt = undefined;

        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({success: true, message: 'Password reset successful' });

    } catch (error) {
        console.log(`Error in reset password:${error}`);
        res.status(400).json({success: false, message: error.message });
    }
}

export const checkAuth = async (req, res) => {

    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({success: false, message: 'User not found' });
        }

        res.status(200).json({success: true, user});
    } catch (error) {
        console.log(`Error in CheckAuth: ${error}`);
        res.status(400).json({success: false, message: error.message });        
    }
}