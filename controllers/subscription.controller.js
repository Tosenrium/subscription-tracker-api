import Subscription from '../models/subscription.models.js';
import { workflowClient } from '../config/upstash.js';
import { SERVER_URL } from '../config/env.js';



export const createSubscription = async ( req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        const {workflowRunId} = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminders`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        })

        res.status(201).json({ success: true, data: subscription });

    } catch (e) {
        next(e);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.statusCode = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });
        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        next(e);
    }
}

export const getAllSubscriptions = async (req, res, next ) => {
    try {
        const subscriptions = await Subscription.find({}); // Find all subscriptions in the database
        res.status(200).json({
            success: true,
            count: subscriptions.length,
            data: subscriptions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });

        next(error);
    }
}

export const getSubscriptionDetails = async (req, res, next ) => {
    try {
        const subscriptionId = req.params.id; // Get subscription ID from URL parameters
        const userId = req.user.id; // Assuming user ID is available from authentication middleware

        const subscription = await Subscription.findOne({
            _id: subscriptionId,
            user: userId, // Ensure the subscription belongs to the authenticated user
        });

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found or not authorized' });
        }

        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
        next(error);
    }
}