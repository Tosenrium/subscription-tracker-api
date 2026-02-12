import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from  '../models/subscription.models.js';

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !=='active' ) return;

    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())){
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`)} return;

    for(const daysBefore of REMINDERS ) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
        // schedule Reminder

        await sleepUntilReminder(context, `Reminder ${daysBefore} days before .`, reminderDate);

        if(reminderDate.isAfter(dayjs())){
            await sleepUntilReminder(context, `${daysBefore} before reminder`, reminderDate);
        }

        await triggerReminder(context, `${daysBefore} days before reminder.`, subscription);
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => { 
        return Subscription.findById(subscriptionId).populate('user', 'name email')});
 }

 const sleepUntilReminder = async ( context, label, date ) => {
    console.log(`Sleeping until ${label} to reminder at ${Date} `);

    await context.sleepUntil(label, date.toDate());
 }
if (dayjs().isSame(reminderDate, 'day')){
    const triggerReminder = async (context, label, subscription ) => {
        return context.run(label, async () => {
            console.log(`Triggering ${label} reminder`);
            // Send email, SMS, push notifications etc.
        })
}

 }
