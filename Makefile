test:
	bun run --workspaces test

web-dev:
	bun run --cwd packages/web dev

web-build:
	bun run --cwd packages/web build