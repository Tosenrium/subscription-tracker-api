import { Router } from "express";
import authorize from '../middlewares/auth.middleware.js';
import { getAllSubscriptions, createSubscription, getUserSubscriptions, getSubscriptionDetails } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, getAllSubscriptions);

subscriptionRouter.get('/:id', authorize, getSubscriptionDetails);

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/', ( req, res) => res.send({title:'UPDATE subscription'}));

subscriptionRouter.delete('/', ( req, res) => res.send({title:'DELETE subscription'}));

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.put('/;id/cancel', ( req, res) => res.send({title:'CANCEL subscription'}));

subscriptionRouter.get('/upcoming-renewals', ( req, res) => res.send({title:'GET upcoming-renewals'}));


export default subscriptionRouter;