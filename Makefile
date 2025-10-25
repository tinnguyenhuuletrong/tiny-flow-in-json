test:
# bun run --workspaces test - truntcate output try again later version
	bun run --cwd packages/core test && \
	bun run --cwd packages/json-schema-adapter test && \
	bun run --cwd packages/svg-export test && \
	bun run --cwd packages/web test && \
	bun run --cwd packages/runtime-durable-state test && \
	bun run --cwd packages/ts-generator test

check:
	bun run --cwd packages/core check && \
	bun run --cwd packages/json-schema-adapter check && \
	bun run --cwd packages/web check && \
	bun run --cwd packages/svg-export check && \
	bun run --cwd packages/runtime-durable-state check && \
	bun run --cwd packages/ts-generator test

web-dev:
	bun run --cwd packages/web dev

web-build:
	bun run --cwd packages/web build

jsonschema-build:
	bun run --cwd packages/core build:schema