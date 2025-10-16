# Support Ticket Routing

![alt text](.render.svg)

This example demonstrates a more complex workflow for routing customer support tickets to the correct team. It shows how multiple conditions can be used to create a sophisticated routing logic.

## Workflow Explained

The workflow starts when a new support ticket is created. It then uses a series of decisions to determine the best destination for the ticket.

1.  **Evaluate Ticket:** The workflow first evaluates the ticket's `priority` and `category`.

2.  **Routing Logic:**
    *   If the ticket is `urgent` and `technical`, it is escalated to L2 Tech Support.
    *   If the ticket is about `billing`, it is routed to the Billing Team.
    *   If the customer is a `VIP`, the ticket is tagged as such.
    *   For all other cases, the ticket is assigned to the General Support Queue.

3.  **Send Confirmation:** After the ticket has been routed, a confirmation is sent to the customer.

4.  **End Routing:** The workflow ends.

## Global State

The workflow uses a `ticket` object to store information about the support ticket:

*   `id`: The ticket ID.
*   `priority`: The priority of the ticket (e.g., `low`, `medium`, `high`, `urgent`).
*   `category`: The category of the ticket (e.g., `technical`, `billing`, `general`).
*   `isVip`: A `true` or `false` value indicating if the customer is a VIP.
*   `assignedAgentId`: The ID of the agent assigned to the ticket.
