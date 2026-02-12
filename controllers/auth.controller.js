import mongoose from 'mongoose';

import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import User from '../models/user.models.js';
import {JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res, next) => {
    // SignUp Logic Here

    const session = await mongoose.startSession();
    // Atomic Update
    session.startTransaction();

    try {
        // Create a new user
        const { name, email, password } = req.body;

        // Check if a user already exists

        const existingUser = await User.findOne( { email });

        if(existingUser) {
            const error = new Error('User already exist');
            error.statusCode = 409;
            throw error;
        }

        //if it doesn't exist, Hash the Password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{ name, email, password: hashedPassword}], {session});

        const token = jwt.sign({ userId: newUsers[0]._id}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json( {
            success: true,
            message: 'User successfully created',
            data: {
                token,
                user: newUsers[0],
            }
            }) } catch(error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    // Signin Logic Here

    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne( {email});

        if (!user) {
            const error = new Error('User not found!');
            error.statusCode = 404;
            throw error;
        }
        // if user exists, validate password

        const isPasswordValid = await bcrypt.compare( password, user.password);

        if (!isPasswordValid) {
            const error  = new Error('Invalid Password');
            error.statusCode = 401;
            throw error;
        }
        // if valid, then generate a token

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        //return result
        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user,
            }
        })

    } catch (error) {

        next (error);

    }



}

export const signOut = async (req, res, next) => {
    // SignOut Logic Here

}