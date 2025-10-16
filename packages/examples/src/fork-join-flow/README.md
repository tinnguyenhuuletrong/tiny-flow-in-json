# Fork-Join Flow (Simulated)

![alt text](.render.svg)

This example demonstrates how to simulate a fork-join pattern for parallel execution. In a fork-join pattern, a main process splits into multiple parallel processes and then waits for all of them to complete before it continues.

## The Challenge of True Parallelism

`tiny-json-workflow` does not have a built-in mechanism to enforce a "join" (i.e., wait for multiple branches to complete). The execution of the workflow is handled by an external runner, which processes one step at a time.

## Simulating the Pattern

This workflow simulates a fork-join pattern by defining the structure of the parallel tasks. The actual orchestration of the join logic needs to be handled by the workflow runner.

Here's how the simulation works:

1.  **Fork:** A `fork` task initiates two parallel tasks (`update-search-index` and `send-email-notification`).

2.  **Parallel Tasks:** These two tasks can be executed in parallel by the workflow runner.

3.  **Join:** A `join-tasks` task is defined to synchronize the parallel branches. The workflow runner is responsible for ensuring that this task is only executed after both `update-search-index` and `send-email-notification` have completed.

This example provides the structure for a fork-join workflow, but the implementation of the parallel execution and synchronization logic is left to the developer of the workflow runner.
