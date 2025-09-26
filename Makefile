test:
	bun run --workspaces test

check:
	bun run --workspaces check

web-dev:
	bun run --cwd packages/web dev

web-build:
	bun run --cwd packages/web build