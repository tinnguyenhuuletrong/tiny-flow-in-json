# Dynamic Multi-Step Form

![alt text](.render.svg)

This example demonstrates a creative use case for `tiny-json-workflow`: driving a dynamic multi-step form. Instead of hard-coding the form logic in the UI, we can use a workflow to define the pages, fields, and branching logic of the form.

## Workflow Explained

This workflow models a user registration process with a dynamic path. Here's how it works:

1.  **Account Details:** The first step of the form asks for the user's email and password. The `paramsSchema` for this step defines these two fields.

2.  **Profile Details:** The next step asks for the user's name and a short bio. Again, the `paramsSchema` defines these fields.

3.  **Ask for Account Type:** This is a decision point where the user is asked if they are signing up for a "personal" or "business" account. The path of the form changes based on their answer.

4.  **If the account type is "personal":**
    *   The form skips the next step and goes straight to the end.

5.  **If the account type is "business":**
    *   **Business Details:** The form shows an additional step asking for the company name and VAT number.

6.  **End Registration:** The registration process is complete.

This approach is very powerful because it allows you to change the form's logic (e.g., add new steps, change the order, add more branches) by simply updating the JSON workflow, without having to change the UI code.

## Global State

*   `accountType`: This piece of information is used to decide which path the form should take. It can be set to either `"personal"` or `"business"`.