# Trial Conversion Flow

This example demonstrates a workflow for managing a 7-day trial period for a user, aiming to convert them to a paid subscriber. It showcases `waitForEvent` and `resumeAfter` by simulating a race condition between a user paying and the trial period reminders being sent.

## Simulating Parallel Execution

This workflow is structured with two parallel branches, originating from the `Initiate Subscription Watch` task. Similar to the `fork-join-flow` example, this pattern relies on the workflow runner to manage the execution.

Crucially, for this example, the runner must implement a **race condition**, not a join. When one branch reaches the `end` step, the runner is responsible for terminating all other active branches for that workflow instance.

## Workflow Explained

1.  **User Registration & Trial Activation:** The workflow begins, and a 7-day trial is activated.

2.  **Forking Paths:** The `Initiate Subscription Watch` task simulates a fork, creating two competing paths:
    *   **Path A (Payment Watcher):** A `waitForEvent` step immediately begins listening for a `billing_plan.active` event. If this event is received, it means the user has subscribed. This path then proceeds to the `end` step. The workflow runner should see this and terminate the reminder path.
    *   **Path B (Reminder Schedule):** This path manages sending reminder emails on a timer before deactivating the trial.

3.  **Reminder Logic (Path B):
    *   **First Reminder:** The workflow pauses for 3 days (`resumeAfter`), then runs the `send_1st_reminder` task.
    *   **Second Reminder:** It then pauses for another 2 days before running the `send_2nd_reminder` task.
    *   **Trial Deactivation:** Finally, it waits 1 more day, then runs the `deactive_trial` task before ending.
    *   **NOTE:** The `send_1st_reminder` and `send_2nd_reminder` task handlers are now responsible for checking the `planType` from the global state and choosing not to send a reminder if the user has already paid.

4.  **Workflow End:** The workflow concludes when either Path A or Path B completes, and the runner terminates the other active path.

## Global State

*   `userId`: A unique identifier for the user.
*   `planType`: A string that can be either `'free'` or `'paid'`, with a default of `'free'`. This state determines whether reminder emails should be sent.