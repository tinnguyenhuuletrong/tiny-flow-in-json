test:
# bun run --workspaces test - truntcate output try again later version
	bun run --cwd packages/core test && \
	bun run --cwd packages/json-schema-adapter test

check:
	bun run --cwd packages/core check && \
	bun run --cwd packages/json-schema-adapter check && \
	bun run --cwd packages/web check

web-dev:
	bun run --cwd packages/web dev

web-build:
	bun run --cwd packages/web build