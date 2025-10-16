# User Onboarding

![alt text](.render.svg)

This example shows a simple user onboarding workflow. It's a good introduction to the basic concepts of `tiny-json-workflow`, including steps, connections, and conditional logic.

## Workflow Explained

1.  **Send Welcome Email:** As soon as a new user signs up, the workflow starts and sends them a welcome email.

2.  **Is Profile Complete?:** The workflow then checks if the user has completed their profile.

3.  **If the profile is complete:**
    *   The workflow ends.

4.  **If the profile is not complete:**
    *   **Send Profile Reminder:** The workflow sends the user a reminder email to encourage them to complete their profile.
    *   The workflow then ends.

## Global State

*   `userId`: A unique identifier for the user.
*   `profileIsComplete`: A `true` or `false` value that indicates whether the user has completed their profile.
